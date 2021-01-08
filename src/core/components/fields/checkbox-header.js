import PropTypes from 'prop-types';
import React from 'react';
import {useContextCheckbox} from '../checkbox-table';

/**
 * Component rendering checkbox in table header
 * @typedef {object} Props
 * @prop {Object} formikForm - Formik form object
 * @prop {Number} width - Width of checkbox table head, defaults to 10% width
 * @returns {component}
 */
const CheckboxHeader = ({formikForm, width = '10%'}) => {
  const {selectAllRef, isSelectAll, selectAllHandler} = useContextCheckbox();
  return (
    <th
      className="text-center th-checkbox"
      style={{width}}
    >
      <input
        ref={selectAllRef}
        id="selectAll"
        type="checkbox"
        indeterminate="true"
        checked={isSelectAll}
        onChange={selectAllHandler(formikForm)}
      />
      <label htmlFor="selectAll"/>
    </th>
  );
};

CheckboxHeader.propTypes = {
  formikForm: PropTypes.object.isRequired,
  width: PropTypes.number
};

export default CheckboxHeader;

