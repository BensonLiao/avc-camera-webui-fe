const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  password: Yup.string()
    .min(8, _('Please enter more than 7 characters.'))
    .max(12, _('The limit of characters is 12.'))
    .matches(/[a-z]+/, _('The password must includes a lower-case letter.'))
    .matches(/[A-Z]+/, _('The password must includes a upper-case letter.'))
    .matches(/\d+/, _('The password must includes a number.'))
    .required(_('This field is required.')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Incorrect confirm password.')
    .required(_('This field is required.'))
});
