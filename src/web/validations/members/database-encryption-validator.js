const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  password: {
    optional: false,
    type: 'string',
    empty: false,
    max: 32
  },
  newPassword: {
    optional: false,
    type: 'string',
    empty: false,
    max: 32
  },
  confirmPassword: {
    optional: false,
    type: 'string',
    empty: false,
    max: 32
  }
});
