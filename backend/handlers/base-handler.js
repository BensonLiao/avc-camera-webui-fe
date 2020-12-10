const cache = require('memory-cache');

exports.baseView = (req, res) => {
  /*
  [web] GET /.*
   */
  const setupLanguage = req.cookies[req.app.locals.config.cookies.language];
  res.render('index', {
    htmlLang: 'en',
    languageCode: cache.get('language') || setupLanguage || 'en',
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
