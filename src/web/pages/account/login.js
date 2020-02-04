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
const UserPermission = require('webserver-form-schema/constants/user-permission');
const loginValidator = require('../../validations/account/login-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const logo = require('../../../resource/logo-avn-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avn-title.svg');

module.exports = class Login extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectPassword = null;
    this.isSetupSuccess = false;
  }

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
   * Handler on user submit the setup form.
   * @param {Object} values
   * @property {String} account
   * @property {String} password
   * @property {String} confirmPassword
   * @returns {void}
   */
  onSubmitSetupForm = values => {
    progress.start();
    api.user.addUser(values)
      .then(this.redirectPage)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  }

  setupFormRender = ({errors, touched, submitCount}) => {
    const isSubmitted = submitCount > 0;

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <h3 className="card-title text-primary">{_('INITIAL PASSWORD SETUP')}</h3>
          <div className="card-sub-title text-muted">
            {_('Prior to accessing this device for the first time a unique admin password must be created')}
          </div>
          <div className="form-group">
            <label>{_('Username')}</label>
            <Field readOnly name="account" type="text"
              maxLength={UserSchema.account.max}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account && isSubmitted})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _('Please enter your password.'),
              className: classNames('form-control', {'is-invalid': (errors.password && isSubmitted) || this.state.isIncorrectPassword})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
            <small className="form-text text-muted text-size-14">
              {_('8-16 characters ,contain at least 1 upper and lowercase,1 number, 1 special characters. Do not use #, %, &,`, “, \\, <, > and space.')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm password')}</label>
            <Field name="confirmPassword" component={Password} inputProps={{
              placeholder: _('Please confirm your password.'),
              className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword})
            }}/>
            {
              errors.confirmPassword && touched.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
          </div>
          <div className="text-primary text-size-14" style={{marginTop: '40px'}}>{_('Need Help? Call Arecont Vision Technical Support at +1.818.937.0700 and select option #1')}</div>
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            {_('Submit')}
          </button>
        </div>
      </Form>
    );
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
            progress.done();
            this.setState({
              isIncorrectPassword: true,
              loginFailedTimes: (error.response.data && error.response.data.extra && error.response.data.extra.loginFailedTimes) || 1
            });
            return;
          }
        }

        progress.done();
        utils.renderError(error);
      });
  }

  loginFormRender = ({errors, touched, submitCount}) => {
    const isSubmitted = submitCount > 0;

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <h3 className="card-title text-primary">{_('ACCUNT LOGIN')}</h3>
          <div className="card-sub-title text-muted">
            {_('Please enter your admin password')}
          </div>
          <div className="form-group">
            <label>{_('Username')}</label>
            <Field name="account" type="text"
              maxLength={UserSchema.account.max}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account && isSubmitted})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _('Please enter your password.'),
              className: classNames('form-control', {'is-invalid': (errors.password && isSubmitted) || this.state.isIncorrectPassword})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          <div className="text-primary text-size-14" style={{marginTop: '40px'}}>{_('Need Help? Call Arecont Vision Technical Support at +1.818.937.0700 and select option #1')}</div>
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            {_('Login')}
          </button>
        </div>
      </Form>
    );
  }

  render() {
    const {isSetupSuccess} = this.props;
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
            <div className="col-card">
              {isSetupSuccess ? (
                <Formik
                  initialValues={{account: '', password: '', maxAge: '3600000'}}
                  validate={utils.makeFormikValidator(loginValidator)}
                  onSubmit={this.onSubmitLoginForm}
                >
                  {this.loginFormRender}
                </Formik>
              ) : (
                <Formik
                  initialValues={{
                    account: 'admin',
                    permission: UserPermission.root,
                    password: ''
                  }}
                  validate={utils.makeFormikValidator(loginValidator)}
                  onSubmit={this.onSubmitSetupForm}
                >
                  {this.setupFormRender}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
