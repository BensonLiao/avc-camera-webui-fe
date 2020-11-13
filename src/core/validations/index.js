const FastestFormikValidator = require('./fastest-formik-validator');
const i18n = require('../../i18n').default;

const customValidator = new FastestFormikValidator({
  messages: {
    required: i18n.t('validation-required'),
    string: i18n.t('validation-string'), // deprecated
    stringEmpty: i18n.t('validation-stringEmpty'), // deprecated
    stringMin: i18n.t('validation-stringMin'),
    stringMax: i18n.t('validation-stringMax'),
    stringLength: i18n.t('validation-stringLength'), // deprecated
    stringPattern: i18n.t('validation-stringPattern'),
    stringContains: i18n.t('validation-stringContains'), // deprecated
    stringEnum: i18n.t('validation-stringEnum'), // deprecated
    number: i18n.t('validation-number'), // deprecated
    numberMin: i18n.t('validation-numberMin'), // deprecated
    numberMax: i18n.t('validation-numberMax'), // deprecated
    numberEqual: i18n.t('validation-numberEqual'), // deprecated
    numberNotEqual: i18n.t('validation-numberNotEqual'), // deprecated
    numberInteger: i18n.t('validation-numberInteger'), // deprecated
    numberPositive: i18n.t('validation-numberPositive'), // deprecated
    numberNegative: i18n.t('validation-numberNegative'), // deprecated
    array: i18n.t('validation-array'), // deprecated
    arrayEmpty: i18n.t('validation-arrayEmpty'), // deprecated
    arrayMin: i18n.t('validation-arrayMin'), // deprecated
    arrayMax: i18n.t('validation-arrayMax'), // deprecated
    arrayLength: i18n.t('validation-arrayLength'), // deprecated
    arrayContains: i18n.t('validation-arrayContains'), // deprecated
    arrayEnum: i18n.t('validation-arrayEnum'), // deprecated
    boolean: i18n.t('validation-boolean'), // deprecated
    function: i18n.t('validation-function'), // deprecated
    date: i18n.t('validation-date'), // deprecated
    dateMin: i18n.t('validation-dateMin'), // deprecated
    dateMax: i18n.t('validation-dateMax'), // deprecated
    forbidden: i18n.t('validation-forbidden'), // deprecated
    email: i18n.t('validation-email'), // reserved
    url: i18n.t('validation-url'), // deprecated
    confirmEqual: i18n.t('These passwords didn\'t match.'),

    stringContainsLowerCaseLatter: i18n.t('validation-stringContainsLowerCaseLatter'),
    stringContainsUpperCaseLatter: i18n.t('validation-stringContainsUpperCaseLatter'),
    stringContainsNumber: i18n.t('validation-stringContainsNumber'),
    stringAbortSpecialCharacters: i18n.t('validation-stringAbortSpecialCharacters'),
    stringAcceptSpecialCharacters: i18n.t('validation-stringAcceptSpecialCharacters'),
    birthday: i18n.t('validation-birthday'), // deprecated
    countryCode: i18n.t('validation-countryCode') // reserved
  }
});

customValidator.add('confirmEqual', (value, schema, currentFieldName, fullObjectValue) => {
  if (!schema.field) {
    throw Error(`type '${schema.type}' must specific a field to compare with.`);
  }

  if (value !== fullObjectValue[schema.field]) {
    return this.validator.makeError('confirmEqual');
  }

  return true;
});

exports.validator = customValidator;
