const {validator} = require('../../../core/validations');

module.exports = validator.compile({
  country: {
    optional: false,
    type: 'custom',
    pattern: /^[a-zA-Z]{2}$/,
    check: function (value, schema) {
      if (schema.optional && (value == null || value === '')) {
        return true;
      }

      if (typeof value !== 'string') {
        return this.makeError('string', null, value);
      }

      if (!schema.pattern.test(value)) {
        return this.makeError('countryCode', schema.pattern, value);
      }

      return true;
    }
  },
  state: {
    optional: false,
    type: 'string',
    empty: false,
    max: 1024
  },
  city: {
    optional: false,
    type: 'string',
    empty: false,
    max: 1024
  },
  organization: {
    optional: false,
    type: 'string',
    empty: false,
    max: 1024
  },
  organizationUnit: {
    optional: false,
    type: 'string',
    empty: false,
    max: 1024
  },
  email: {
    optional: false,
    type: 'custom',
    max: 1024,
    check: function (value, schema) {
      if (schema.optional && (value == null || value === '')) {
        return true;
      }

      if (typeof value !== 'string') {
        return this.makeError('string', null, value);
      }

      if (value.length > schema.max) {
        return this.makeError('stringMax', schema.max, value);
      }

      return validator.rules.email.apply(this, [value, schema]);
    }
  },
  domain: {
    optional: false,
    type: 'string',
    empty: false,
    max: 1024
  }
});
