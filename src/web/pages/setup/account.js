const classNames = require('classnames');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const logo = require('../../../resource/logo-01.svg');
const decoration = require('../../../resource/decoration-01.svg');
const setupStep02 = require('../../../resource/setup-step-02.png');
const setupStep02x2 = require('../../../resource/setup-step-02@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const store = require('../../../core/store');
const setupAccountValidator = require('../../validations/setup/account-validator');
const utils = require('../../../core/utils');

module.exports = class SetupAccount extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;
  }

  onSubmitSetupAccountForm = values => {
    const $setup = store.get('$setup');
    $setup.account = values;
    store.set('$setup', $setup);
    getRouter().go('/setup/https');
  };

  setupAccountFormRender = ({errors, touched}) => {
    const classTable = {
      account: classNames(
        'form-control', {'is-invalid': errors.account && touched}
      ),
      birthday: classNames(
        'form-control', {'is-invalid': errors.birthday && touched}
      ),
      password: classNames(
        'form-control', {'is-invalid': errors.password && touched}
      ),
      confirmPassword: classNames(
        'form-control', {'is-invalid': errors.confirmPassword && touched}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <div className="steps">
            <div className="d-flex justify-content-between">
              <p className="text-primary">{_('Language')}</p>
              <p className="text-primary">{_('SETUP-Account')}</p>
              <p>{_('HTTPS')}</p>
            </div>
            <img src={setupStep02} srcSet={`${setupStep02x2} 2x`}/>
            <Link to="/setup/language" className="go-back"><i className="fas fa-chevron-left"/></Link>
          </div>
          <div className="form-group">
            <label>{_('Permission')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field component="select" name="permission" className="form-control border-0">
                <option value={UserPermission.root}>{_(`permission-${UserPermission.root}`)}</option>
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Account')}</label>
            <Field autoFocus name="account" maxLength={UserSchema.account.max} type="text" className={classTable.account} placeholder={_('Please enter your account.')}/>
            {
              errors.account && touched && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Birthday')}</label>
            <Field name="birthday" component={Password} inputProps={{
              placeholder: _('Enter your Birthday'),
              className: classTable.birthday
            }}/>
            {
              errors.birthday && touched && (
                <div className="invalid-feedback">{errors.birthday}</div>
              )
            }
            <small className="form-text text-muted">{_('This value is for resetting password, such as 19900101.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _('Enter your password'),
              className: classTable.password
            }}/>
            {
              errors.password && touched && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
            <small className="text-info">
              {_('8-16 characters, contain at least 1 upper and lowercase, 1 number, 1 symbol. Do not use #, %, &, `, “, \\, <, > and space')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm password')}</label>
            <Field name="confirmPassword" component={Password} inputProps={{
              placeholder: _('Confirm your password'),
              className: classTable.confirmPassword
            }}/>
            {
              errors.confirmPassword && touched && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
          </div>

          <button disabled={this.state.$isApiProcessing || !utils.isObjectEmpty(errors)} type="submit" className="btn btn-primary btn-block rounded-pill">
            {_('Next')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const initialValue = store.get('$setup').account;

    return (
      <div className="page-setup-account">
        <img src={logo} className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <Formik
                initialValues={initialValue}
                validate={setupAccountValidator}
                onSubmit={this.onSubmitSetupAccountForm}
              >
                {this.setupAccountFormRender}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
