const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const Password = require('../../../core/components/fields/password');
const resetPasswordValidator = require('../../validations/account/reset-password-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const {default: AccountContainer} = require('./account-container');
const {default: AccountTitle} = require('./account-title');

module.exports = class ResetPassword extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        account: PropTypes.string.isRequired,
        birthday: PropTypes.string.isRequired
      }).isRequired
    };
  }

  /**
   * Handler on user submit the reset password form.
   * @param {Object} values
   * @property {String} password
   * @property {String} confirmPassword
   * @returns {void}
   */
  onSubmitResetPasswordForm = values => {
    const {params: {account, birthday}} = this.props;
    progress.start();
    api.account.changePasswordWithBirthday({
      ...values,
      account: account,
      birthday: birthday
    })
      .then(() => {
        getRouter().go('/reset-password-success', {replace: true});
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  }

  resetPasswordFormRender = ({errors, touched}) => {
    const classTable = {
      newPassword: classNames(
        'form-control',
        {'is-invalid': errors.newPassword && touched.newPassword}
      ),
      confirmPassword: classNames(
        'form-control',
        {'is-invalid': errors.confirmPassword && touched.confirmPassword}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <AccountTitle title={_('RESET PASSWORD')} subtitle={_('Enter Your New Password')}/>
          <div className="form-group has-feedback">
            <label>{_('New Password')}</label>
            <Field
              name="newPassword"
              component={Password}
              inputProps={{
                placeholder: _('Enter Your New Password'),
                className: classTable.newPassword
              }}
            />
            <small className="text-info">
              {_('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
            </small>
            <ErrorMessage component="div" name="newPassword" className="invalid-feedback"/>
          </div>

          <div className="form-group has-feedback">
            <label>{_('Confirm New Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                placeholder: _('Confirm Your New Password'),
                className: classTable.confirmPassword
              }}
            />
            <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
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
      <AccountContainer page="page-reset-password">
        <Formik
          initialValues={{
            newPassword: '',
            confirmPassword: ''
          }}
          validate={utils.makeFormikValidator(resetPasswordValidator, ['newPassword', 'confirmPassword'])}
          onSubmit={this.onSubmitResetPasswordForm}
        >
          {this.resetPasswordFormRender}
        </Formik>
      </AccountContainer>
    );
  }
};
