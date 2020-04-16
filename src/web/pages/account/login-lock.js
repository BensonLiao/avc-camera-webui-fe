const leftPad = require('left-pad');
const React = require('react');
const {Link} = require('capybara-router');
const logo = require('../../../resource/logo-avc-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avc-title.svg');
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
                        {_('{0} Remaining', [this.state.displayTime])}
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
            </div>
          </div>
        </div>
      </div>
    );
  }
};
