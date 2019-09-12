const Validator = require('fastest-validator');
const _ = require('../../languages');

exports.validator = new Validator({
  messages: {
    required: _('validation-required'),
    string: _('validation-string'),
    stringEmpty: _('validation-stringEmpty'),
    stringMin: _('validation-stringMin'),
    stringMax: _('validation-stringMax'),
    stringLength: _('validation-stringLength'),
    stringPattern: _('validation-stringPattern'),
    stringContains: _('validation-stringContains'),
    stringContainsLowerCaseLatter: _('validation-stringContainsLowerCaseLatter'),
    stringContainsUpperCaseLatter: _('validation-stringContainsUpperCaseLatter'),
    stringContainsNumber: _('validation-stringContainsNumber'),
    stringEnum: _('validation-stringEnum'),
    number: _('validation-number'),
    numberMin: _('validation-numberMin'),
    numberMax: _('validation-numberMax'),
    numberEqual: _('validation-numberEqual'),
    numberNotEqual: _('validation-numberNotEqual'),
    numberInteger: _('validation-numberInteger'),
    numberPositive: _('validation-numberPositive'),
    numberNegative: _('validation-numberNegative'),
    array: _('validation-array'),
    arrayEmpty: _('validation-arrayEmpty'),
    arrayMin: _('validation-arrayMin'),
    arrayMax: _('validation-arrayMax'),
    arrayLength: _('validation-arrayLength'),
    arrayContains: _('validation-arrayContains'),
    arrayEnum: _('validation-arrayEnum'),
    boolean: _('validation-boolean'),
    function: _('validation-function'),
    date: _('validation-date'),
    dateMin: _('validation-dateMin'),
    dateMax: _('validation-dateMax'),
    forbidden: _('validation-forbidden'),
    email: _('validation-email'),
    url: _('validation-url'),
    birthday: _('validation-birthday'),
    countryCode: _('validation-countryCode')
  }
});
