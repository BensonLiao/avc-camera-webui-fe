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
    throw new errors.Http400('Incorrect account or password.', {
      loginFailedTimes: req.rateLimit.current
    });
  }
};

exports.logout = (req, res) => {
  /*
  POST /api/account/_logout
   */
  res.status(204).send();
};

exports.changePasswordWithBirthday = (req, res) => {
  /*
  POST /api/account/_change-password
   */
  if (req.body.account === 'admin' && req.body.birthday === '19910326') {
    res.json({
      id: 'id',
      account: 'admin',
      permission: 'admin'
    });
  } else {
    throw new errors.Http400();
  }
};
