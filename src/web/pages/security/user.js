const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const _ = require('../../../languages');
const UserValidator = require('../../validations/users/user-validator');
const NewUserValidator = require('../../validations/users/new-user-validator');
const Password = require('../../../core/components/fields/password');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class User extends Base {
  static get propTypes() {
    return {
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        permission: PropTypes.number.isRequired,
        account: PropTypes.string.isRequired
      })
    };
  }

  constructor(props) {
    super(props);
    const router = getRouter();
    this.state.isShowModal = true;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        const isShowModal = [
          'web.security.users.new-user',
          'web.security.users.details'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  generateInitialValue = user => {
    if (user) {
      return {
        id: user.id,
        permission: user.permission.toString(),
        account: user.account,
        birthday: '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      };
    }

    return {
      permission: '0',
      account: '',
      birthday: '',
      password: '',
      confirmPassword: ''
    };
  };

  hideModal = (reload = false) => {
    getRouter().go({
      name: 'web.security.users'
    }, {reload});
  };

  onSubmitForm = values => {
    progress.start();
    if (this.props.user) {
      // Update the user.
      api.user.updateUser(values)
        .then(() => {
          this.hideModal(true);
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    } else {
      // Add a new user.
      api.user.addUser(values)
        .then(() => {
          this.hideModal(true);
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    }
  };

  formRender = ({errors, touched}) => {
    return (
      <Form>
        <div className="modal-body">
          <div className="form-group">
            <label>{_('Permission')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field name="permission" component="select" className="form-control border-0">
                {
                  UserPermission.all().map(permission => (
                    <option key={permission} value={permission}>
                      {_(`permission-${permission}`)}
                    </option>
                  ))
                }
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Account')}</label>
            <Field name="account" type="text" placeholder={_('Please enter your account.')}
              maxLength={UserSchema.account.max}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
            <small className="form-text text-muted">{_('Please enter less than 9 letters.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>{_('Birthday')}</label>
            <Field name="birthday" component={Password} inputProps={{
              placeholder: _('Please enter your birthday.'),
              className: classNames('form-control', {'is-invalid': errors.birthday && touched.birthday})
            }}/>
            {
              errors.birthday && touched.birthday && (
                <div className="invalid-feedback">{errors.birthday}</div>
              )
            }
            <small className="form-text text-muted">
              {_('This value is for resetting password, such as 19910326.')}
            </small>
          </div>
          <div className="form-group has-feedback">
            <label>{_(this.props.user ? 'Old password' : 'Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _(this.props.user ? 'Please enter your old password.' : 'Please enter your password.'),
              className: classNames('form-control', {'is-invalid': errors.password && touched.password})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          {
            this.props.user && (
              <div className="form-group has-feedback">
                <label>{_('Confirm new password')}</label>
                <Field name="newPassword" component={Password} inputProps={{
                  placeholder: _('Please enter your new password.'),
                  className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword})
                }}/>
                {
                  errors.newPassword && touched.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )
                }
                <small className="form-text text-muted">{_('Please enter less than 9 letters.')}</small>
              </div>
            )
          }
          <div className="form-group has-feedback">
            <label>{_(this.props.user ? 'Confirm new password' : 'Confirm password')}</label>
            <Field name="confirmPassword" component={Password} inputProps={{
              placeholder: _(this.props.user ? 'Please confirm your new password.' : 'Please confirm your password.'),
              className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword})
            }}/>
            {
              errors.confirmPassword && touched.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button type="submit" className="btn btn-primary btn-block rounded-pill">
              {this.props.user ? _('Confirm') : _('New')}
            </button>
          </div>
          <button className="btn btn-secondary btn-block m-0 rounded-pill"
            type="button" onClick={this.hideModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {user} = this.props;
    const validator = user ? UserValidator : NewUserValidator;

    return (
      <Modal autoFocus={false} show={this.state.isShowModal} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{user ? _('Modify user') : _('New user')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={this.generateInitialValue(user)}
          validate={utils.makeFormikValidator(
            validator,
            [user ? 'newPassword' : 'password', 'confirmPassword']
          )}
          onSubmit={this.onSubmitForm}
        >
          {this.formRender}
        </Formik>
      </Modal>
    );
  }
};
