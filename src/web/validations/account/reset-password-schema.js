const Yup = require('yup');
const _ = require('../../../languages');
const UserSchema = require('../../../core/validations/user-schema');

module.exports = Yup.object().shape({
  password: UserSchema.password.required(_('This field is required.')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], _('Incorrect confirm password.'))
    .required(_('This field is required.'))
});