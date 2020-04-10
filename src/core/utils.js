const React = require('react');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const dayjs = require('dayjs');
const {store} = require('react-notifications-component');
const _ = require('../languages');
const {validator} = require('../core/validations');

/**
 * Format time range.
 * @param {Array<Number>} timeRange
 * @returns {String}
 */
exports.formatTimeRange = timeRange => {
  const startHour = `${Math.floor(timeRange[0])}`.padStart(2, '0');
  const startMinute = timeRange[0] % 1 === 0 ? '00' : '30';
  const endHour = `${Math.floor(timeRange[1])}`.padStart(2, '0');
  const endMinute = timeRange[1] % 1 === 0 ? '00' : '30';
  return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
};

/**
 * Format date.
 * @param {String|Date} date
 * @param {Object} options
 * @property {Boolean} withSecond
 * @property {Boolean} withoutTime
 * @property {String} format
 * @returns {String} e.g. "2019/10/2 20:59"
 */
exports.formatDate = (date, {withSecond, withoutTime, format} = {}) => {
  if (!date) {
    return '';
  }

  if (format) {
    return dayjs(date).format(format);
  }

  const formats = ['l', withSecond ? 'LTS' : 'LT'];

  if (withoutTime) {
    return dayjs(date).format(formats[0]);
  }

  return `${dayjs(date).format(formats[0])} ${dayjs(date).format(formats[1])}`;
};

/**
 * Format number. e.g. 1000 -> 1,000
 * @param {Number|String|null} value
 * @returns {String}
 */
exports.formatNumber = value => {
  if (value == null) {
    return '';
  }

  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Set the default language via cookie.
 * This function isn't write to the camera.
 * @param {String} languageCode
 * @returns {void}
 */
exports.setDefaultLanguage = languageCode => {
  Cookies.set(window.config.cookies.language, languageCode, {expires: 30});
};

/**
 * Convert the fastest-validator validator for Formik.
 * @param {Function} validator
 * @param {Array<String>} passwordFields Make sure the confirm password and the password are equal.
 * @returns {Function} inner function `validator`.
 * @param {Object} values field value to be validate.
 * @returns {Object} validate results.
 */
exports.makeFormikValidator = (validator, passwordFields) => values => {
  const result = {};
  const checkResult = validator(values);

  if (passwordFields && values[passwordFields[0]] !== values[passwordFields[1]]) {
    result[passwordFields[1]] = _('Incorrect confirm password.');
  }

  if (checkResult === true) {
    return result;
  }

  checkResult.forEach(item => {
    result[item.field] = item.message;
  });
  return result;
};

exports.renderError = error => {
  getRouter().renderError(error);
  try {
    window.scrollTo(0, 0);
  } catch (e) {}

  throw error;
};

exports.validateStreamBitRate = () => values => {
  const bitRateSchema = {
    bitRate: {
      optional: false,
      type: 'custom',
      pattern: /^[\d]{4,5}$/,
      min: 2048,
      max: 20480,
      check: function (value, schema) {
        if (schema.optional && (value == null || value === '')) {
          return true;
        }

        if (typeof value !== 'string') {
          return this.makeError('string', null, value);
        }

        if (!schema.pattern.test(value)) {
          return this.makeError('stringPattern', schema.pattern, value);
        }

        const number = Number(value);
        if (number < schema.min) {
          return this.makeError('numberMin', schema.min, value);
        }

        if (number > schema.max) {
          return this.makeError('numberMax', schema.max, value);
        }

        return true;
      }
    }
  };
  let result;
  result = validator.validate({bitRate: values}, bitRateSchema);
  console.log('result', result);
  return (result ? result[0].message : '');
};

/**
 * @param {string} title - The success title.
 * @param {string} message - The success message.
 * @returns {undefined}
 */
exports.showSuccessNotification = (title, message) => {
  store.addNotification({
    type: 'default',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'faster', 'slideInRight'],
    animationOut: ['animated', 'faster', 'slideOutRight'],
    dismiss: {duration: 5000},
    content: () => (
      <div className="d-flex bg-white rounded p-3">
        <div><i className="fas fa-check-circle fa-lg text-success"/></div>
        <div className="d-flex flex-column ml-3">
          <div><strong>{title}</strong></div>
          <div className="text-muted">{message}</div>
        </div>
      </div>
    )
  });
};

