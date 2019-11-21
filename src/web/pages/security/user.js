const classNames = require('classnames');
const progress = require('nprogress');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserSchema = require('webserver-form-schema/user-schema');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const _ = require('../../../languages');
const UserValidator = require('../../validations/users/user-validator');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class User extends Base {
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
        birthday: user.birthday,
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
      newPassword: '',
      confirmPassword: ''
    };
  };

  hideModal = () => {
    getRouter().go({
      name: this.props.parentRouteName,
      params: this.props.params
    });
  };

  onSubmitForm = values => {
    const data = {...values};
    progress.start();
    if (this.props.user) {
      // Update the user.
      api.user.updateUser(data)
        .then(() => {
          getRouter().go({name: 'web.security.users', params: this.props.params}, {reload: true});
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    } else {
      // Add a new user.
      api.user.addUser(data)
        .then(() => {
          getRouter().go({name: 'web.security.users', params: {}}, {reload: true});
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
            <label>權限</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field name="permission" component="select" className="form-control border-0">
                <option value={UserPermission.root}>
                  {_(`permission-${UserPermission.root}`)}
                </option>
                <option value={UserPermission.guest}>
                  {_(`permission-${UserPermission.guest}`)}
                </option>
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>帳號</label>
            <Field name="account" type="text" placeholder="請輸入您的帳號"
              maxLength={UserSchema.account.max}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
            <small className="form-text text-muted">8 字元以內的大寫或小寫</small>
          </div>
          <div className="form-group has-feedback">
            <label>生日</label>
            <Field name="birthday" type="text" placeholder="請輸入您的西元出生年月日"
              className={classNames('form-control', {'is-invalid': errors.birthday && touched.birthday})}/>
            {
              errors.birthday && touched.birthday && (
                <div className="invalid-feedback">{errors.birthday}</div>
              )
            }
            <small className="form-text text-muted">Ex:19910326，此欄位是為了讓您忘記密碼可使用來重設密碼</small>
          </div>
          <div className="form-group has-feedback">
            <label>舊密碼</label>
            <Field name="password" type="text" placeholder="請輸入您的舊密碼"
              className={classNames('form-control', {'is-invalid': errors.password && touched.password})}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye"/></a>
          </div>
          <div className="form-group has-feedback">
            <label>新密碼</label>
            <Field name="newPassword" type="password" placeholder="請輸入您的新密碼"
              className={classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword})}/>
            {
              errors.newPassword && touched.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )
            }
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye-slash"/></a>
            <small className="form-text text-muted">8 字元以內的大寫或小寫</small>
          </div>
          <div className="form-group has-feedback">
            <label>確認新密碼</label>
            <Field name="confirmPassword" type="password" placeholder="請再次輸入您的新密碼"
              className={classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword})}/>
            {
              errors.confirmPassword && touched.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye-slash"/></a>
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

    return (
      <Modal autoFocus={false} show={this.state.isShowModal} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{user ? _('Modify user') : _('New user')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={this.generateInitialValue(user)}
          validate={utils.makeFormikValidator(UserValidator, ['newPassword', 'confirmPassword'])}
          onSubmit={this.onSubmitForm}
        >
          {this.formRender}
        </Formik>
      </Modal>
    );
  }
};
