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
    const loginLockExpiredTime = new Date();
    loginLockExpiredTime.setMinutes(loginLockExpiredTime.getMinutes() + 2);
    throw new errors.Http429('Incorrect account or password.', {
      loginFailedTimes: 5,
      isTooManyLoginFailed: true,
      loginLockExpiredTime: loginLockExpiredTime
    });
  }
};
