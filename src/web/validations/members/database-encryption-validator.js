const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  password: {
    optional: false,
    type: 'string',
    empty: false,
    max: 32
  },
  newPassword: UserSchema.password,
  confirmPassword: UserSchema.password
});
