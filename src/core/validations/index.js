const Validator = require('fastest-validator');
const i18n = require('../../i18n').default;

exports.validator = new Validator({
  messages: {
    required: i18n.t('validation-required'),
    string: i18n.t('validation-string'),
    stringEmpty: i18n.t('validation-stringEmpty'),
    stringMin: i18n.t('validation-stringMin'),
    stringMax: i18n.t('validation-stringMax'),
    stringLength: i18n.t('validation-stringLength'),
    stringPattern: i18n.t('validation-stringPattern'),
    stringContains: i18n.t('validation-stringContains'),
    stringEnum: i18n.t('validation-stringEnum'),
    number: i18n.t('validation-number'),
    numberMin: i18n.t('validation-numberMin'),
    numberMax: i18n.t('validation-numberMax'),
    numberEqual: i18n.t('validation-numberEqual'),
    numberNotEqual: i18n.t('validation-numberNotEqual'),
    numberInteger: i18n.t('validation-numberInteger'),
    numberPositive: i18n.t('validation-numberPositive'),
    numberNegative: i18n.t('validation-numberNegative'),
    array: i18n.t('validation-array'),
    arrayEmpty: i18n.t('validation-arrayEmpty'),
    arrayMin: i18n.t('validation-arrayMin'),
    arrayMax: i18n.t('validation-arrayMax'),
    arrayLength: i18n.t('validation-arrayLength'),
    arrayContains: i18n.t('validation-arrayContains'),
    arrayEnum: i18n.t('validation-arrayEnum'),
    boolean: i18n.t('validation-boolean'),
    function: i18n.t('validation-function'),
    date: i18n.t('validation-date'),
    dateMin: i18n.t('validation-dateMin'),
    dateMax: i18n.t('validation-dateMax'),
    forbidden: i18n.t('validation-forbidden'),
    email: i18n.t('validation-email'),
    url: i18n.t('validation-url'),

    stringContainsLowerCaseLatter: i18n.t('validation-stringContainsLowerCaseLatter'),
    stringContainsUpperCaseLatter: i18n.t('validation-stringContainsUpperCaseLatter'),
    stringContainsNumber: i18n.t('validation-stringContainsNumber'),
    stringAbortSpecialCharacters: i18n.t('validation-stringAbortSpecialCharacters'),
    stringAcceptSpecialCharacters: i18n.t('validation-stringAcceptSpecialCharacters'),
    birthday: i18n.t('validation-birthday'),
    countryCode: i18n.t('validation-countryCode')
  }
});
