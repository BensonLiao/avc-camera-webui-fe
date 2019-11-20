const classNames = require('classnames');
const progress = require('nprogress');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserSchema = require('webserver-form-schema/user-schema');
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
        permission: user.permission,
        account: user.account,
        birthday: user.birthday
      };
    }

    return {
      permission: 1,
      account: '',
      birthday: ''
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
              <select className="form-control border-0">
                <option>管理者</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>帳號</label>
            {/* <input type="text" className="form-control" placeholder="請輸入您的帳號"/>
            <small className="form-text text-muted">8 字元以內的大寫或小寫</small> */}
            <Field name="account" type="text" placeholder={_('Please enter your account.')}
              maxLength={UserSchema.account.max}
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}/>
            {
              errors.account && touched.account && (
                <div className="invalid-feedback">{errors.account}</div>
              )
            }
            <small className="form-text text-muted">{_('Letters within 8 characters.')}</small>
          </div>
          <div className="form-group has-feedback">
            <label>生日</label>
            <input type="password" className="form-control" placeholder="請輸入您的西元出生年月日"/>
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye"/></a>
            <small className="form-text text-muted">Ex:19910326，此欄位是為了讓您忘記密碼可使用來重設密碼</small>
          </div>
          <div className="form-group has-feedback">
            <label>舊密碼</label>
            <input type="text" className="form-control" placeholder="請輸入您的密碼"/>
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye-slash"/></a>
          </div>
          <div className="form-group has-feedback">
            <label>密碼</label>
            <input type="text" className="form-control" placeholder="請輸入您的密碼"/>
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye-slash"/></a>
            <small className="form-text text-muted">8 字元以內的大寫或小寫</small>
          </div>
          <div className="form-group has-feedback">
            <label>確認密碼</label>
            <input type="password" className="form-control" placeholder="請再次輸入您的密碼"/>
            <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye"/></a>
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
          validate={utils.makeFormikValidator(UserValidator)}
          onSubmit={this.onSubmitForm}
        >
          {this.formRender}
        </Formik>
      </Modal>
    );
  }
};
