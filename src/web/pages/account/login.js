const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const loginSchema = require('../../validations/account/login-schema');
const api = require('../../../core/apis/web-api');

module.exports = class Login extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectPassword = null;

    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
    this.loginFormRender = this.loginFormRender.bind(this);
  }

  onSubmitLoginForm(values) {
    /*
    The user submit the login form.
    @param values {Object}
     */
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
        getRouter().renderError(error);
      });
  }

  loginFormRender({errors, submitCount}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      accountGroupText: classNames([
        'input-group-text',
        {'border-danger': errors.account && isSubmitted}
      ]),
      account: classNames([
        'form-control rounded-circle-right',
        {'is-invalid': errors.account && isSubmitted}
      ]),
      passwordGroupText: classNames([
        'input-group-text',
        {'border-danger': (errors.password && isSubmitted) || this.state.isIncorrectPassword}
      ]),
      password: classNames([
        'form-control rounded-circle-right',
        {'is-invalid': (errors.password && isSubmitted) || this.state.isIncorrectPassword}
      ])
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
              <Field autoFocus name="account" maxLength="1024" type="text" className={classTable.account}/>
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
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="input-autocomplete-password"/>
            <label className="form-check-label" htmlFor="input-autocomplete-password">記住我的密碼</label>
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
        <img src={logo} height="48" className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <Once>
                <p className="text-light text-center text-welcome">
                  {_('Welcome to use AndroVideo system')}
                </p>
              </Once>

              <Formik
                initialValues={{account: '', password: ''}}
                validationSchema={loginSchema}
                render={this.loginFormRender}
                onSubmit={this.onSubmitLoginForm}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
