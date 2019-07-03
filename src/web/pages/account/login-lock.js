const leftPad = require('left-pad');
const React = require('react');
const {Link} = require('capybara-router');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const frownOpenSolid = require('webserver-prototype/src/resource/frown-open-solid.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');

module.exports = class LoginLock extends Base {
  static get propTypes() {
    return {
      params: function (props, propName, componentName) {
        if (
          !props[propName].loginLockExpiredTime ||
          Number.isNaN((new Date(props[propName].loginLockExpiredTime)).getTime())
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
    const now = new Date();
    const time = new Date(new Date(props.params.loginLockExpiredTime) - now);
    this.state.displayTime = `${time.getMinutes()}:${leftPad(time.getSeconds(), 2, '0')}`;
    this.state.disableLoginLink = true;

    this.timerId = setInterval(() => {
      const now = new Date();
      const time = new Date(new Date(props.params.loginLockExpiredTime) - now);
      if (time >= 0) {
        this.setState({
          displayTime: `${time.getMinutes()}:${leftPad(time.getSeconds(), 2, '0')}`
        });
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
    return (
      <div className="page-login-lock">
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
                  <Once>
                    <h5 className="card-title text-oops">{_('Oops!')}</h5>
                    <div className="text-center mb-4">
                      <img src={frownOpenSolid} className="mb-4" width="80" height="80"/>
                      <p className="text-gray-700">
                        {_('Incorrect password 5 times! Please wait for 5 minutes.')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link to="/forgot-password">{_('Forgot password?')}</Link>
                    </div>
                  </Once>

                  {
                    this.state.disableLoginLink ? (
                      <a href="#disabled" className="btn btn-primary btn-block rounded-pill mt-5 disabled">
                        {_('{0} left', this.state.displayTime)}
                      </a>
                    ) : (
                      <Once>
                        <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-5">
                          {_('Log in again')}
                        </Link>
                      </Once>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
