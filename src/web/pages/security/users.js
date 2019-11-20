const React = require('react');
const classNames = require('classnames');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Users extends Base {
  constructor(props) {
    super(props);
    this.state.isShowDeleteUserModal = false;
    this.state.deleteUserTarget = null;
  }

  generateShowDeleteUserModalHandler = user => {
    return event => {
      event.preventDefault();
      this.setState({
        isShowDeleteUserModal: true,
        deleteUserTarget: user
      });
    };
  };

  confirmDeleteUser = event => {
    event.preventDefault();
    progress.start();
    api.user.deleteUser(this.state.deleteUserTarget.id)
      .then(() => {
        this.hideDeleteUserModal();
        getRouter().reload();
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  hideDeleteUserModal = () => {
    this.setState({isShowDeleteUserModal: false});
  };

  render() {
    const users = this.props.users.items;
    console.log('users', users);
    return (
      <div className="main-content left-menu-active">
        <div className="page-security bg-white">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active"><a href="/security/account.html">安全性</a></li>
                    <li className="breadcrumb-item">帳號設定</li>
                  </ol>
                </nav>
              </div>

              <div className="col-12 actions">
                <button type="button" className="btn btn-outline-primary rounded-pill px-3" data-toggle="modal" data-target="#modal-new-account">
                  <i className="fas fa-plus fa-fw"/> 新增帳號
                </button>
              </div>

              <div className="col-12">
                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th>#</th>
                      <th>權限</th>
                      <th>帳號</th>
                      <th className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users.map((user, index) => {
                        const tdClass = classNames({'border-bottom': index >= users.length - 1});
                        return (
                          <tr key={user.id}>
                            <td className={tdClass}>{user.id}</td>
                            <td className={tdClass}>
                              <span className={classNames('badge badge-pill text-size-16 px-3', user.permission ? 'badge-admin' : 'badge-guest')}>
                                {_(`permission-${user.permission}`)}
                              </span>
                            </td>
                            <td className={tdClass}>{user.account}</td>
                            <td className={classNames('text-right', tdClass)}>
                              <Link className="btn btn-link" to={{name: 'web.security.users.details', params: {...this.props.params, userId: user.id}}}>
                                <i className="fas fa-pen fa-lg fa-fw"/>
                              </Link>
                              <button className="btn btn-link" type="button"
                                onClick={this.generateShowDeleteUserModalHandler(user)}
                              >
                                <i className="far fa-trash-alt fa-lg fa-fw"/>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Delete user modal */}
          <Modal
            show={this.state.isShowDeleteUserModal}
            autoFocus={false}
            onHide={this.hideDeleteUserModal}
          >
            <form>
              <div className="modal-header">
                <h5 className="modal-title">刪除帳號</h5>
              </div>
              <div className="modal-body">
                <span className="text-muted">您即將刪除 Guest，確認要刪除這個帳號嗎？</span>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button type="submit" className="btn btn-danger btn-block rounded-pill">刪除</button>
                </div>
                <button type="button" className="btn btn-secondary btn-block m-0 rounded-pill" data-dismiss="modal">關閉</button>
              </div>
            </form>
          </Modal>

          <div className="modal fade" id="modal-new-account" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">新增帳號</h5>
                </div>
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
                    <input type="text" className="form-control" placeholder="請輸入您的帳號"/>
                    <small className="form-text text-muted">8 字元以內的大寫或小寫</small>
                  </div>
                  <div className="form-group has-feedback">
                    <label>生日</label>
                    <input type="password" className="form-control" placeholder="請輸入您的西元出生年月日"/>
                    <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye"/></a>
                    <small className="form-text text-muted">Ex:19910326，此欄位是為了讓您忘記密碼可使用來重設密碼</small>
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
                    <button type="submit" className="btn btn-primary btn-block rounded-pill">新增</button>
                  </div>
                  <button type="button" className="btn btn-secondary btn-block m-0 rounded-pill" data-dismiss="modal">關閉</button>
                </div>
              </form>
            </div>
          </div>

          <div className="modal fade" id="modal-update-account" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">編輯帳號</h5>
                </div>
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
                    <input type="text" className="form-control" placeholder="請輸入您的帳號"/>
                    <small className="form-text text-muted">8 字元以內的大寫或小寫</small>
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
                    <button type="submit" className="btn btn-primary btn-block rounded-pill">確認</button>
                  </div>
                  <button type="button" className="btn btn-secondary btn-block m-0 rounded-pill" data-dismiss="modal">關閉</button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
};
