const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  certificate: {
    optional: false,
    type: 'string',
    empty: false,
    max: 20480
  },
  privateKey: {
    optional: false,
    type: 'string',
    empty: false,
    max: 10240
  }
});
