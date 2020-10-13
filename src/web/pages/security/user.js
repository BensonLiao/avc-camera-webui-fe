const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const UserValidator = require('../../validations/users/user-validator');
const NewUserValidator = require('../../validations/users/new-user-validator');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const {SECURITY_USERS_MAX} = require('../../../core/constants');
const Password = require('../../../core/components/fields/password');
const SelectField = require('../../../core/components/fields/select-field');

module.exports = class User extends Base {
  static get propTypes() {
    return {
      users: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          permission: PropTypes.string.isRequired,
          account: PropTypes.string.isRequired
        })).isRequired
      }),
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        permission: PropTypes.string.isRequired,
        account: PropTypes.string.isRequired
      })
    };
  }

  constructor(props) {
    super();
    const router = getRouter();
    this.state.isShowModal = true;
    this.state.usersName = props.users.items.map(user => user.account);
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
        permission: user.permission === UserPermission.viewer ? UserPermission.guest : user.permission,
        account: user.account,
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
    getRouter().go({name: 'web.users.accounts'}, {reload});
  };

  onSubmitForm = values => {
    progress.start();
    if (this.props.user) {
      // Update the user.
      let submitValues = {...values};
      if (this.props.user.permission === UserPermission.viewer) {
        submitValues.permission = UserPermission.viewer;
      }

      api.user.updateUser(submitValues)
        .then(() => {
          this.hideModal(true);
        })
        .finally(progress.done);
    } else {
      // Add a new user.
      api.user.addUser(values)
        .then(() => {
          this.hideModal(true);
        })
        .finally(progress.done);
    }
  };

  checkDuplicate = values => {
    let nameList;
    if (this.props.user) { // Check duplicate when editing user, removes user's own name from list to check
      nameList = this.state.usersName.filter(name => name !== this.props.user.account);
    }

    return utils.duplicateCheck(
      nameList || this.state.usersName,
      values,
      i18n.t('Same name found, please use a different name.')
    );
  }

  formRender = ({errors, touched}) => {
    const {users: {items}, user} = this.props;
    const {$isApiProcessing} = this.state;
    const isSuperAdmin = user && (user.permission === UserPermission.superAdmin);
    const isAddUserDisabled = items.length >= SECURITY_USERS_MAX && !user;
    const permissionList = UserPermission.all().reduce((permissionList, permission) => {
      if (permission !== UserPermission.superAdmin && permission !== UserPermission.viewer) {
        permissionList.push(
          <option key={permission} value={permission}>
            {i18n.t(`permission-${permission}`)}
          </option>);
      }

      return permissionList;
    }, []);
    return (
      <Form>
        <div className="modal-body">
          <SelectField readOnly={isSuperAdmin} labelName={i18n.t('Permission')} name="permission" wrapperClassName="px-2">
            {permissionList}
          </SelectField>
          <div className="form-group">
            <label>{i18n.t('Account')}</label>
            <Field
              name="account"
              type="text"
              placeholder={i18n.t('Enter your account')}
              disabled={isSuperAdmin}
              maxLength={UserSchema.account.max}
              validate={this.checkDuplicate}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
            />
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
          </div>
          { !user && (
            <div className="form-group has-feedback">
              <label>{i18n.t('Password')}</label>
              <Field
                name="password"
                component={Password}
                inputProps={{
                  placeholder: i18n.t('Enter your password'),
                  className: classNames('form-control', {'is-invalid': errors.password && touched.password})
                }}
              />
              <small className="text-info">
                {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
              </small>
              <ErrorMessage component="div" name="password" className="invalid-feedback"/>
            </div>
          )}
          {
            user && (
              <div className="form-group has-feedback">
                <label>{i18n.t('New Password')}</label>
                <Field
                  name="newPassword"
                  component={Password}
                  inputProps={{
                    placeholder: i18n.t('Enter Your New Password'),
                    className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword})
                  }}
                />
                <small className="text-info">
                  {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
                </small>
                <ErrorMessage component="div" name="newPassword" className="invalid-feedback"/>
              </div>
            )
          }
          <div className="form-group has-feedback">
            <label>{i18n.t(user ? 'Confirm New Password' : 'Confirm Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                placeholder: i18n.t(user ? 'Confirm Your New Password' : 'Confirm Your Password'),
                className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword})
              }}
            />
            <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button
              disabled={$isApiProcessing || isAddUserDisabled}
              type="submit"
              className="btn btn-primary btn-block rounded-pill"
            >
              {user ? i18n.t('Confirm') : i18n.t('New')}
            </button>
          </div>
          <button
            disabled={$isApiProcessing}
            className="btn btn-info btn-block m-0 rounded-pill"
            type="button"
            onClick={this.hideModal}
          >
            {i18n.t('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {user} = this.props;
    const {$isApiProcessing, isShowModal} = this.state;
    const validator = user ? UserValidator : NewUserValidator;

    return (
      <Modal autoFocus={false} show={isShowModal} backdrop={$isApiProcessing ? 'static' : true} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{user ? i18n.t('Modify User') : i18n.t('New User')}</Modal.Title>
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
