const errors = require('../models/errors');

exports.validateAccountBirthday = (req, res) => {
  /*
  POST /api/validations/_account-birthday
   */
  if (req.body.account === 'admin' && req.body.birthday === '19910326') {
    res.status(204).send();
  } else {
    throw new errors.Http400();
  }
};
