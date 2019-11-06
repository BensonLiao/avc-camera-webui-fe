const {connect} = require('formik');
const {useEffect} = require('react');
const usePrevious = require('react-use/lib/usePrevious').default;

const FormikEffect = ({onChange, formik}) => {
  /*
  @param args {Object}
    onChange {Function}
   */
  const {values} = formik;
  const prevValues = usePrevious(values);

  useEffect(() => {
    // Don't run effect on form init
    if (prevValues) {
      onChange({prevValues, nextValues: values, formik});
    }
  }, [values]);

  return null;
};

module.exports = connect(FormikEffect);
