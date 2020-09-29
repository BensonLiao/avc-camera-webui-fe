const axios = require('axios');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const dayjs = require('dayjs');
const _ = require('../languages');
const api = require('../core/apis/web-api');
const {validator} = require('../core/validations');
const {MEMBER_PHOTO_MIME_TYPE, RESTRICTED_PORTS, PORT_NUMBER_MIN, PORT_NUMBER_MAX} = require('../core/constants');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');

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
 * Get time with offset.
 * this is used to normalise the UTC time from server
 * @param {Date} time - e.g. 9/21 11:00am GMT+8
 * @returns {Date} - e.g. 9/21 7:00pm GMT+8
 */
exports.addTimezoneOffset = time => {
  const isTimeEpoch = typeof time === 'number';
  return new Date(isTimeEpoch ? time : time.getTime() -
  ((isTimeEpoch ? new Date(time) : time).getTimezoneOffset() * 60 * 1000));
};

/**
 * Get time without offset (UTC).
 * this is used to condition time to UTC for server
 * @param {Date} time - e.g. 9/21 7:00pm GMT+8
 * @returns {Date} - e.g. 9/21 11:00am GMT+8
 */
exports.subtractTimezoneOffset = time => {
  const isTimeEpoch = typeof time === 'number';
  return new Date(isTimeEpoch ? time : time.getTime() +
  ((isTimeEpoch ? new Date(time) : time).getTimezoneOffset() * 60 * 1000));
};

/**
 * Get hours from time.
 * @param {String} time - e.g. "12:23"
 * @returns {Number} e.g. 12
 */
exports.getHours = time => {
  if (typeof time !== 'string') {
    return 'time must be string';
  }

  if (time === '') {
    return 'time must not be empty';
  }

  return Number(time.split(':')[0]);
};

/**
 * Get minutes from time.
 * @param {String} time - e.g. "12:23"
 * @returns {Number} e.g. 23
 */
exports.getMinutes = time => {
  if (typeof time !== 'string') {
    return 'time must be string';
  }

  if (time === '') {
    return 'time must not be empty';
  }

  return Number(time.split(':')[1]);
};

/**
 * Set datetime from time.
 * @param {String} time - e.g. "12:23"
 * @returns {Date} A `Date` object represent time
 */
exports.setDateTime = time => {
  if (typeof time !== 'string') {
    return 'time must be string';
  }

  if (time === '') {
    return 'time must not be empty';
  }

  const date = new Date();
  date.setMinutes(this.getMinutes(time));
  date.setHours(this.getHours(time));
  return date;
};

/**
 * Set time from datetime.
 * @param {Date} time - A `Date` object represent time
 * @returns {String} e.g. "15:23"
 */
exports.setTime = time => {
  if (!dayjs(time).isValid()) {
    return 'time must be a date object';
  }

  return `${time.getHours()}:${time.getMinutes()}`;
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
  let result;
  result = validator.validate({bitRate: values}, {bitRate: StreamSettingsSchema.channelA.props.bitRate});
  return (result === true ? '' : result[0].message);
};

/**
 * @param {string} str - The base64 jpeg string.
 * @param {string} unit - The base64 jpeg string size unit. default is `byte`
 * @returns {number} - The size of base64 jpeg string in bytes, rounded to nearest integer.
 */
exports.getBase64Size = (str, unit = 'byte') => {
  if (typeof str !== 'string') {
    throw Error('Base64 encoded data must be string.');
  }

  if (unit !== 'byte' && unit !== 'kb') {
    throw Error('File size unit must be byte or kb.');
  }

  // Ref: https://en.wikipedia.org/wiki/Base64#Padding
  const padding = str.endsWith('==') ? 2 : (str.endsWith('=') ? 1 : 0);
  let fileSize = (str.length * (3 / 4)) - padding;
  fileSize = unit === 'kb' ? fileSize / 1024 : fileSize;
  return Math.round(fileSize);
};

