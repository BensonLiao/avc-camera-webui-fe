import PropTypes from 'prop-types';
import React from 'react';
import {useContextState} from '../../../web/stateProvider';

/**
 * Render checkbox in table header
 * @typedef {object} Props
 * @prop {Number} width - Width of checkbox table head, defaults to 10% width
 * @returns {component}
 */
const CheckboxHeader = ({width = '10%', disabled = false}) => {
  const {selectAllRef, isSelectAll, selectAllHandler} = useContextState();
  return (
    <th
      className="text-center th-checkbox"
      style={{width}}
    >
      <input
        ref={selectAllRef}
        disabled={disabled}
        id="selectAll"
        type="checkbox"
        indeterminate="true"
        checked={isSelectAll}
        onChange={selectAllHandler}
      />
      <label htmlFor="selectAll"/>
    </th>
  );
};

CheckboxHeader.propTypes = {
  width: PropTypes.number,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

export default CheckboxHeader;

