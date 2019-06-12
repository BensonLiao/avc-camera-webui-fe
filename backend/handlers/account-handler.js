const errors = require('../models/errors');

exports.login = (req, res) => {
  /*
  POST /api/account/_login
   */
  if (req.body.account === 'admin' && req.body.password === 'Admin') {
    res.json({
      account: 'admin'
    });
  } else {
    throw new errors.Http400('Incorrect account or password.', {
      loginFailedTimes: 4
    });
  }
};
