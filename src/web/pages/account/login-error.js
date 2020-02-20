const React = require('react');
const {Link} = require('capybara-router');
const logo = require('../../../resource/logo-avn-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avn-title.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');

module.exports = class LoginError extends Base {
  render() {
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
