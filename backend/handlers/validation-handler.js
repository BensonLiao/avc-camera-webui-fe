const errors = require('../models/errors');

exports.validateAccountBirthday = (req, res) => {
  /*
  POST /api/_validate/account-birthday
   */
  if (req.body.account === 'admin' && req.body.birthday === '19900101') {
    res.status(204).send();
  } else {
    throw new errors.Http400();
  }
};
