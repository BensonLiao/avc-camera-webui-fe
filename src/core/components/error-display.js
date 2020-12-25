import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component for render and indicate error.
 * @prop {string} message - What error message to show, default is `Something when wrong.`.
 * @prop {string} className - Override the default style, default is `null`.
 * @returns {component}
 */
const ErrorDisplay = ({message, className}) => {
  return (
    <div
      className={className}
      style={className ? undefined : {
        display: 'flex',
        width: '100%',
        color: '#EF8784',
        backgroundColor: '#250201',
        padding: '0.25rem',
        fontWeight: 'bolder'
      }}
    >
      {message}
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
};

ErrorDisplay.defaultProps = {
  message: 'Something when wrong.',
  className: null
};

export default ErrorDisplay;
