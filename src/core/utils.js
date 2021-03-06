
const {useEffect, useRef} = require('react');
const Cookies = require('js-cookie');
const {getRouter} = require('@benson.liao/capybara-router');
const dayjs = require('dayjs');
const i18n = require('../i18n').default;
const api = require('../core/apis/web-api');
const {validator} = require('../core/validations');
const {MEMBER_PHOTO_MIME_TYPE, RESTRICTED_PORTS, PORT_NUMBER_MIN, PORT_NUMBER_MAX} = require('../core/constants');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
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
 * Use addTimezoneOffset when submitting card timePeriods to api
 * @param {Object} card - single card object
 * @returns {Object} - altered time periods card
 */
exports.parseCardTimePeriods = card => {
  return card.timePeriods.map(timePeriod => ({
    ...timePeriod,
    start: this.addTimezoneOffset(new Date(timePeriod.start)).toISOString(),
    end: this.addTimezoneOffset(new Date(timePeriod.end)).toISOString()
  }));
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
 * Split array of data into an array of arrays by page size.
 * @param {array} data - The input data.
 * @param {number} size - Number of data per page to show. default is `10`
 * @returns {array} - Pagination data.
 */
module.exports.getPaginatedData = (data, size = 10) => {
  if (!this.isArray(data)) {
    throw new TypeError('The input data must be an array.');
  }

  if (isNaN(size)) {
    throw new TypeError('The page size must be a number.');
  }

  if (size < 1) {
    throw new RangeError('The page size must be a positive number.');
  }

  const pageData = [];
  for (let i = 0; i < data.length / size; i++) {
    pageData.push(data.slice(i * size, (i + 1) * size));
  }

  return pageData;
};

/**
 * This hook gets called only when the dependencies change but not during initial render.
 *
 * @param {EffectCallback} effect The `useEffect` callback function.
 * @param {DependencyList} deps An array of dependencies.
 * @return {Function} deps An array of dependencies.
 *
 * @example
 * ```
 *  useNonInitialEffect(()=>{
 *      alert("Dependency changed!");
 * },[dependency]);
 * ```
 */
module.exports.useNonInitialEffect = (effect, deps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const initialRender = useRef(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let effectReturns = () => {};

    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effectReturns = effect();
    }

    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * Makes sure the ref.current property is set to a value that is an array
 * A typechecking mechanism to ensure the property is correct
 *
 * @param {Ref} ref
 * @param {Array} array
 * @return {void}
 */
module.exports.setRefToArray = (ref, array) => {
  if (!Array.isArray(array)) {
    throw new Error('refSetter only accepts arrays');
  }

  ref.current = array;
};

/**
 * Help to convert hex color code to rgba format and hand over the control on alpha.
 * @param {*} hexCode - the hex code. e.g `#000000`
 * @param {*} alpha - the ouput opacity, default is `1`.
 * @returns {string}
 */
module.exports.hexToRGBA = (hexCode, alpha = 1) => {
  let r = 0;
  let g = 0;
  let b = 0;

  // 3 digits
  if (hexCode.length === 4) {
    r = '0x' + hexCode[1] + hexCode[1];
    g = '0x' + hexCode[2] + hexCode[2];
    b = '0x' + hexCode[3] + hexCode[3];

  // 6 digits
  } else if (hexCode.length === 7) {
    r = '0x' + hexCode[1] + hexCode[2];
    g = '0x' + hexCode[3] + hexCode[4];
    b = '0x' + hexCode[5] + hexCode[6];
  }

  return `rgba(${Number(r)},${Number(g)},${Number(b)},${alpha})`;
};

/**
   * Tansform coordinate from api data to canvas directional line generator format
   * @param {object} data
   * @returns {object}
   */
module.exports.transformLineCoordinates = (data = [{
  x: 0,
  y: 0
}, {
  x: 0,
  y: 0
}]) => {
  const coordinates = [];
  data.forEach(coordinate => {
    coordinates.push(coordinate.x, coordinate.y);
  });

  return coordinates;
};

/**
 * Convert into canvas coordinate based on screen size 1920*1080
 * @param {object} data
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} workareaWidth
 * @param {number} workareaHeight
 * @returns {array}
 */
module.exports.convertToCanvasLineCoordinate = (
  data,
  canvasWidth = 1200,
  canvasHeight = 675,
  workareaWidth = 1920,
  workareaHeight = 1080
) => {
  const [x1, y1, x2, y2] = data;
  const xOffset = Math.round((workareaWidth - canvasWidth) / 2);
  const yOffset = Math.round((workareaHeight - canvasHeight) / 2);

  return [x1 - xOffset, y1 - yOffset, x2 - xOffset, y2 - yOffset];
};

/**
 * Convert into api coordinate based on screen size 1920*1080
 * @param {object} data
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} workareaWidth
 * @param {number} workareaHeight
 * @returns {array}
 */
module.exports.convertToApiLineCoordinate = (
  data,
  canvasWidth = 1200,
  canvasHeight = 675,
  workareaWidth = 1920,
  workareaHeight = 1080
) => {
  const {x, y} = data;
  const xOffset = Math.round((workareaWidth - canvasWidth) / 2);
  const yOffset = Math.round((workareaHeight - canvasHeight) / 2);

  return {
    x: Math.round(x + xOffset),
    y: Math.round(y + yOffset)
  };
};

/**
 * Convert into canvas coordinate based on screen size 1920*1080
 * @param {object} data
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} workareaWidth
 * @param {number} workareaHeight
 * @returns {object}
 */
module.exports.convertToCanvasRectCoordinate = (
  data,
  canvasWidth = 1200,
  canvasHeight = 675,
  workareaWidth = 1920,
  workareaHeight = 1080
) => {
  const {left, top, bottom, right} = data;
  const xOffset = Math.round((workareaWidth - canvasWidth) / 2);
  const yOffset = Math.round((workareaHeight - canvasHeight) / 2);

  return {
    x: left - xOffset,
    y: top - yOffset,
    width: right - left,
    height: bottom - top
  };
};

/**
 * Convert into api coordinate based on screen size 1920*1080
 * @param {object} data
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} workareaWidth
 * @param {number} workareaHeight
 * @returns {object}
 */
module.exports.convertToApiRectCoordinate = (
  data,
  canvasWidth = 1200,
  canvasHeight = 675,
  workareaWidth = 1920,
  workareaHeight = 1080
) => {
  const {left, top, width, height} = data;
  const xOffset = Math.round((workareaWidth - canvasWidth) / 2);
  const yOffset = Math.round((workareaHeight - canvasHeight) / 2);
  const offsetLeft = left + xOffset;
  const offsetTop = top + yOffset;

  return {
    bottom: Math.round(offsetTop + height),
    left: Math.round(offsetLeft),
    right: Math.round(offsetLeft + width),
    top: Math.round(offsetTop)
  };
};
