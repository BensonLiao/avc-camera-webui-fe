const classNames = require('classnames');
const progress = require('nprogress');
const React = require('react');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const logo = require('../../../resource/logo-avc-secondary.svg');
const setupStep02 = require('../../../resource/setup-step-02.png');
const api = require('../../../core/apis/web-api');
const i18n = require('../../../i18n').default;
const Base = require('../shared/base');
const Password = require('../../../core/components/fields/password');
const store = require('../../../core/store');
const setupAccountValidator = require('../../validations/setup/account-validator');
const utils = require('../../../core/utils');
const ProgressBar = require('./progress-bar').default;

module.exports = class SetupAccount extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;
  }

  /**
   * @param {Object} values
   * @returns {void}
   */
  onSubmitSetupForm = values => {
    const $setup = store.get('$setup');

    progress.start();
    api.system.setup({
      language: $setup.language,
      account: {
        account: values.account,
        password: values.password
      }
    })
      .then(() => {
        location.href = '/';
      })
      .finally(progress.done);
  };

  setupAccountFormRender = ({errors, touched}) => {
    const classTable = {
      account: classNames(
        'form-control', {'is-invalid': errors.account && touched.account}
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
          />

          <div className="form-group">
            <label>{i18n.t('Permission')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field component="select" name="permission" className="form-control border-0">
                <option value={UserPermission.root}>{i18n.t(`permission-${UserPermission.root}`)}</option>
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>{i18n.t('Account')}</label>
            <Field autoFocus name="account" maxLength={UserSchema.account.max} type="text" className={classTable.account} placeholder={i18n.t('Enter a name for this account')}/>
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
            <small className="text-info">
              {i18n.t('1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{i18n.t('Password')}</label>
            <Field
              name="password"
              component={Password}
              inputProps={{
                placeholder: i18n.t('Enter a password'),
                className: classTable.password
              }}
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback"/>
            <small className="text-info">
              {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{i18n.t('Confirm Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                placeholder: i18n.t('Enter the password again'),
                className: classTable.confirmPassword
              }}
            />
            <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
          </div>

          <button disabled={this.state.$isApiProcessing || !utils.isObjectEmpty(errors)} type="submit" className="btn btn-primary btn-block rounded-pill">
            {i18n.t('Done')}
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
                onSubmit={this.onSubmitSetupForm}
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
