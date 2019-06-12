const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  account: Yup.string()
    .max(1024, _('The limit of characters is 1024.'))
    .required(_('This field is required.')),
  password: Yup.string()
    .max(8, _('The limit of characters is 8.'))
    .matches(/[a-z]+/, _('The password must includes a lower-case letter.'))
    .matches(/[A-Z]+/, _('The password must includes a upper-case letter.'))
    .required(_('This field is required.'))
});
