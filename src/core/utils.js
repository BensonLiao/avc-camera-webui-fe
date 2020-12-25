const Cookies = require('js-cookie');
const {getRouter} = require('@benson.liao/capybara-router');
const dayjs = require('dayjs');
const i18n = require('../i18n').default;
const api = require('../core/apis/web-api');
const {validator} = require('../core/validations');
const {MEMBER_PHOTO_MIME_TYPE, RESTRICTED_PORTS, PORT_NUMBER_MIN, PORT_NUMBER_MAX} = require('../core/constants');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const THREE = require('three');
const OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls;
const helvetikerRegular = require('./helvetiker_regular').default;
let camera;
let scene;
let renderer;
let controls;

exports.generate3DText = (text = 'Hello three.js!', container = document.body) => {
  const existCanvas = document.getElementById('3dtext');
  if (existCanvas) {
    container.removeChild(existCanvas);
  }

  const innerBoxSize = this.getInnerBoxSize(container);
  const init = () => {
    camera = new THREE.PerspectiveCamera(45, innerBoxSize.height / innerBoxSize.width, 1, 10000);
    camera.position.set(-400, -200, 600);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    // const galaxyTexure = new THREE.TextureLoader('../resource/galaxy.jpg');
    // scene.background = galaxyTexure;

    const loader = new THREE.FontLoader();
    loader.load(
      `data:text/plain;base64,${helvetikerRegular}`,
      font => {
        let xMid;
        let yMid;

        const color = 0x006699;

        const matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide
        });

        const matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        });

        const shapes = font.generateShapes(text, 30);

        const geometry = new THREE.ShapeBufferGeometry(shapes);

        geometry.computeBoundingBox();

        xMid = -0.9 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        yMid = 0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);

        geometry.translate(xMid, yMid, 0);

        // make shape ( N.B. edge view not visible )

        const textMesh = new THREE.Mesh(geometry, matLite);
        textMesh.position.z = -150;
        scene.add(textMesh);

        // make line shape ( N.B. edge view remains visible )

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, holeShapes);

        const lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, yMid, 0);

          const lineMesh = new THREE.Line(geometry, matDark);
          lineText.add(lineMesh);
        }

        scene.add(lineText);
      },
      null,
      err => {
        console.error('Error: ', err);
      }
    );

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      autoClear: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerBoxSize.width, innerBoxSize.height);
    renderer.domElement.id = '3dtext';
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    // controls.update() must be called after any manual changes to the camera's transform
    controls.update();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    render();
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  init();
  animate();
};

exports.getInnerBoxSize = element => {
  const computedStyle = window.getComputedStyle(element);

  let elementHeight = element.clientHeight; // height with padding
  let elementWidth = element.clientWidth; // width with padding

  elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
  elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

  return {
    width: elementWidth,
    height: elementHeight
  };
};

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
  return new Date((isTimeEpoch ? time : time.getTime()) -
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
  return new Date((isTimeEpoch ? time : time.getTime()) +
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

exports.renderError = error => {
  getRouter().renderError(error);
  try {
    window.scrollTo(0, 0);
  } catch (e) {}

  throw error;
};

exports.validateStreamBitRate = () => values => {
  return validator.validateField({bitRate: values}, {bitRate: StreamSettingsSchema.channelA.props.bitRate});
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
  let ratio;

  img.onerror = reject;
  img.onload = () => {
    ratio = img.height / img.width;
    if (img.width < img.height) {
      img.width = wrapperSize;
      img.height = Math.round(img.width * ratio);
    } else {
      img.height = wrapperSize;
      img.width = Math.round(img.height / ratio);
    }

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
 * @deprecated - old photo editor convert tool
 *
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

// ** Deprecated **
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
  let errorMsg = error || i18n.t('validation.portReserved');
  if (value === '') {
    errorMsg = i18n.t('validation.portEmpty');
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

/**
 * @deprecated
 * @param {string} url
 * @returns {void}
 */
module.exports.pingAndRedirectPage = url => {
  const axios = require('axios');
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
 * Get the stream resolution option with i18n translation, for custom dropdown or `<select>` element to render.
 * @param {string} x - The value of specific stream resolution.
 * @returns {object}
 * - value {any}
 * - label {string}
 */
module.exports.getStreamResolutionOption = x => {
  switch (x) {
    default: return {};
    case StreamResolution[0]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-0')
      };
    case StreamResolution[1]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-1')
      };
    case StreamResolution[2]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-2')
      };
    case StreamResolution[3]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-3')
      };
    case StreamResolution[4]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-4')
      };
    case StreamResolution[5]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-5')
      };
    case StreamResolution[6]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-6')
      };
    case StreamResolution[7]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-7')
      };
    case StreamResolution[8]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-8')
      };
    case StreamResolution[9]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-9')
      };
    case StreamResolution[10]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-10')
      };
    case StreamResolution[11]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-11')
      };
  }
};

