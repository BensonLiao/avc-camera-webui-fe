const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  account: UserSchema.account,
  birthday: UserSchema.birthday,
  password: {
    ...UserSchema.password,
    isNeedLowerCase: false,
    isNeedUpperCase: false,
    isNeedNumber: false
  },
  newPassword: UserSchema.password
});
