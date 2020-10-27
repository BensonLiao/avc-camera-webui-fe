const cache = require('memory-cache');

exports.updateLanguage = (req, res) => {
  /*
  PUT /api/system/language
   */
  cache.put('language', req.body.language);
  res.json(req.body);
};
