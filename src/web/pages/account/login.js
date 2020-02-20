const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const UserSchema = require('webserver-form-schema/user-schema');
const loginValidator = require('../../validations/account/login-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const logo = require('../../../resource/logo-avn-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avn-title.svg');

module.exports = class Login extends Base {
  redirectPage = () => {
    const redirectUri = Cookies.get(window.config.cookies.redirect);
    if (redirectUri && /^\/.*/.test(redirectUri)) {
      Cookies.set(window.config.cookies.redirect, null, {expires: -100});
      location.href = redirectUri;
    } else {
      location.href = '/';
    }
  }

  /**
   * Handler on user submit the login form.
   * @param {Object} values
   * @property {String} account
   * @property {String} password
   * @returns {void}
   */
  onSubmitLoginForm = values => {
    progress.start();
    this.setState({isIncorrectPassword: false});
    api.account.login(values)
      .then(this.redirectPage)
      .catch(error => {
        if (error.response) {
          if (error.response.status === 429) {
            if (
              error.response.data && error.response.data.extra && error.response.data.extra &&
              error.response.data.extra.loginLockExpiredTime
            ) {
              getRouter().go({
                name: 'login-lock',
                params: {loginLockExpiredTime: error.response.data.extra.loginLockExpiredTime}
              });
              return;
            }
          }

          if (error.response.status === 400) {
            if (
              error.response.data && error.response.data.extra &&
              error.response.data.extra.loginFailedRemainingTimes >= 0
            ) {
              getRouter().go({
                name: 'login-error',
                params: {
                  loginFailedRemainingTimes: error.response.data.extra.loginFailedRemainingTimes
                }
              });
              return;
            }
          }
        }

        progress.done();
        utils.renderError(error);
      });
  }

  loginFormRender = ({errors, touched}) => {
    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <h3 className="card-title text-primary">{_('ACCOUNT LOGIN')}</h3>
          <div className="card-sub-title text-info">
            {_('Please enter your username and password')}
          </div>
          <div className="form-group">
            <label>{_('Username')}</label>
            <Field name="account" type="text"
              maxLength={UserSchema.account.max}
              placeholder={_('Eenter your username')}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _('Eenter your password'),
              className: classNames('form-control', {'is-invalid': errors.password})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          <h6 className="text-right text-primary font-weight-bold" style={{height: '24px'}}>
            <a
              href="https://arecontvision.zendesk.com/hc/en-us/articles/360018682854-Password-Reset"
              target="_blank"
              rel="noopener noreferrer"
            >
              {_('Password Reset')}
            </a>
          </h6>
          <div className="text-dark text-size-14" style={{marginTop: '40px'}}>{_('Need Help? Call Arecont Vision Technical Support at +1.818.937.0700 and select option #1')}</div>
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            {_('Login')}
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <div className="page-login bg-secondary">
        <div className="navbar primary">
          <img src={logo}/>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 bg-white logo">
              <img src={logoWithTitle}/>
            </div>
            <div className="col-center">
              <Formik
                initialValues={{account: '', password: '', maxAge: '3600000'}}
                validate={utils.makeFormikValidator(loginValidator)}
                onSubmit={this.onSubmitLoginForm}
              >
                {this.loginFormRender}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
