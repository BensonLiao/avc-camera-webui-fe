const {validator} = require('../../../core/validations');
const AuthKeySchema = require('webserver-form-schema/auth-key-schema');

module.exports = validator.compile({authKey: AuthKeySchema.authKey});
