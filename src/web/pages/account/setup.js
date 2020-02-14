const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Cookies = require('js-cookie');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const setupAccountValidator = require('../../validations/setup/account-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const logo = require('../../../resource/logo-avn-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avn-title.svg');

module.exports = class Setup extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectPassword = null;
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

  setupFormRender = ({errors, touched}) => {
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
              placeholder: _('Enter your password'),
              className: classNames('form-control', {'is-invalid': errors.password})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
            <small className="form-text text-muted text-size-14">
              {_('8-16 characters ,contain at least 1 upper and lowercase,1 number, 1 special characters. Do not use #, %, &,`, “, \\, <, > and space.')}
            </small>s
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm password')}</label>
            <Field name="confirmPassword" component={Password} inputProps={{
              placeholder: _('Enter your password again'),
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
                initialValues={{
                  account: 'admin',
                  permission: UserPermission.root,
                  password: '',
                  confirmPassword: ''
                }}
                validate={utils.makeFormikValidator(
                  setupAccountValidator,
                  ['password', 'confirmPassword']
                )}
                onSubmit={this.onSubmitSetupForm}
              >
                {this.setupFormRender}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
