const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
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

exports.getCookie = cookieKey => {
  return Cookies.get(cookieKey);
};
