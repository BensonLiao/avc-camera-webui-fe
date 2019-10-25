const HttpsCertificateSchema = require('webserver-form-schema/https-certificate-schema');
const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  certificate: HttpsCertificateSchema.certificate,
  privateKey: HttpsCertificateSchema.privateKey
});