/**
 * Convert cropper image to specific size.
 * @param {string} imgSrc - The base64 jpeg string or a url to image src.
 * @param {number} wrapperSize - size of the photo container. default is `300px`
 * @returns {Promise<string>} - The converted base64 jpeg string.
 */
exports.convertCropperImage = (imgSrc, wrapperSize = 300) => new Promise((resolve, reject) => {
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  img.onerror = reject;
  img.onload = () => {
    img.width = wrapperSize;
    img.height = wrapperSize;
    canvas.width = wrapperSize;
    canvas.height = wrapperSize;

    context.translate(canvas.width / 2, canvas.height / 2);
    context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    context.restore();

    resolve(canvas.toDataURL(MEMBER_PHOTO_MIME_TYPE).replace(`data:${MEMBER_PHOTO_MIME_TYPE};base64,`, ''));
  };

  img.src = imgSrc;
});

/**
 * @param {string} imgSrc - The src of the img element.
 * @param {number} zoomFactor - Zoom factor as a number, `2` is 2x.
 * @param {number} pictureRotateDegrees - The rotate degrees. 0 ~ 360
 * @param {object} offset - offset of the photo
 * @param {number} wrapperSize - size of the photo container
 * @returns {Promise<string>} - The base64 jpeg string.
 */
exports.convertPictureURL = (
  imgSrc,
  zoomFactor = 1,
  pictureRotateDegrees = 0,
  offset = {
    x: 0,
    y: 0
  },
  wrapperSize = 88
) => new Promise((resolve, reject) => {
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const size = 300;
  const maxOffset = ((wrapperSize * zoomFactor) - wrapperSize) / zoomFactor / 2;
  let ratio;

  img.onerror = reject;
  img.onload = () => {
    ratio = img.height / img.width;
    if (img.width < img.height) {
      img.width = size;
      img.height = Math.round(img.width * ratio);
    } else {
      img.height = size;
      img.width = Math.round(img.height / ratio);
    }

    img.width = Math.round(img.width * zoomFactor);
    img.height = Math.round(img.height * zoomFactor);

    // Offset amount
    const offsetX = ((img.width - size) / 2) * (offset ? offset.x && (offset.x / maxOffset) : 0);
    const offsetY = ((img.height - size) / 2) * (offset ? offset.y && (offset.y / maxOffset) : 0);

    canvas.width = size;
    canvas.height = size;
    context.translate((canvas.width / 2) + offsetX, (canvas.height / 2) + offsetY);
    context.rotate(pictureRotateDegrees * Math.PI / 180);
    context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    context.restore();

    resolve(canvas.toDataURL(MEMBER_PHOTO_MIME_TYPE).replace(`data:${MEMBER_PHOTO_MIME_TYPE};base64,`, ''));
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
 * Check for duplicate value.
 * @param {array} array - The array to check.
 * @param {string} value - The string to compare with.
 * @param {string} error - (optional) Error message for Formik validator
 * @returns {Boolean} - Return true if duplicate value found.
 * @returns {string} - (optional) Return error message for Formik validation if duplicate value found.
 */
exports.duplicateCheck = (array, value, error) => {
  const check = array.some(val => val === value);
  if (check) {
    return error || check;
  }

  return check;
};

/**
 * Check for validated port number.
 * @param {string} value - The string to compare with.
 * @param {string} error - (optional) Error message for Formik validator
 * @returns {Boolean} - Return true if duplicate value found.
 * @returns {string} - (optional) Return error message for Formik validation if duplicate value found.
 */
exports.validatedPortCheck = (value, error) => {
  const check = (value.match(/^[\d]{1,5}$/) === null) ||
    (value.match(/^0+/) !== null) ||
    (Number(value) < PORT_NUMBER_MIN) ||
    (Number(value) > PORT_NUMBER_MAX) ||
    RESTRICTED_PORTS.some(val => val === value);
  let errorMsg = error || _('The specified port is reserved by system or in use!');
  if (value === '') {
    errorMsg = _('The port number must not empty.');
    return errorMsg;
  }

  if (check) {
    return errorMsg;
  }

  return check;
};

module.exports.isArray = arg => Object.prototype.toString.call(arg) === '[object Array]';

module.exports.isDate = arg => Object.prototype.toString.call(arg) === '[object Date]' &&
  !isNaN(arg.getTime());

module.exports.pingAndRedirectPage = url => {
  const test = () => {
    axios.get(url, {responseType: 'document'})
      .then(() => {
        location.href = url;
      })
      .catch(() => {
        setTimeout(test, 500);
      });
  };

  test();
};

/**
 * Check if the server has shutdown; Device has not shutdown if ping succeeds, proceed if ping fails.
 * @param {func} resolve - Resolve for Promise to proceed after shutdown.
 * @param {number} interval - Duration of the timeout interval.
 * @param {string} type - Ping type.
 * @returns {object} - A Promise resolve object if shutdown is successful.
 */
module.exports.pingToCheckShutdown = (resolve, interval, type = 'web') => {
  const test = () => {
    api.ping(type)
      .then(() => {
        setTimeout(test, interval);
      })
      .catch(() => {
        resolve();
      });
  };

  test();
};

/**
 * Check if the server has started up; Device has not started up if ping fails, proceed if ping succeeds.
 * @param {number} interval - Duration of the timeout.
 * @param {string} type - Ping type.
 * @returns {redirect} - Reloads after device has started up.
 */
module.exports.pingToCheckStartupAndReload = (interval, type = 'app') => {
  const test = () => {
    api.ping(type)
      .then(() => {
        location.reload();
      })
      .catch(() => {
        setTimeout(test, interval);
      });
  };

  test();
};

/**
 * The four functions below are for FR ROI Update and Getting FR Settings
 */

exports.decompressMapping = source => {
  const result = new Array(100);
  const _numberMapping = [128, 64, 32, 16, 8, 4, 2, 1];

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(100);
    for (let row = 0; row < 100; row += 1) {
      result[col][row] = (source[col][Math.floor(row / 8)] & _numberMapping[row % 8]) === 0 ? 0 : 1;
    }
  }

  return result;
};

module.exports.convertMappingToPercentage = mapping => {
  const data = this.decompressMapping(mapping);
  const result = {
    x: null,
    y: null,
    width: null,
    height: null
  };

  for (let col = 0; col < 100; col += 1) {
    for (let row = 0; row < 100; row += 1) {
      if (data[col][row]) {
        result.x = row;
        result.y = col;
        break;
      }
    }

    if (result.x != null) {
      break;
    }
  }

  for (let col = 99; col >= 0; col -= 1) {
    for (let row = 99; row >= 0; row -= 1) {
      if (data[col][row]) {
        result.width = row - result.x + 1;
        result.height = col - result.y + 1;
        break;
      }
    }

    if (result.width != null) {
      break;
    }
  }

  return result.x == null ? null : result;
};

exports.compressMapping = source => {
  const result = new Array(100);
  const _numberMapping = [128, 64, 32, 16, 8, 4, 2, 1];

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(13);
    for (let row = 0; row < 13; row += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        if (source[col][(row * 8) + bit]) {
          value |= _numberMapping[bit];
        }
      }

      result[col][row] = value;
    }
  }

  return result;
};

module.exports.convertPercentageToMapping = area => {
  const result = new Array(100);

  const leftTopPoint = {
    x: area.x,
    y: area.y
  };
  const rightBottomPoint = {
    x: area.x + area.width - 1,
    y: area.y + area.height - 1
  };

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(100);
    for (let row = 0; row < 100; row += 1) {
      if (
        col >= leftTopPoint.y && row >= leftTopPoint.x &&
        col <= rightBottomPoint.y && row <= rightBottomPoint.x
      ) {
        result[col][row] = 1;
      } else {
        result[col][row] = 0;
      }
    }
  }

  return this.compressMapping(result);
};

