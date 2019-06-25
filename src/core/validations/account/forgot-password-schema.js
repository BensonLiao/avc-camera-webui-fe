const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  account: Yup.string()
    .max(1024, _('The limit of characters is 1024.'))
    .required(_('This field is required.')),
  birthday: Yup.string()
    .matches(/^\d{4}[0-1]\d[0-3]\d$/, _('Invalid birthday.'))
    .required(_('This field is required.'))
});
