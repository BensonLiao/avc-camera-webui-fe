const _ = require('../languages');

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
