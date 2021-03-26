import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

/**
 * Render table action button with control on event propagation
 * @typedef {object} Props
 * @prop {Component} children - Component of table action button
 * @prop {String} className - Custom style to override
 * @prop {Function} onClick - Action on button click, do event propagation by default
 * @prop {Boolean} isStopPropagation - Set event stop propagation or not, default is `false`
 * @returns {Component}
 */
const TableActionButton = ({children, className, onClick, isStopPropagation, ...props}) => {
  return (
    <button
      className={classnames('btn btn-link', className)}
      type="button"
      onClick={event => {
        if (isStopPropagation) {
          event.stopPropagation();
        }

        onClick();
      }}
      {...props}
    >
      {children}
    </button>
  );
};

TableActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  isStopPropagation: PropTypes.bool
};

TableActionButton.defaultProps = {
  className: null,
  onClick: null,
  isStopPropagation: false
};

export default TableActionButton;
