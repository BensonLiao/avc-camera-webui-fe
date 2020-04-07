exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'zh',
    languageCode: 'zh-tw',
    loadingText: 'Loading',
    user: {
      id: 1,
      account: 'admin',
      permission: '0'
    },
    cameraName: 'IP Camera',
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
