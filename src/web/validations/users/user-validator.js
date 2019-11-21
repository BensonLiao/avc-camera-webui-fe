const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  permission: UserSchema.permission,
  account: UserSchema.account,
  birthday: UserSchema.birthday,
  password: UserSchema.password,
  newPassword: UserSchema.password
});
