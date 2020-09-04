const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');
const Password = require('../../../core/components/fields/password');
const UserSchema = require('webserver-form-schema/user-schema');
const forgotPasswordValidator = require('../../validations/account/forgot-password-validator');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const {default: AccountContainer} = require('./account-container');

module.exports = class ForgotPassword extends Base {
  constructor(props) {
    super(props);
    this.state.isIncorrectBirthday = null;

    this.onSubmitForgotPasswordForm = this.onSubmitForgotPasswordForm.bind(this);
    this.forgotPasswordFormRender = this.forgotPasswordFormRender.bind(this);
  }

  /**
   * Handler on user submit the forgot password form.
   * @param {Object} values
   * @property {String} account
   * @property {String} birthday e.g. "19900101"
   * @returns {void}
   */
  onSubmitForgotPasswordForm(values) {
    progress.start();
    this.setState({isIncorrectBirthday: false});
    api.validation.accountBirthday(values)
      .then(() => {
        getRouter().go({
          name: 'reset-password',
          params: values
        });
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
        utils.renderError(error);
      });
  }

  forgotPasswordFormRender({errors, submitCount}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      account: classNames(
        'form-control',
        {'is-invalid': errors.account && isSubmitted}
      ),
      birthday: classNames(
        'form-control',
        {'is-invalid': (errors.birthday && isSubmitted) || this.state.isIncorrectBirthday}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <h3 className="card-title text-primary">{_('FORGOT PASSWORD')}</h3>
          <div className="card-sub-title text-info">
            {_('Enter Your Username and Birthday')}
          </div>

          <div className="form-group">
            <label>{_('Username')}</label>
            <Field
              name="account"
              type="text"
              maxLength={UserSchema.account.max}
              placeholder={_('Enter Your Username')}
              className={classTable.account}
            />
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
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
            {
              ((errors.birthday && isSubmitted) || this.state.isIncorrectBirthday) && (
                <div className="invalid-feedback">
                  {errors.birthday || _('Incorrect birthday.')}
                </div>
              )
            }
            {/* <small className="form-text text-muted">{_('This is used for resetting password.')}</small> */}
          </div>

          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
            <Once>{_('Submit')}</Once>
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <AccountContainer page="page-forgot-password">
        <Formik
          initialValues={{
            account: '',
            birthday: ''
          }}
          validate={utils.makeFormikValidator(forgotPasswordValidator)}
          onSubmit={this.onSubmitForgotPasswordForm}
        >
          {this.forgotPasswordFormRender}
        </Formik>
      </AccountContainer>
    );
  }
};
