import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component for showing progress loading status.
 * @prop {string} className - additional classnames
 * @prop {boolean} isDetermined - if the progress percentage is known or not
 * @prop {number} percentage - percentage of the progress, only applied if `isDetermined` is `true`
 * @prop {string} status - status of the progress, could be: `start`, `done`, or `fail`
 * @returns {component}
 */
const ProgressIndicator = ({className, isDetermined, percentage, status}) => {
  return (
    <div className={classNames('loading-spinners', className)}>
      <svg className={classNames('checkmark', {show: status === 'done'})} viewBox="0 0 52 52">
        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      <svg className={classNames('crossmark', {show: status === 'fail'})} viewBox="0 0 52 52">
        <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36"/>
      </svg>
      <div className={classNames('loading-dots', {'hide-loading': status !== 'start'})}>
        {isDetermined ? (
          <div className={`pie-wrapper pie-wrapper--solid progress-${percentage}`}/>
        ) : (
          <div className="spinner">
            <div className="double-bounce1"/>
            <div className="double-bounce2"/>
          </div>
        )}
      </div>
    </div>
  );
};

ProgressIndicator.propTypes = {
  className: PropTypes.string,
  isDetermined: PropTypes.bool,
  percentage: PropTypes.number,
  status: PropTypes.oneOf(['start', 'done', 'fail'])
};

ProgressIndicator.defaultProps = {
  className: '',
  isDetermined: false,
  percentage: 0,
  status: 'start'
};

export default ProgressIndicator;
