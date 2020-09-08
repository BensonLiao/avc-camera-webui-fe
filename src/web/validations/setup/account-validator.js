const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  account: UserSchema.account,
  password: UserSchema.password,
  confirmPassword: {
    type: 'confirmEqual',
    field: 'password'
  },
  birthday: {
    ...UserSchema.birthday,
    optional: true
  }
});
