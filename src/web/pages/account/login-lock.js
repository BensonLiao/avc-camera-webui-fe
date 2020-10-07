const dayjs = require('dayjs');
const React = require('react');
const {Link} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const AccountContainer = require('./account-container').default;

module.exports = class LoginLock extends Base {
  static get propTypes() {
    return {
      params: function (props, propName, componentName) {
        if (
          !props[propName].loginLockExpiredTime ||
          Number.isNaN(props[propName].loginLockExpiredTime)
        ) {
          return new Error(
            `Invalid prop "${propName}.loginLockExpiredTime" supplied to ${componentName}. Validation failed.`
          );
        }
      }
    };
  }

  constructor(props) {
    super(props);
    this.state.loginLockRemainingMs = props.params.loginLockExpiredTime - Date.now();
    this.state.disableLoginLink = true;

    this.timerId = null;
  }

  componentDidMount() {
    let remainingMs = this.state.loginLockRemainingMs;

    this.timerId = setInterval(() => {
      remainingMs -= 1000;

      if (remainingMs >= 0) {
        this.setState({loginLockRemainingMs: remainingMs});
      } else {
        clearInterval(this.timerId);
        this.timerId = null;
        this.setState({disableLoginLink: false});
      }
    }, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  render() {
    const formatedLoginLockTime = dayjs(this.state.loginLockRemainingMs).format('mm:ss');

    return (
      <AccountContainer page="page-login-lock">
        <div className="card shadow mb-5">
          <div className="card-body text-dark text-center">
            <Once>
              <div style={{margin: '5rem 0'}}>
                <p className="font-weight-bold m-0">
                  {_('Too Many Login Attempts!')}
                </p>
                <p>
                  {_('Please try again in 5 minutes.')}
                </p>
              </div>
            </Once>

            {
              this.state.disableLoginLink ? (
                <a href="#disabled" className="btn btn-primary btn-block rounded-pill mt-4 disabled">
                  {_('{0} Remaining', [formatedLoginLockTime])}
                </a>
              ) : (
                <Once>
                  <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-4">
                    {_('Login Again')}
                  </Link>
                </Once>
              )
            }
          </div>
        </div>
      </AccountContainer>
    );
  }
};
