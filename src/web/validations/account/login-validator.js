const {validator} = require('../../../core/validations');
const UserSchema = require('webserver-form-schema/user-schema');

module.exports = validator.compile({
  account: UserSchema.account,
  password: {
    ...UserSchema.password,
    isNeedMinMax: false,
    isNeedLowerCase: false,
    isNeedUpperCase: false,
    isNeedNumber: false,
    isAbortSpecialCharacters: false,
    isAcceptSpecialCharacters: false
  }
});
