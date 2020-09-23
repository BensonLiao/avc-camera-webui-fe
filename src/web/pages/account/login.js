const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const UserSchema = require('webserver-form-schema/user-schema');
const loginValidator = require('../../validations/account/login-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const constants = require('../../../core/constants');
const {default: AccountContainer} = require('./account-container');
const {default: AccountTitle} = require('./account-title');

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
    api.account.login(values)
      .then(response => {
        localStorage.setItem('$expires', response.data.expires - (constants.REDIRECT_COUNTDOWN * 1000));
        this.redirectPage();
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 429) {
            if (
              error.response.data && error.response.data.extra &&
              error.response.data.extra.loginLockRemainingMs
            ) {
              getRouter().go({
                name: 'login-lock',
                params: {loginLockExpiredTime: Date.now() + error.response.data.extra.loginLockRemainingMs}
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
                params: {loginFailedRemainingTimes: error.response.data.extra.loginFailedRemainingTimes}
              });
            }
          }
        }
      })
      .finally(progress.done);
  }

  loginFormRender = ({errors, touched}) => {
    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <AccountTitle title={_('ACCOUNT LOGIN')} subtitle={_('Enter Your Username and Password')}/>
          <div className="form-group">
            <label>{_('Username')}</label>
            <Field
              name="account"
              type="text"
              maxLength={UserSchema.account.max}
              placeholder={_('Enter Your Username')}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
            />
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field
              name="password"
              component={Password}
              inputProps={{
                placeholder: _('Enter your password'),
                className: classNames('form-control', {'is-invalid': errors.password && touched.password})
              }}
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback"/>
          </div>

          <button
            disabled={this.state.$isApiProcessing || !utils.isObjectEmpty(errors)}
            type="submit"
            className="btn btn-primary btn-block rounded-pill mt-5"
          >
            {_('Login')}
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <AccountContainer page="page-login">
        <Formik
          initialValues={{
            account: '',
            password: '',
            maxAge: '3600000'
          }}
          validate={utils.makeFormikValidator(loginValidator)}
          onSubmit={this.onSubmitLoginForm}
        >
          {this.loginFormRender}
        </Formik>
      </AccountContainer>
    );
  }
};
