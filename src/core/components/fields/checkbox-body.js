import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {useContextState} from '../../../web/stateProvider';

/**
 * Render checkbox in table body
 * @typedef {object} Props
 * @prop {Number} id - ID of checkbox cell
 * @prop {Number} pageNumber - Current page number
 * @prop {Number} index - index of item being looped through
 * @returns {component}
 */
const CheckboxBody = ({id, pageNumber, index, disabled = false}) => {
  const {tableState: {current: selectedRow}} = useContextState();
  return (
    <td className="text-center td-checkbox">
      <Field
        disabled={disabled}
        name={`${pageNumber}.${index}.isChecked`}
        id={id}
        type="checkbox"
        checked={selectedRow ? selectedRow.indexOf(id) !== -1 : false}
        value={selectedRow ? selectedRow.indexOf(id) !== -1 : false}
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
