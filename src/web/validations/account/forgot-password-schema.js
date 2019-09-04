const Yup = require('yup');
const _ = require('../../../languages');
const UserSchema = require('../../../core/validations/user-schema');

module.exports = Yup.object().shape({
  account: UserSchema.account.required(_('This field is required.')),
  birthday: UserSchema.birthday.required(_('This field is required.'))
});
