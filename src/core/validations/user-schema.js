const Yup = require('yup');
const _ = require('../../languages');

module.exports = {
  account: Yup.string()
    .max(8, _('The limit of characters is 8.')),
  birthday: Yup.string().matches(/^\d{4}[0-1]\d[0-3]\d$/, _('Invalid birthday.')),
  password: Yup.string()
    .min(8, _('Please enter more than 7 characters.'))
    .max(12, _('The limit of characters is 12.'))
    .matches(/[a-z]+/, _('The password must includes a lower-case letter.'))
    .matches(/[A-Z]+/, _('The password must includes a upper-case letter.'))
    .matches(/\d+/, _('The password must includes a number.'))
};
