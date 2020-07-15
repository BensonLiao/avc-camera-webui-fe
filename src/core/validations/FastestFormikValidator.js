const Validator = require('fastest-validator');

/**
 * Custom fastest-validator class with overrided `compile` method for compiling
 * checker function in Formik format
 */
module.exports = class FastestFormikValidator extends Validator {
  compile(schema) {
    const checker = super.compile(schema);

    return values => {
      const checkResult = checker(values);

      if (checkResult !== true) {
        const invalidResult = {};

        checkResult.forEach(item => {
          invalidResult[item.field] = item.message;
        });

        return invalidResult;
      }

      return {};
    };
  }
};
