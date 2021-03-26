import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {isArray} from '../utils';

const STATUS = {
  info: 'info',
  start: 'start',
  done: 'done',
  error: 'error'
};

const isValidSections = (props, propName) => {
  const max = 3;
  if (isArray(props.children) && props.length > max) {
    return new Error(`The array length of ${propName} must less than ${max}`);
  }
};

/**
 * Component that fix at top of table header that show some extra information or action.
 * @typedef {object} Props
 * @prop {Boolean} isShow - Show/Hide the component.
 * @prop {Boolean} hasBorder - Show/Hide divider border between components. Default is true
 * @prop {String} status - The status indicator.
 * @prop {Array<Component>} children - Components to place inside the display flex section.
 * @returns {Component}
 */
const TableFixTopCaption = ({isShow, hasBorder, status, children}) => {
  // Remove empty component or false (from && logical operator)
  const filteredChildren = [children].flat().filter(component => Boolean(component));
  return (
    <div
      className={classNames('w-100 border table-fixtop-caption', {
        show: isShow,
        'border-primary text-primary': status === STATUS.start,
        'border-danger': status === STATUS.error
      })}
    >
      <div className="d-flex h-100">
        {filteredChildren.map((section, idx) => {
          return (
            <div
              key={String(idx)}
              className={classNames('caption-section d-flex align-items-center', {
                'border-right': hasBorder && (idx === 0 || idx !== filteredChildren.length - 1),
                'border-primary text-primary': status === STATUS.start,
                'border-danger text-danger': status === STATUS.error
              })}
            >
              {section}
            </div>
          );
        })}
      </div>
    </div>
  );
};

TableFixTopCaption.propTypes = {
  isShow: PropTypes.bool,
  hasBorder: PropTypes.bool,
  status: PropTypes.oneOf(Object.values(STATUS)),
  children: isValidSections
};

TableFixTopCaption.defaultProps = {
  isShow: false,
  hasBorder: true,
  status: STATUS.info,
  children: []
};

export default TableFixTopCaption;
