window.languageResource = {};

require('./en-us');
require('./es-es');
require('./ja-jp');
require('./zh-cn');
require('./zh-tw');

const format = require('string-template');

const languageResource = window.languageResource || {};

module.exports = (key, values) => {
  /*
  Translate for i18n.
  @param key {String}
  @param values {Array<String>}
  @returns {String}
   */
  const template = languageResource[window.currentLanguageCode || 'en-us'][key] || key;

  return values ? format(template, values) : template;
};
