const classNames = require('classnames');
const React = require('react');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const setupStep02 = require('webserver-prototype/src/resource/setup-step-02.png');
const setupStep02x2 = require('webserver-prototype/src/resource/setup-step-02@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const store = require('../../../core/store');
const setupAccountSchema = require('../../validations/setup/account-schema');

module.exports = class SetupAccount extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;
    this.state.fieldTypes = {
      birthday: 'password',
      password: 'password',
      confirmPassword: 'password'
    };

    this.generateTogglePasswordFieldHandler = this.generateTogglePasswordFieldHandler.bind(this);
    this.setupAccountFormRender = this.setupAccountFormRender.bind(this);
    this.onSubmitSetupAccountForm = this.onSubmitSetupAccountForm.bind(this);
  }

  generateTogglePasswordFieldHandler(field) {
    return event => {
      event.preventDefault();
      this.setState(previousState => {
        return {
          ...previousState,
          fieldTypes: {
            ...previousState.fieldTypes,
            [field]: previousState.fieldTypes[field] === 'password' ? 'text' : 'password'
          }
        };
      });
    };
  }

  onSubmitSetupAccountForm(values) {
    console.log(values); // Debug
    const $setup = store.get('$setup');
    $setup.account = values;
    store.set('$setup', $setup);
  }

  setupAccountFormRender({errors, submitCount}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      account: classNames([
        'form-control', {'is-invalid': errors.account && isSubmitted}
      ]),
      birthday: classNames([
        'form-control', {'is-invalid': errors.birthday && isSubmitted}
      ]),
      password: classNames([
        'form-control', {'is-invalid': errors.password && isSubmitted}
      ]),
      confirmPassword: classNames([
        'form-control', {'is-invalid': errors.confirmPassword && isSubmitted}
      ])
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
                <option value="admin">{_('permission-admin')}</option>
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Account')}</label>
            <Field autoFocus name="account" maxLength="8" type="text" className={classTable.account} placeholder={_('Please enter your account.')}/>
            {
              errors.account && isSubmitted && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
            <small className="form-text text-muted">{_('Please enter less than 9 letters.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Birthday')}</label>
            <Field name="birthday" type={this.state.fieldTypes.birthday} className={classTable.birthday} placeholder={_('Please enter your birthday.')}/>
            <a href="#" className="form-control-feedback text-muted" onClick={this.generateTogglePasswordFieldHandler('birthday')}>
              {this.state.fieldTypes.birthday === 'password' ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </a>
            {
              errors.birthday && isSubmitted && (
                <div className="invalid-feedback">{errors.birthday}</div>
              )
            }
            <small className="form-text text-muted">{_('This value is for resetting password, such as 19910326.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Password')}</label>
            <Field name="password" type={this.state.fieldTypes.password} className={classTable.password} placeholder={_('Please enter your password.')}/>
            <a href="#" className="form-control-feedback text-muted" onClick={this.generateTogglePasswordFieldHandler('password')}>
              {this.state.fieldTypes.password === 'password' ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </a>
            {
              errors.password && isSubmitted && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
            <small className="form-text text-muted">{_('Please enter letters between 8 and 12.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm password')}</label>
            <Field name="confirmPassword" type={this.state.fieldTypes.confirmPassword} className={classTable.confirmPassword} placeholder={_('Please enter your password again.')}/>
            <a href="#" className="form-control-feedback text-muted" onClick={this.generateTogglePasswordFieldHandler('confirmPassword')}>
              {this.state.fieldTypes.password === 'password' ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </a>
            {
              errors.confirmPassword && isSubmitted && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
          </div>

          <button type="submit" className="btn btn-primary btn-block rounded-pill">
            {_('Next')}
          </button>
        </div>
      </Form>
    );
  }

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
                validationSchema={setupAccountSchema}
                render={this.setupAccountFormRender}
                onSubmit={this.onSubmitSetupAccountForm}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
