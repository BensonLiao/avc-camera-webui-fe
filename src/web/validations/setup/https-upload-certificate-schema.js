const Yup = require('yup');
const _ = require('../../../languages');

module.exports = Yup.object().shape({
  certificate: Yup.string().required(_('This field is required.')),
  privateKey: Yup.string().required(_('This field is required.'))
});
