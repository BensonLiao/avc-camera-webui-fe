const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({newPassword: UserSchema.password});
