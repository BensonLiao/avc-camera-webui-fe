const React = require('react');
const {Link} = require('capybara-router');
const classNames = require('classnames');
const logo = require('../../../resource/logo-avc-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avc-title.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class ResetPasswordSuccess extends Base {
  render() {
    return (
      <div className="page-reset-password-success bg-secondary">
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
              <div className="card shadow mb-5">
                <div className="card-body">
                  <div className="d-flex flex-column justify-content-center align-items-center mb-5">
                    <div className="loading-spinners mb-4">
                      <svg className="checkmark" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                      </svg>
                    </div>
                    <h3 className="text-success">
                      {_('Reset password success.')}
                    </h3>
                  </div>

                  <Link to="/" className="btn btn-primary btn-block rounded-pill">{_('Done')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
