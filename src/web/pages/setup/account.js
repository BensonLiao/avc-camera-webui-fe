const classNames = require('classnames');
const React = require('react');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const logo = require('../../../resource/logo-avc-secondary.svg');
const setupStep02 = require('../../../resource/setup-step-02.png');
const setupStep02x2 = require('../../../resource/setup-step-02@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const store = require('../../../core/store');
const setupAccountValidator = require('../../validations/setup/account-validator');
const utils = require('../../../core/utils');
const {default: ProgressBar} = require('./progress-bar');

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
        'form-control', {'is-invalid': errors.account && touched.account}
      ),
      birthday: classNames(
        'form-control', {'is-invalid': errors.birthday && touched.birthday}
      ),
      password: classNames(
        'form-control', {'is-invalid': errors.password && touched.password}
      ),
      confirmPassword: classNames(
        'form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <ProgressBar
            step={2}
            progressBarImage={setupStep02}
            progressBarImagex2={setupStep02x2}
          />

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
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
            <small className="text-info">
              {_('1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Birthday')}</label>
            <Field
              name="birthday"
              component={Password}
              inputProps={{
                placeholder: '19900101',
                className: classTable.birthday
              }}
            />
            <ErrorMessage component="div" name="birthday" className="invalid-feedback"/>
            <small className="form-text text-muted">{_('This is used for resetting password.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field
              name="password"
              component={Password}
              inputProps={{
                placeholder: _('Enter your password'),
                className: classTable.password
              }}
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback"/>
            <small className="text-info">
              {_('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                placeholder: _('Confirm Your Password'),
                className: classTable.confirmPassword
              }}
            />
            <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
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
      <div className="page-setup-account bg-secondary">
        <div className="navbar primary">
          { !window.isNoBrand &&
          <img src={logo}/>}
        </div>
        <div className="container-fluid">
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
