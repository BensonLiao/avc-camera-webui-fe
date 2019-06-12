exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'zh-Hant',
    languageCode: 'zh-tw',
    user: {
      name: 'username'
    },
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
