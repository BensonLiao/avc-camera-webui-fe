const errors = require('../models/errors');

exports.login = (req, res) => {
  /*
  POST /api/account/_login
  @response 200 {UserModel}
  @response 400 {Object}
    extra: {Object}
      loginFailedTimes: {Number}
      isTooManyLoginFailed: {Boolean}
      loginLockExpiredTime: {Date}
   */
  if (req.body.account === 'admin' && req.body.password === 'Admin') {
    res.json({
      account: 'admin'
    });
  } else {
    const loginLockExpiredTime = new Date();
    loginLockExpiredTime.setMinutes(loginLockExpiredTime.getMinutes() + 2);
    throw new errors.Http400('Incorrect account or password.', {
      loginFailedTimes: 5,
      isTooManyLoginFailed: true,
      loginLockExpiredTime: loginLockExpiredTime
    });
  }
};
