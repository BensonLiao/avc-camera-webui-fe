const axios = require('axios');
const download = require('downloadjs');
const progress = require('nprogress');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const dayjs = require('dayjs');
const _ = require('../languages');
const api = require('../core/apis/web-api');
const notify = require('../core/notify');
const {validator} = require('../core/validations');
const {RESTRICTED_PORTS, PORT_NUMBER_MIN, PORT_NUMBER_MAX} = require('../core/constants');
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

exports.onTogglePlayStream = (event, thisRef) => {
  event.preventDefault();
  if (typeof thisRef.fetchSnapshot !== 'function') {
    console.error('this.fetchSnapshot must be a function to get stream data.');
    return false;
  }

  thisRef.setState(prevState => {
    if (prevState.isPlayStream) {
      // Stop play stream
      if (prevState.streamImageUrl) {
        window.URL.revokeObjectURL(prevState.streamImageUrl);
      }

      return {
        isPlayStream: false,
        streamImageUrl: null
      };
    }

    // Get the stream data
    thisRef.fetchSnapshot();
    // Start play stream
    return {isPlayStream: true};
  });
};

exports.onClickDownloadImage = event => {
  event.preventDefault();
  api.system.getSystemDateTime()
    .then(({data}) => {
      const dateTime = data.deviceTime.replace(/:|-/g, '').replace(/\s+/g, '-');
      axios.get('/api/snapshot', {
        timeout: 1500,
        responseType: 'blob'
      })
        .then(response => {
          download(response.data, `${dateTime}.jpg`);
        })
        .catch(error => {
          progress.done();
          notify.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
};

exports.toggleFullscreen = (event, streamPlayerRef) => {
  event.preventDefault();

  let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

  if (!isInFullScreen) {
    if (streamPlayerRef.current.requestFullscreen) {
      streamPlayerRef.current.requestFullscreen();
    } else if (streamPlayerRef.current.mozRequestFullScreen) {
      streamPlayerRef.current.mozRequestFullScreen();
    } else if (streamPlayerRef.current.webkitRequestFullScreen) {
      streamPlayerRef.current.webkitRequestFullScreen();
    } else if (streamPlayerRef.current.msRequestFullscreen) {
      streamPlayerRef.current.msRequestFullscreen();
    }
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

exports.validateStreamBitRate = () => values => {
  let result;
  console.log(StreamSettingsSchema);
  console.log(StreamSettingsSchema.channelA.props.bitRate);
  result = validator.validate({bitRate: values}, StreamSettingsSchema.channelA.props.bitRate);
  return (result === true ? '' : result[0].message);
};

/**
 * @param {string} imgSrc - The src of the img element.
 * @param {number} zoomFactor - Zoom factor as a number, `2` is 2x.
 * @param {number} pictureRotateDegrees - The rotate degrees. 0 ~ 360
 * @param {object} offset - offset of the photo
 * @param {number} wrapperSize - size of the photo container
 * @returns {Promise<string>} - The base64 jpeg string.
 */
exports.convertPicture = (imgSrc, zoomFactor, pictureRotateDegrees, offset, wrapperSize) => new Promise((resolve, reject) => {
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
    const offsetX = ((img.height - size) / 2) * (offset ? offset.x / maxOffset : 0);
    const offsetY = ((img.height - size) / 2) * (offset ? offset.y / maxOffset : 0);

    canvas.width = size;
    canvas.height = size;
    context.translate((canvas.width / 2) + offsetX, (canvas.height / 2) + offsetY);
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
  let errorMsg = error || _('Not a valid port number, please use another number.');
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
