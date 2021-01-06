import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const CheckboxBody = ({id, pageNumber, index}) => {
  return (
    <td className="text-center td-checkbox">
      <Field
        name={`${pageNumber}.${index}.isChecked`}
        id={id}
        type="checkbox"
      />
      <label htmlFor={id}/>
    </td>
  );
};

CheckboxBody.propTypes = {
  id: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default CheckboxBody;