/**
 * Get the i18n message of account permission type.
 * @param {string} permission - The account permission type, it can be `root`, `guest`, `viewer` or `superAdmin`.
 * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
 * @returns {string|object|Element}
 */
module.exports.getAccountPermissonI18N = (permission, defaultValue = '') => {
  switch (permission) {
    default: return defaultValue;
    case UserPermission.root:
    case UserPermission.superAdmin:
      return i18n.t('userManagement.accounts.constants.permission-0');
    case UserPermission.guest:
      return i18n.t('userManagement.accounts.constants.permission-1');
    case UserPermission.viewer:
      return i18n.t('userManagement.accounts.constants.permission-2');
  }
};

/**
 * Get the i18n message of event confidence.
 * @param {string} confidence - The event confidence, it can be `low`, `medium` or `high`.
 * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
 * @returns {string|object|Element}
 */
module.exports.getEventConfidenceI18N = (confidence, defaultValue = '') => {
  switch (confidence) {
    default: return defaultValue;
    case Similarity.low:
      return i18n.t('userManagement.events.constants.confidence-0');
    case Similarity.medium:
      return i18n.t('userManagement.events.constants.confidence-1');
    case Similarity.high:
      return i18n.t('userManagement.events.constants.confidence-2');
  }
};

/**
 * Get the i18n message of event recognition type.
 * @param {string} recognitionType - The event recognition type, it can be `registerd`, `unknown` or `fake`.
 * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
 * @returns {string|object|Element}
 */
module.exports.getEventRecognitionTypeI18N = (recognitionType, defaultValue = '') => {
  switch (recognitionType) {
    default: return defaultValue;
    case RecognitionType.fake:
      return i18n.t('userManagement.events.constants.enroll-status-0');
    case RecognitionType.unknown:
      return i18n.t('userManagement.events.constants.enroll-status-1');
    case RecognitionType.registered:
      return i18n.t('userManagement.events.constants.enroll-status-2');
  }
};

/**
 * Get the i18n message of notification card type.
 * @param {string} notificationCardType - The notification card type,
 * it can be `faceRecognition`, `ageGender`, `humanoidDetection`, `tamperAlarm` or `digitalInput`.
 * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
 * @returns {string|object|Element}
 */
module.exports.getNotificationCardTypeI18N = (notificationCardType, defaultValue = '') => {
  switch (notificationCardType) {
    default: return defaultValue;
    case NotificationCardType.faceRecognition:
      return i18n.t('notification.cards.constants.notification-card-0');
    case NotificationCardType.ageGender:
      return i18n.t('notification.cards.constants.notification-card-1');
    case NotificationCardType.humanoidDetection:
      return i18n.t('notification.cards.constants.notification-card-2');
    case NotificationCardType.motionDetection:
      return i18n.t('notification.cards.constants.notification-card-3');
    case NotificationCardType.tamperAlarm:
      return i18n.t('notification.cards.constants.notification-card-4');
    case NotificationCardType.digitalInput:
      return i18n.t('notification.cards.constants.notification-card-5');
  }
};

/**
 * Get the i18n message of notification face recognition condition.
 * @param {string} recognitionType - The face recognition condition, it can be `always`, `success`, `unknown` or `fake`.
 * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
 * @returns {string|object|Element}
 */
module.exports.getNotificationFRConditionI18N = (recognitionType, defaultValue = '') => {
  switch (recognitionType) {
    default: return defaultValue;
    case NotificationFaceRecognitionCondition.always:
      return i18n.t('notification.cards.constants.face-recognition-condition-0');
    case NotificationFaceRecognitionCondition.success:
      return i18n.t('notification.cards.constants.face-recognition-condition-1');
    case NotificationFaceRecognitionCondition.unknown:
      return i18n.t('notification.cards.constants.face-recognition-condition-2');
    case NotificationFaceRecognitionCondition.fake:
      return i18n.t('notification.cards.constants.face-recognition-condition-3');
  }
};

/**
 * Get the i18n message of api error.
 * @param {string} errorMessage - The api error message.
 * @returns {string}
 */
