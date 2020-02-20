const React = require('react');
const {Link} = require('capybara-router');
const logo = require('../../../resource/logo-avn-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avn-title.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const {LOGIN_ERROR_ATTEMPS_MAX} = require('../../../core/constants');

module.exports = class LoginError extends Base {
  render() {
    const {loginFailedTimes} = this.props.params;
    return (
      <div className="page-login-lock bg-secondary">
        <div className="navbar primary">
          <img src={logo}/>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 bg-white logo">
              <img src={logoWithTitle}/>
            </div>
            <div className="col-center">
              <div className="card shadow mb-5">
                <div className="card-body">
                  <Once>
                    <div className="text-center" style={{margin: '8rem 0'}}>
                      <p className="text-dark font-weight-bold m-0">
                        {_('Password incorrect!')}
                      </p>
                      <p className="text-dark">
                        {_(
                          'You have {0} attemps remaining...',
                          LOGIN_ERROR_ATTEMPS_MAX - loginFailedTimes
                        )}
                      </p>
                    </div>
                    <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-5">
                      {_('Log in again')}
                    </Link>
                  </Once>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
