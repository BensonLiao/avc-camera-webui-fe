const React = require('react');
const classNames = require('classnames');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
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
                      <th style={{width: '150px'}}>操作</th>
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
          <RouterView/>
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
              <span className="text-muted">您即將刪除 {this.state.deleteUserTarget && this.state.deleteUserTarget.account}，確認要刪除這個帳號嗎？</span>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-danger btn-block rounded-pill" onClick={this.confirmDeleteUser}>刪除</button>
              </div>
              <button disabled={this.state.$isApiProcessing} type="button" className="btn btn-secondary btn-block m-0 rounded-pill" onClick={this.hideDeleteUserModal}>關閉</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
};
