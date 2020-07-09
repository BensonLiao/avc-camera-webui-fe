exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'en',
    languageCode: 'zh-tw',
    loadingText: 'Loading',
    user: {
      id: 1,
      account: 'admin',
      permission: '0'
    },
    cameraName: 'IP Camera',
    isDebug: 'y',
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
