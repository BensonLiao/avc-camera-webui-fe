const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Cookies = require('js-cookie');
const {Link, getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const loginValidator = require('../../validations/account/login-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');

module.exports = class Login extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectPassword = null;

    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
    this.loginFormRender = this.loginFormRender.bind(this);
  }

  /**
   * Handler on user submit the login form.
   * @param {Object} values
   * @property {String} account
   * @property {String} password
   * @returns {void}
   */
  onSubmitLoginForm(values) {
    progress.start();
    this.setState({isIncorrectPassword: false});
    api.account.login(values)
      .then(() => {
        const redirectUri = Cookies.get(window.config.cookies.redirect);
        if (redirectUri && /^\/.*/.test(redirectUri)) {
          Cookies.set(window.config.cookies.redirect, null, {expires: -100});
          location.href = redirectUri;
        } else {
          location.href = '/';
        }
      })
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

  loginFormRender({errors, submitCount}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      accountGroupText: classNames(
        'input-group-text',
        {'border-danger': errors.account && isSubmitted}
      ),
      account: classNames(
        'form-control rounded-circle-right',
        {'is-invalid': errors.account && isSubmitted}
      ),
      passwordGroupText: classNames(
        'input-group-text',
        {'border-danger': (errors.password && isSubmitted) || this.state.isIncorrectPassword}
      ),
      password: classNames(
        'form-control rounded-circle-right',
        {'is-invalid': (errors.password && isSubmitted) || this.state.isIncorrectPassword}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <Once>
            <h5 className="card-title text-primary">{_('Login')}</h5>
          </Once>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className={classTable.accountGroupText}><i className="fas fa-user"/></span>
              </div>
              <Field autoFocus name="account" maxLength="8" type="text" className={classTable.account}/>
              {
                errors.account && isSubmitted && (
                  <div className="invalid-feedback" style={{paddingLeft: '40px'}}>
                    {errors.account}
                  </div>
                )
              }
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className={classTable.passwordGroupText}><i className="fas fa-lock"/></span>
              </div>
              <Field name="password" maxLength="12" type="password" className={classTable.password}/>
              {
                ((errors.password && isSubmitted) || this.state.isIncorrectPassword) && (
                  <div className="invalid-feedback" style={{paddingLeft: '40px'}}>
                    {errors.password || _('Incorrect password x {0}', [this.state.loginFailedTimes])}
                  </div>
                )
              }
            </div>
          </div>
          <div className="form-group d-flex justify-content-between align-items-center">
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field component="select" name="maxAge" className="form-control border-0">
                <option value="600000">{_('Expires in 10 minutes')}</option>
                <option value="1800000">{_('Expires in 30 minutes')}</option>
                <option value="3600000">{_('Expires in 1 hour')}</option>
                <option value="43200000">{_('Expires in 12 hours')}</option>
              </Field>
            </div>
            <div className="text-right">
              <Link to="/forgot-password">{_('Forgot password?')}</Link>
            </div>
          </div>

          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            <Once>{_('Login')}</Once>
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <div className="page-login">
        <div className="navbar primary"/>
        <div className="container">
          <div className="row justify-content-center">
            <Once>
              <div className="col-12">
                <p className="text-light text-center text-welcome">
                  {_('Welcome to use AndroVideo system')}
                </p>
              </div>
            </Once>
            <div className="col-card">
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
