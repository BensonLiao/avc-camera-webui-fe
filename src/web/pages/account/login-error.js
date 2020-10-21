const React = require('react');
const PropTypes = require('prop-types');
const {Link} = require('capybara-router');
const i18n = require('../../i18n').default;
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const AccountContainer = require('./account-container').default;

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
      <AccountContainer page="page-login-lock">
        <div className="card shadow mb-5">
          <div className="card-body">
            <Once>
              <div className="text-center" style={{margin: '8rem 0'}}>
                <p className="text-dark font-weight-bold m-0">
                  {i18n.t('Incorrect Password')}
                </p>
                <p className="text-dark">
                  {i18n.t('You have {{0}} attempt(s) remaining...', {0: loginFailedRemainingTimes})}
                </p>
              </div>
              <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-5">
                {i18n.t('Login Again')}
              </Link>
            </Once>
          </div>
        </div>
      </AccountContainer>
    );
  }
};
