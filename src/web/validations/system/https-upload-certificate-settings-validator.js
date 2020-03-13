const {validator} = require('../../../core/validations');
const HTTPSCertificateSchema = require('webserver-form-schema/https-certificate-schema');

module.exports = validator.compile({
  isEnable: HTTPSCertificateSchema.isEnable,
  port: HTTPSCertificateSchema.port,
  certificateType: HTTPSCertificateSchema.certificateType,
  certificate: HTTPSCertificateSchema.certificate,
  privateKey: HTTPSCertificateSchema.privateKey
});
