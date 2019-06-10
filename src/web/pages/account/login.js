const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Cookies = require('js-cookie');
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const loginSchema = require('../../../core/validations/account/login-schema');
const api = require('../../../core/apis/web-api');

module.exports = class Login extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectPassword = false;
    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
    this.loginFormRender = this.loginFormRender.bind(this);
  }

  onSubmitLoginForm(values) {
    /*
    The user submit the login form.
    @param values {Object}
     */
    progress.start();
    api.account.login(values)
      .then(() => {
        this.setState({isIncorrectPassword: false});
        const redirectUri = Cookies.get(window.config.cookies.redirect);
        if (redirectUri && /^\/.*/.test(redirectUri)) {
          Cookies.set(window.config.cookies.redirect, null, {expires: -100});
          location.href = redirectUri;
        } else {
          location.href = '/';
        }
      })
      .catch(error => {
        progress.done();
        if (error.response && error.response.status === 400) {
          this.setState({isIncorrectPassword: true});
          return;
        }

        getRouter().renderError(error);
      });
  }

  loginFormRender({errors, touched}) {
    const classTable = {
      account: classNames(['form-control', {'is-invalid': errors.account && touched.account}]),
      password: classNames(['form-control', {'is-invalid': errors.password && touched.password}])
    };

    return (
      <Form>
        <div className="form-group">
          <Once><label htmlFor="input-account">{_('Account')}</label></Once>
          <Field autoFocus name="account" type="text" className={classTable.account} id="input-account"/>
          {
            errors.account && touched.account && (
              <div className="invalid-feedback">{errors.account}</div>
            )
          }
        </div>
        <div className="form-group">
          <Once><label htmlFor="input-password">{_('Password')}</label></Once>
          <Field name="password" type="password" className={classTable.password} id="input-password"/>
          {
            errors.password && touched.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )
          }
        </div>
        {
          this.state.isIncorrectPassword && (
            <Once><div className="alert alert-danger">{_('Incorrect account or password.')}</div></Once>
          )
        }
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-outline-primary mr-3">
          <Once>{_('Login')}</Once>
        </button>
      </Form>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card mt-5">
              <div className="card-body">
                {/* Title */}
                <Once><h5 className="card-title text-center">{_('Login')}</h5></Once>

                {/* Password login form */}
                <Formik
                  initialValues={{account: '', password: ''}}
                  validationSchema={loginSchema}
                  render={this.loginFormRender}
                  onSubmit={this.onSubmitLoginForm}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
