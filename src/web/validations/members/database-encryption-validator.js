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
    min: 8,
    max: 16
  },
  confirmPassword: {
    type: 'confirmEqual',
    field: 'newPassword'
  }
});
