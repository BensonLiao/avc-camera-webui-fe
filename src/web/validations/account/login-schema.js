const Yup = require('yup');
const UserSchema = require('../../../core/validations/user-schema');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  account: UserSchema.account.required(_('This field is required.')),
  password: UserSchema.password.required(_('This field is required.'))
});
