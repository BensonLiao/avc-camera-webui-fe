/* eslint-disable react-hooks/exhaustive-deps */
const {connect} = require('formik');
const {useEffect} = require('react');
const usePrevious = require('react-use/lib/usePrevious').default;

/**
 * Add handler to field value changes side effect on `formik`.
 * @param {Function} onChange The handler.
 * @param {Object} formik
 * @returns {null}
 */
const FormikEffect = ({onChange, formik}) => {
  const {values} = formik;
  const prevValues = usePrevious(values);

  useEffect(() => {
    // Don't run effect on form init
    if (prevValues) {
      onChange({
        prevValues,
        nextValues: values,
        formik
      });
    }
  }, [values]);

  return null;
};

module.exports = connect(FormikEffect);
