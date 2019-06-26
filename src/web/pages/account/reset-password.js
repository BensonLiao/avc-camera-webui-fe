const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const resetPasswordSchema = require('../../validations/account/reset-password-schema');
const api = require('../../../core/apis/web-api');

module.exports = class ResetPassword extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        account: PropTypes.string.isRequired,
        birthday: PropTypes.string.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);

    this.onSubmitResetPasswordForm = this.onSubmitResetPasswordForm.bind(this);
    this.resetPasswordFormRender = this.resetPasswordFormRender.bind(this);
  }

  onSubmitResetPasswordForm(values) {
    /*
    The user submit the reset password form.
    @param values {Object}
      password: {String}
      confirmPassword: {String}
     */
    progress.start();
    api.account.changePasswordWithBirthday({
      ...values,
      account: this.props.params.account,
      birthday: this.props.params.birthday
    })
      .then(() => {
        getRouter().go('/reset-password-success', {replace: true});
      })
      .catch(error => {
        progress.done();
        getRouter().renderError(error);
      });
  }

  resetPasswordFormRender({errors, submitCount}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      passwordGroupText: classNames([
        'input-group-text',
        {'border-danger': errors.password && isSubmitted}
      ]),
      password: classNames([
        'form-control rounded-circle-right',
        {'is-invalid': errors.password && isSubmitted}
      ]),
      confirmPasswordGroupText: classNames([
        'input-group-text',
        {'border-danger': errors.confirmPassword && isSubmitted}
      ]),
      confirmPassword: classNames([
        'form-control rounded-circle-right',
        {'is-invalid': errors.confirmPassword && isSubmitted}
      ])
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <Once>
            <h5 className="card-title text-primary">{_('Reset password')}</h5>
          </Once>
          <div className="form-group">
            <label>{_('New password')}</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className={classTable.passwordGroupText}><i className="fas fa-lock"/></span>
              </div>
              <Field autoFocus name="password" maxLength="1024" type="password" className={classTable.password} placeholder={_('Please enter your new password')}/>
              {
                errors.password && isSubmitted && (
                  <div className="invalid-feedback" style={{paddingLeft: '40px'}}>
                    {errors.password}
                  </div>
                )
              }
            </div>
          </div>
          <div className="form-group">
            <label>{_('Confirm password')}</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className={classTable.confirmPasswordGroupText}><i className="fas fa-lock"/></span>
              </div>
              <Field name="confirmPassword" maxLength="12" type="password" className={classTable.confirmPassword} placeholder={_('Please enter your new password again')}/>
              {
                (errors.confirmPassword && isSubmitted) && (
                  <div className="invalid-feedback" style={{paddingLeft: '40px'}}>
                    {errors.confirmPassword}
                  </div>
                )
              }
            </div>
          </div>
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            <Once>{_('Reset password')}</Once>
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <div className="page-reset-password">
        <img src={logo} height="48" className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <p className="text-light text-center text-welcome"/>

              <Formik
                initialValues={{password: '', confirmPassword: ''}}
                validationSchema={resetPasswordSchema}
                render={this.resetPasswordFormRender}
                onSubmit={this.onSubmitResetPasswordForm}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
