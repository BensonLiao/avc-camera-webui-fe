const errors = require('../models/errors');

exports.login = (req, res) => {
  /*
  POST /api/account/_login
   */
  if (req.body.account === 'admin' && req.body.password === 'Admin123') {
    res.json({
      id: 'id',
      account: 'admin',
      permission: 'admin'
    });
  } else {
    throw new errors.Http400('incorrect account or password.', {loginFailedRemainingTimes: req.rateLimit.remaining});
  }
};

exports.logout = (req, res) => {
  /*
  POST /api/account/_logout
   */
  res.status(204).send();
};

exports.changeMyPassword = (req, res) => {
  /*
  PUT /api/me/password
   */
  if (req.body.password === 'Admin123') {
    res.json({
      id: 'id',
      account: 'admin',
      permission: 'admin'
    });
  } else {
    throw new errors.Http400('Incorrect Password');
  }
};
