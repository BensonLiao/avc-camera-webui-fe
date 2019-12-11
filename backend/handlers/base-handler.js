exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'zh-Hant',
    languageCode: 'zh-tw',
    loadingText: '載入中',
    user: {
      id: 1,
      account: 'admin',
      permission: 'admin'
    },
    cameraName: 'IP Camera',
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
