const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  country: Yup.string().matches(/^[a-zA-Z]{2}$/, _('Invalid country code.'))
    .required(_('This field is required.')),
  state: Yup.string().required(_('This field is required.')),
  city: Yup.string().required(_('This field is required.')),
  organization: Yup.string().required(_('This field is required.')),
  organizationUnit: Yup.string().required(_('This field is required.')),
  email: Yup.string().required(_('This field is required.')),
  domain: Yup.string().required(_('This field is required.'))
});
