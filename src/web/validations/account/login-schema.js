const Yup = require('yup');
const UserSchema = require('../../../core/validations/user-schema');

module.exports = Yup.object().shape({
  account: UserSchema.account,
  password: UserSchema.password
});
