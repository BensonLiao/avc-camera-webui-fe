const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  account: Yup.string()
    .max(1024, _('The limit of characters is 1024.'))
    .required(_('This field is required.')),
  password: Yup.string()
    .min(6, _('Please enter more than 5 characters.'))
    .max(1024, _('The limit of characters is 1024.'))
    .required(_('This field is required.'))
});
