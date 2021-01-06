import PropTypes from 'prop-types';
import React from 'react';
import {useContextCheckbox} from '../table-with-checkbox';

const CheckboxHeader = ({formikForm}) => {
  const {selectAllRef, isSelectAll, selectAllHandler} = useContextCheckbox();
  return (
    <th
      className="text-center th-checkbox"
      style={{width: '10%'}}
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

CheckboxHeader.propTypes = {formikForm: PropTypes.object.isRequired};

export default CheckboxHeader;

