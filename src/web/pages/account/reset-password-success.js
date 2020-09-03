const React = require('react');
const {Link} = require('capybara-router');
const logo = require('../../../resource/logo-01.svg');
const decoration = require('../../../resource/decoration-01.svg');
const checkCircleSolid = require('../../../resource/check-circle-solid.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class ResetPasswordSuccess extends Base {
  render() {
    return (
      <div className="page-reset-password-success bg-secondary">
        <img src={logo} className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <p className="text-light text-center text-welcome"/>
            </div>
            <div className="col-card">
              <div className="card shadow mb-5">
                <div className="card-body">
                  <h5 className="card-title"/>
                  <div className="text-center mb-5">
                    <img src={checkCircleSolid} className="mb-4" width="120" height="120"/>
                    <h3 className="text-success" style={{fontSize: '30px'}}>
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