/**
 * @param {string} title - The error title.
 * @param {string} message - The error message.
 * @returns {undefined}
 */
exports.showErrorNotification = (title, message) => {
  store.addNotification({
    type: 'default',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'faster', 'slideInRight'],
    animationOut: ['animated', 'faster', 'slideOutRight'],
    dismiss: {duration: 5000},
    content: () => (
      <div className="d-flex bg-white rounded p-3">
        <div><i className="fas fa-times-circle fa-lg text-danger"/></div>
        <div className="d-flex flex-column ml-3">
          <div><strong>{title}</strong></div>
          <div className="text-muted">{message}</div>
        </div>
      </div>
    )
  });
};

/**
 * @param {string} imgSrc - The src of the img element.
 * @param {number} zoomRate - `100` mean 100%. `200` means zoom in 2x.
 * @param {number} pictureRotateDegrees - The rotate degrees. 0 ~ 360
 * @returns {Promise<string>} - The base64 jpeg string.
 */
exports.convertPicture = (imgSrc, zoomRate, pictureRotateDegrees) => new Promise((resolve, reject) => {
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const size = 300;
  let rate;

  img.onerror = reject;
  img.onload = () => {
    rate = img.height / img.width;
    if (img.width < img.height) {
      img.width = size;
      img.height = Math.round(img.width * rate);
    } else {
      img.height = size;
      img.width = Math.round(img.height / rate);
    }

    img.width = Math.round(img.width * zoomRate * 0.01);
    img.height = Math.round(img.height * zoomRate * 0.01);

    canvas.width = size;
    canvas.height = size;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(pictureRotateDegrees * Math.PI / 180);
    context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    context.restore();

    resolve(canvas.toDataURL('image/jpeg', 0.9).replace('data:image/jpeg;base64,', ''));
  };

  img.src = imgSrc;
});

exports.capitalizeObjKeyValuePairs = obj => {
  return Object.keys(obj)
    .filter(key => typeof obj[key] === 'string')
    .map(key => {
      let newObj = {};
      newObj.key = key.charAt(0).toUpperCase() + key.substring(1);
      newObj.value = obj[key];
      return newObj;
    });
};

/**
 * Check if the object is empty, not available for some primitive type object like `Number` or `Boolean`.
 * e.g. `isObjectEmpty({}) = true`
 * e.g. `isObjectEmpty([]) = true`
 * e.g. `isObjectEmpty('') = true`
 * @param {Object} obj - The object.
 * @returns {Boolean} - Is the object `obj` empty or not.
 */
exports.isObjectEmpty = obj => {
  return !obj || Object.keys(obj).length === 0;
};

/**
 * Get the number precision.
 * @param {Number} num - The number.
 * @returns {Number} - The number's precision digit.
 */
exports.getPrecision = num => {
  if (!isFinite(num)) {
    return 0;
  }

  let e = 1;
  let p = 0;
  while (Math.round(num * e) / e !== num) {
    e *= 10;
    p++;
  }

  return p;
};

/**
 * Log mock XHR like axios with console.groupCollapsed() and return mock response.
 * @param {Object} req XHR request instance, or if we use library like axios then `req` is the axios request config and contains things like `url`.
 * @see https://github.com/axios/axios#request-config
 * @param {Array<Number, ?Object, ?Object>} res Accept any type of response, or if we use library like axios-mock-adapter then this will be an array in the form of [status, data, headers].
 * @see https://github.com/ctimmerm/axios-mock-adapter
 * @returns {Array<Number, ?Object, ?Object>} Same object as `res`.
 */
exports.mockResponseWithLog = (req, res) => {
  console.groupCollapsed(`[${res[0]}] ${req.method} ${req.url}`);
  console.log('request config:', req);
  console.log('response: [status, data, headers]', res);
  console.groupEnd();
  return res;
};
