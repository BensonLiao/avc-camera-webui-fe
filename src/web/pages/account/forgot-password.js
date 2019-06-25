const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const forgotPasswordSchema = require('../../../core/validations/account/forgot-password-schema');
const api = require('../../../core/apis/web-api');

module.exports = class ForgotPassword extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectBirthday = null;
    this.onSubmitForgotPasswordForm = this.onSubmitForgotPasswordForm.bind(this);
    this.forgotPasswordFormRender = this.forgotPasswordFormRender.bind(this);
  }

  onSubmitForgotPasswordForm(values) {
    /*
    The user submit the forgot password form.
    @param values {Object}
     */
    progress.start();
    this.setState({isIncorrectBirthday: false});
    api.validation.accountBirthday(values)
      .then(() => {
        getRouter().go('/change-password');
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            progress.done();
            this.setState({isIncorrectBirthday: true});
            return;
          }
        }

        progress.done();
        getRouter().renderError(error);
      });
  }

  forgotPasswordFormRender({errors, submitCount}) {
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
      birthdayGroupText: classNames([
        'input-group-text',
        {'border-danger': (errors.birthday && isSubmitted) || this.state.isIncorrectBirthday}
      ]),
      birthday: classNames([
        'form-control rounded-circle-right',
        {'is-invalid': (errors.birthday && isSubmitted) || this.state.isIncorrectBirthday}
      ])
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <Once>
            <h5 className="card-title text-primary">{_('Forgot password')}</h5>
          </Once>
          <div className="form-group">
            <label>{_('Account')}</label>
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
            <label>{_('Birthday')}</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className={classTable.birthdayGroupText}><i className="fas fa-birthday-cake"/></span>
              </div>
              <Field name="birthday" maxLength="8" type="text" className={classTable.birthday} placeholder={_('Please enter you birthday')}/>
              {
                ((errors.birthday && isSubmitted) || this.state.isIncorrectBirthday) && (
                  <div className="invalid-feedback" style={{paddingLeft: '40px'}}>
                    {errors.birthday || _('Incorrect birthday.')}
                  </div>
                )
              }
            </div>
            <small className="form-text text-muted" style={{paddingLeft: '40px'}}>
              Ex : 19910326
            </small>
          </div>
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            <Once>{_('OK')}</Once>
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <div className="page-forgot-password">
        <img src={logo} height="48" className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <p className="text-light text-center text-welcome"/>

              <Formik
                initialValues={{account: '', birthday: ''}}
                validationSchema={forgotPasswordSchema}
                render={this.forgotPasswordFormRender}
                onSubmit={this.onSubmitForgotPasswordForm}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
