const format = require('string-template');

const languageResource = window.languageResource || {};

module.exports = (key, values) => {
  /*
  Translate for i18n.
  @param key {String}
  @param values {Object|Array<String>}
  @returns {String}
   */
  const template = languageResource[key] || key;

  return values ? format(template, values) : template;
};