module.exports.getApiErrorMessageI18N = errorMessage => {
  switch (errorMessage) {
    default: return errorMessage;
    case 'Duplicate Member Names':
      return i18n.t('common.toast.Duplicate Member Names');
    case 'Login Failed':
      return i18n.t('common.toast.Login Failed');
    case 'Empty Member Database':
      return i18n.t('common.toast.Empty Member Database');
    case 'Unable to reset a forgotten password':
      return i18n.t('common.toast.Unable to reset a forgotten password');
    case 'Unable to reset a password':
      return i18n.t('common.toast.Unable to reset a password');
    case 'Card Number Limit Exceeded':
      return i18n.t('common.toast.Card Number Limit Exceeded');
    case 'Non-existent Card':
      return i18n.t('common.toast.Non-existent Card');
    case 'Database Size Limit (3 GB) Exceeded':
      return i18n.t('common.toast.Database Size Limit (3 GB) Exceeded');
    case 'Invalid Member Photo':
      return i18n.t('common.toast.Invalid Member Photo');
    case 'Unable to Process the Request (invalid token).':
      return i18n.t('common.toast.Unable to Process the Request (invalid token).');
    case 'Group Number Limit Exceeded':
      return i18n.t('common.toast.Group Number Limit Exceeded');
    case 'Incorrect Password':
      return i18n.t('common.toast.Incorrect Password');
    case 'Wrong Password for Database File':
      return i18n.t('common.toast.Wrong Password for Database File');
    case 'Wrong File Format':
      return i18n.t('common.toast.Wrong File Format');
    case 'Corrupted Zip File':
      return i18n.t('common.toast.Corrupted Zip File');
    case 'Photo Limit of Member Database Exceeded':
      return i18n.t('common.toast.Photo Limit of Member Database Exceeded');
    case 'Photo Size Limit Exceeded':
      return i18n.t('common.toast.Photo Size Limit Exceeded');
    case 'Invalid or Absent Photo':
      return i18n.t('common.toast.Invalid or Absent Photo');
    case 'Non-existent Group':
      return i18n.t('common.toast.Non-existent Group');
    case 'Non-existent Member':
      return i18n.t('common.toast.Non-existent Member');
    case 'Maximum Field Length Exceeded':
      return i18n.t('common.toast.Maximum Field Length Exceeded');
    case 'Duplicate Member Name':
      return i18n.t('common.toast.Duplicate Member Name');
    case 'Duplicate Card Name':
      return i18n.t('common.toast.Duplicate Card Name');
    case 'VMS Reserved Port':
      return i18n.t('common.toast.VMS Reserved Port');
    case 'Software Upgrade Failed':
      return i18n.t('common.toast.Software Upgrade Failed');
    case 'Unable to Complete the Format':
      return i18n.t('common.toast.Unable to Complete the Format');
    case 'Empty SMTP Server Address':
      return i18n.t('common.toast.Empty SMTP Server Address');
    case 'Empty SMTP Account':
      return i18n.t('common.toast.Empty SMTP Account');
    case 'Empty SMTP Account Password':
      return i18n.t('common.toast.Empty SMTP Account Password');
    case 'Empty Sender Email':
      return i18n.t('common.toast.Empty Sender Email');
    case 'Outgoing Email being Disabled':
      return i18n.t('common.toast.Outgoing Email being Disabled');
    case 'Absent or Unmounted SD Card':
      return i18n.t('common.toast.Absent or Unmounted SD Card');
    case 'Maximum Photo Number Exceeded':
      return i18n.t('common.toast.Maximum Photo Number Exceeded');
    case 'Showing No Face':
      return i18n.t('common.toast.Showing No Face');
    case 'Poor Photo Quality':
      return i18n.t('common.toast.Poor Photo Quality');
    case 'Limitation of Yaw Angle is 30 Degrees':
      return i18n.t('common.toast.Limitation of Yaw Angle is 30 Degrees');
    case 'Limitation of Pitch Angle is 20 Degrees':
      return i18n.t('common.toast.Limitation of Pitch Angle is 20 Degrees');
    case 'More Than One Face in the Photo':
      return i18n.t('common.toast.More Than One Face in the Photo');
    case 'Non-existent Photo':
      return i18n.t('common.toast.Non-existent Photo');
    case 'Invalid Key':
      return i18n.t('common.toast.Invalid Key');
    case 'Duplicate Key':
      return i18n.t('common.toast.Duplicate Key');
    case 'Cannot Support Database Downgrade from 30,000 to 3000 People':
      return i18n.t('common.toast.Cannot Support Database Downgrade from 30,000 to 3000 People');
  }
};
