const errors = require('../models/errors');

exports.login = (req, res) => {
  /*
  POST /api/account/_login
   */
  if (req.body.account === 'admin' && req.body.password === 'Admin') {
    res.json({
      id: 'id',
      account: 'admin',
      permission: 'admin'
    });
  } else {
    const loginLockExpiredTime = new Date();
    loginLockExpiredTime.setMinutes(loginLockExpiredTime.getMinutes() + 2);
    throw new errors.Http429('Incorrect account or password.', {
      loginFailedTimes: 5,
      loginLockExpiredTime: loginLockExpiredTime
    });
  }
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
