exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'zh-Hant',
    languageCode: 'zh-tw',
    user: {
      id: 'id',
      name: 'admin',
      permission: 'admin'
    },
    cameraName: 'IP Camera',
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
