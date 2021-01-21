import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Render checkbox in table body
 * @typedef {object} Props
 * @prop {Number} id - ID of checkbox cell
 * @prop {Number} pageNumber - Current page number
 * @prop {Number} index - index of item being looped through
 * @returns {component}
 */
const CheckboxBody = ({id, pageNumber, index, disabled = false}) => {
  return (
    <td className="text-center td-checkbox">
      <Field
        disabled={disabled}
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
  index: PropTypes.number.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

export default CheckboxBody;
