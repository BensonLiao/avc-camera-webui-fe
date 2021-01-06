import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component rendering checkbox in table header
 * @typedef {object} Props
 * @prop {Number} id - ID of checkbox cell
 * @prop {Number} pageNumber - Current page number
 * @prop {Number} index - index of item being looped through
 * @returns {component}
 */
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
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  pageNumber: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default CheckboxBody;
