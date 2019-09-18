const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  deviceName: {
    optional: false,
    type: 'string',
    empty: false,
    min: 1,
    max: 32
  }
});
