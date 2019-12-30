const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Users extends Base {
  static get propTypes() {
    return {
      users: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          permission: PropTypes.number.isRequired,
          account: PropTypes.string.isRequired
        })).isRequired
      }).isRequired
    };
  }

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
    const isDeleteUserDisabled = users.filter(
      user => user.permission.toString() === UserPermission.root
    ).length <= 1;
    return (
      <div className="main-content left-menu-active">
        <div className="page-security bg-white">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/security/account">{_('Security')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Account settings')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-12 actions">
                <Link className="btn btn-outline-primary rounded-pill px-3"
                  to={{name: 'web.security.users.new-user', params: this.props.params}}
                >
                  <i className="fas fa-plus fa-fw"/> {_('New user')}
                </Link>
              </div>

              <div className="col-12">
                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th>#</th>
                      <th>{_('Permission')}</th>
                      <th>{_('Account')}</th>
                      <th style={{width: '150px'}}>{_('Actions')}</th>
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
                              <button
                                disabled={isDeleteUserDisabled &&
                                  user.permission.toString() === UserPermission.root}
                                className="btn btn-link"
                                type="button"
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
              <h5 className="modal-title">{_('Delete account')}</h5>
            </div>
            <div className="modal-body">
              <span className="text-muted">
                {_('Are you sure to delete account {0}?', [this.state.deleteUserTarget && this.state.deleteUserTarget.account])}
              </span>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-danger btn-block rounded-pill" onClick={this.confirmDeleteUser}>{_('Delete')}</button>
              </div>
              <button disabled={this.state.$isApiProcessing} type="button" className="btn btn-secondary btn-block m-0 rounded-pill" onClick={this.hideDeleteUserModal}>{_('Close')}</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
};
