exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('base', {
    htmlLang: 'en-us',
    languageCode: 'en-us',
    loadingText: 'Loading',
    user: {
      id: 1,
      account: 'admin',
      permission: 'admin'
    },
    cameraName: 'IP Camera',
    error: res.error ? {status: res.error.status, message: `${res.error}`} : null
  });
};
