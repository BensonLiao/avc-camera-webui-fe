exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  res.render('index', {
    htmlLang: 'en',
    languageCode: 'en',
    loadingText: 'Loading',
    user: {
      id: 1,
      account: 'admin',
      permission: '0'
    },
    cameraName: 'IP Camera',
    skuID: process.env.SKU_ID || '',
    isDebug: 'y',
    error: res.error ? {
      status: res.error.status,
      message: `${res.error}`
    } : null
  });
};
