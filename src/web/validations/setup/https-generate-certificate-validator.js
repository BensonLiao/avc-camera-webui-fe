const HttpsCertificateSchema = require('webserver-form-schema/https-certificate-schema');
const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  country: HttpsCertificateSchema.country,
  state: HttpsCertificateSchema.state,
  city: HttpsCertificateSchema.city,
  organization: HttpsCertificateSchema.organization,
  organizationUnit: HttpsCertificateSchema.organizationUnit,
  email: HttpsCertificateSchema.email,
  domain: HttpsCertificateSchema.domain
});
