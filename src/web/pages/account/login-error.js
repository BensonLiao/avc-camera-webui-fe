const React = require('react');
const PropTypes = require('prop-types');
const {Link} = require('capybara-router');
const classNames = require('classnames');
const logo = require('../../../resource/logo-avc-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avc-title.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');

module.exports = class LoginError extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        loginFailedRemainingTimes: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
        ]).isRequired
      }).isRequired
    };
  }

  render() {
    const {loginFailedRemainingTimes} = this.props.params;
    return (
      <div className="page-login-lock bg-secondary">
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
                  <Once>
                    <div className="text-center" style={{margin: '8rem 0'}}>
                      <p className="text-dark font-weight-bold m-0">
                        {_('Password Incorrect')}
                      </p>
                      <p className="text-dark">
                        {_('You have {0} attemps remaining...', [loginFailedRemainingTimes])}
                      </p>
                    </div>
                    <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-5">
                      {_('Login Again')}
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
