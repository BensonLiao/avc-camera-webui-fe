const React = require('react');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const dayjs = require('dayjs');
const {store} = require('react-notifications-component');
const _ = require('../languages');

exports.formatTimeRange = timeRange => {
  /*
  @param timeRange {Array<Number>}
  @returns {String}
   */
  const startHour = `${Math.floor(timeRange[0])}`.padStart(2, '0');
  const startMinute = timeRange[0] % 1 === 0 ? '00' : '30';
  const endHour = `${Math.floor(timeRange[1])}`.padStart(2, '0');
  const endMinute = timeRange[1] % 1 === 0 ? '00' : '30';
  return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
};

exports.formatDate = (date, {withSecond, withoutTime, format} = {}) => {
  /*
  Format date.
  @param date {String|Date}
  @param options {Object}
    withSecond: {Boolean}
    withoutTime: {Boolean}
    format {String}
  @returns {String} eg: "2019/10/2 20:59"
   */
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

exports.formatNumber = value => {
  /*
  1000 -> 1,000
  @param value {Number|String|null}
  @returns {String}
   */
  if (value == null) {
    return '';
  }

  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.setDefaultLanguage = languageCode => {
  /*
  Set the default language via cookie.
  This function isn't write to the camera.
  @param languageCode {String}
   */
  Cookies.set(window.config.cookies.language, languageCode, {expires: 30});
};

exports.makeFormikValidator = (validator, passwordFields) => values => {
  /*
  Convert the fastest-validator validator for Formik.
  @param validator {Function}
  @param passwordFields {Array<String>} Make sure the confirm password and the password are equal.
  @returns {Function} (values) =>
   */
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

/**
 * @param {string} title - The success title.
 * @param {string} message - The success message.
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

exports.mockResponseWithLog = (req, res) => {
  /*
  Log mock XHR like axios with console.groupCollapsed() and return mock response.
  @param req {Object} XHR request instance, or if we use library like axios then `config` is the axios config and contains things like the url. ref: https://github.com/axios/axios#request-config
  @param res {*} Accept any type of response, or if we use library like axios-mock-adapter then this will be an array in the form of [status, data, headers]. ref: https://github.com/ctimmerm/axios-mock-adapter
  @returns {*} Same as @param res
   */
  console.groupCollapsed('mock axios xhr log:');
  console.log('req config:', req);
  console.log('res: [status, data, headers]', res);
  console.groupEnd();
  return res;
};
