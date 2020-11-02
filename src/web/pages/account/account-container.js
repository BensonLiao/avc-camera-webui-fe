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
          {!window.isNoBrand && (
            <div className="col-12 logo bg-white">
              <div className="col-center logo motion-blur">
                <img src={logoWithTitle} className="blur-me"/>
                <img src={logoWithTitle} className="blur-me two"/>
                <img src={logoWithTitle} className="blur-me three"/>
                <img src={logoWithTitle} className="blur-me four"/>
                <img src={logoWithTitle} className="blur-me five"/>
              </div>
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
