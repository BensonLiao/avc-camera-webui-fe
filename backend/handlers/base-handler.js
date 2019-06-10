exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'zh-Hant',
    languageCode: 'zh-tw'
  });
};
