import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {useContextState} from '../../../web/stateProvider';

/**
 * Render checkbox in table body
 * @typedef {object} Props
 * @prop {Component} children - Component of checkbox body row
 * @prop {String} className - Custom style to override
 * @prop {String|Number} rowId - Unique id of checkbox body row
 * @prop {Boolean} disabled - Disable onClick effect
 * @prop {Function} onDoubleClick - Action on double click
 * @returns {Component}
 */
const CheckboxBodyRow = ({children, className, rowId, disabled, onDoubleClick}) => {
  const {tableState: {current: selectedRow}, selectRowHandler} = useContextState();
  return (
    <tr
      className={classNames(
        className,
        {checked: selectedRow ? selectedRow.indexOf(rowId) !== -1 : false}
      )}
      onClick={() => disabled ? {} : selectRowHandler(rowId)}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </tr>
  );
};

CheckboxBodyRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  onDoubleClick: PropTypes.func
};

CheckboxBodyRow.defaultProps = {
  className: null,
  disabled: false,
  onDoubleClick: null
};

export default CheckboxBodyRow;
