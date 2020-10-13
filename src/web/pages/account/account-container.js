import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import logo from '../../../resource/logo-avc-secondary.svg';
import logoWithTitle from '../../../resource/logo-avc-title.svg';

const AccountContainer = ({page, children}) => {
  return (
    <div className={classNames('bg-secondary', page)}>
      <div className="navbar primary">
        { !window.isNoBrand &&
        <img src={logo}/>}
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          { !window.isNoBrand && (
            <div className="col-12 bg-white logo">
              <img src={logoWithTitle}/>
            </div>
          )}
          <div className={classNames('col-center', {'mt-5': window.isNoBrand})}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

AccountContainer.propTypes = {
  page: PropTypes.string,
  children: PropTypes.node.isRequired
};

AccountContainer.defaultProps = {page: ''};

export default AccountContainer;
