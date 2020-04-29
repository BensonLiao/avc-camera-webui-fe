/* eslint-disable complexity */
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
const {SECURITY_USERS_MAX} = require('../../../core/constants');

module.exports = class User extends Base {
  static get propTypes() {
    return {
      users: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          permission: PropTypes.number.isRequired,
          account: PropTypes.string.isRequired
        })).isRequired
      }),
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
    this.state = {
      isShowModal: true,
      usersName: this.props.users.items.map(user => user.account)
    };
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        const isShowModal = [
          'web.users.accounts.new-user',
          'web.users.accounts.details'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  generateInitialValue = user => {
    if (user) {
      return {
        id: user.id,
        permission: user.permission,
        account: user.account,
        password: '',
        newPassword: '',
        confirmPassword: ''
      };
    }

    return {
      permission: UserPermission.root,
      account: '',
      password: '',
      confirmPassword: ''
    };
  };

  hideModal = (reload = false) => {
    getRouter().go({
      name: 'web.users.accounts'
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
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    } else {
      // Add a new user.
      api.user.addUser(values)
        .then(() => {
          this.hideModal(true);
        })
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    }
  };

  checkDuplicate = values => {
    if (!this.props.user) {
      return utils.duplicateCheck(
        this.state.usersName,
        values,
        _('Same name found, please use a different name.')
      );
    }
  }

  formRender = ({errors, touched}) => {
    const {users: {items}, user} = this.props;
    const isAddUserDisabled = items.length >= SECURITY_USERS_MAX && !user;
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
            <Field name="account" type="text" placeholder={_('Enter your account')}
              maxLength={UserSchema.account.max}
              validate={this.checkDuplicate}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_(this.props.user ? 'Old Password' : 'Password')}</label>
            <Field name="password" component={Password} inputProps={{
              placeholder: _(this.props.user ? 'Enter your old password' : 'Enter your password'),
              className: classNames('form-control', {'is-invalid': errors.password && touched.password})
            }}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          {
            user && (
              <div className="form-group has-feedback">
                <label>{_('New Password')}</label>
                <Field name="newPassword" component={Password} inputProps={{
                  placeholder: _('Enter your new password'),
                  className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword})
                }}/>
                <small className="text-info">
                  {_('8-16 characters, contain at least 1 upper and lowercase, 1 number, 1 symbol. Do not use #, %, &, `, “, \\, <, > and space')}
                </small>
                {
                  errors.newPassword && touched.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )
                }
              </div>
            )
          }
          <div className="form-group has-feedback">
            <label>{_(user ? 'Confirm New Password' : 'Confirm Password')}</label>
            <Field name="confirmPassword" component={Password} inputProps={{
              placeholder: _(user ? 'Confirm your new password' : 'Confirm your password'),
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
            <button
              disabled={this.state.$isApiProcessing || isAddUserDisabled}
              type="submit"
              className="btn btn-primary btn-block rounded-pill"
            >
              {user ? _('Confirm') : _('New')}
            </button>
          </div>
          <button
            disabled={this.state.$isApiProcessing}
            className="btn btn-info btn-block m-0 rounded-pill"
            type="button"
            onClick={this.hideModal}
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
          <Modal.Title as="h5">{user ? _('Modify User') : _('New User')}</Modal.Title>
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
