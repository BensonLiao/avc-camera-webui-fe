import React from 'react';
import PropTypes from 'prop-types';

const AccountTitle = ({title, subtitle}) => {
  return (
    <>
      <h3 className="card-title text-primary">{title}</h3>
      <div className="card-sub-title text-info">{subtitle}</div>
    </>
  );
};

AccountTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
};

AccountTitle.defaultProps = {subtitle: ''};

export default AccountTitle;
