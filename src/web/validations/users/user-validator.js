const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  account: UserSchema.account,
  newPassword: UserSchema.password,
  confirmPassword: {
    type: 'confirmEqual',
    field: 'newPassword'
  }
});
