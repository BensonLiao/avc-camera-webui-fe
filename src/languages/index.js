window.languageResource = {};
const languageCode = window.currentLanguageCode;

switch (languageCode) {
  case 'es-es':
    require('./es-es');
    break;
  case 'ja-jp':
    require('./ja-jp');
    break;
  case 'zh-cn':
    require('./zh-cn');
    break;
  case 'zh-tw':
    require('./zh-tw');
    break;
  default:
    require('./en-us');
    break;
}

const format = require('string-template');

const languageResource = window.languageResource || {};

module.exports = (key, values) => {
  /*
  Translate for i18n.
  @param key {String}
  @param values {Array<String>}
  @returns {String}
   */
  const template = languageResource[languageCode][key] || key;

  return values ? format(template, values) : template;
};
