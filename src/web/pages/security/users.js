const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const iconUsers = require('../../../resource/users-24px.svg');
const iconUser = require('../../../resource/user-24px.svg');
const iconUserShield = require('../../../resource/user-shield-24px.svg');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const {SECURITY_USERS_MAX} = require('../../../core/constants');

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
    this.state.permissionFilter = 'all';
  }

  generateChangePermissionFilterHandler = permission => {
    return event => {
      event.preventDefault();
      this.setState({permissionFilter: permission});
    };
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
    const {permissionFilter} = this.state;
    const users = permissionFilter === 'all' ?
      this.props.users.items :
      this.props.users.items.filter(user => user.permission.toString() === permissionFilter);
    const isDeleteUserDisabled = users.filter(
      user => user.permission.toString() === UserPermission.root
    ).length <= 1;
    const isAddUserDisabled = users.length >= SECURITY_USERS_MAX;
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top sub">
          <h2>{_('Accounts')}</h2>
          <nav className="nav flex-column">
            <Link to="/users/account" title={_('All accounts')}
              className={classNames('nav-link text-size-16 py-1 px-3',
                {active: permissionFilter === 'all'},
                {'bg-light': permissionFilter === 'all'}
              )}
            >
              <img className="pl-2 pr-4" src={iconUsers}/>{_('All accounts')}
            </Link>
          </nav>
          <hr/>
          <div className="groups">
            <div className="sub-title py-1 px-4">
              <h3>{_('Permission')}</h3>
            </div>

            <div
              className={classNames(
                'group-item d-flex justify-content-between align-items-center',
                {active: permissionFilter === UserPermission.root},
                {'bg-light': permissionFilter === UserPermission.root}
              )}
            >
              <a className="w-100 text-truncate d-flex align-items-center" href={`#${UserPermission.root}`} onClick={this.generateChangePermissionFilterHandler(UserPermission.root)}>
                <img src={iconUserShield}/>
                <span className="text-truncate text-size-14 pl-4">{_(`permission-${UserPermission.root}`)}</span>
              </a>
            </div>
            <div
              className={classNames(
                'group-item d-flex justify-content-between align-items-center',
                {active: permissionFilter === UserPermission.guest},
                {'bg-light': permissionFilter === UserPermission.guest}
              )}
            >
              <a className="w-100 text-truncate d-flex align-items-center" href={`#${UserPermission.guest}`} onClick={this.generateChangePermissionFilterHandler(UserPermission.guest)}>
                <img src={iconUser}/>
                <span className="text-truncate text-size-14 pl-4">{_(`permission-${UserPermission.guest}`)}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content left-menu-active">
          <div className="page-security bg-white">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 text-right mr-32px mb-4">
                  <Link
                    to={{name: 'web.users.account.new-user', params: this.props.params}}
                    tabIndex={(isAddUserDisabled ? -1 : null)}
                    className={classNames(
                      'btn btn-outline-primary rounded-pill px-3',
                      {disabled: isAddUserDisabled}
                    )}
                  >
                    <i className="fas fa-plus fa-fw"/> {_('New')}
                  </Link>
                </div>

                <div className="col-12">
                  <table className="table custom-style">
                    <thead>
                      <tr className="shadow">
                        <th style={{width: '33%'}}>{_('Permission')}</th>
                        <th style={{width: '34%'}}>{_('Account')}</th>
                        <th style={{width: '33%'}}>{_('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        users.map((user, index) => {
                          const tdClass = classNames({'border-bottom': index >= users.length - 1});
                          return (
                            <tr key={user.id}>
                              <td className={tdClass}>
                                <span className={classNames('badge badge-pill text-size-16 px-3', Number(user.permission) ? 'badge-guest' : 'badge-admin')}>
                                  {_(`permission-${user.permission}`)}
                                </span>
                              </td>
                              <td className={tdClass}>{user.account}</td>
                              <td className={classNames('text-left group-btn', tdClass)}>
                                <Link className="btn btn-link" to={{name: 'web.users.account.details', params: {...this.props.params, userId: user.id}}}>
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
      </>
    );
  }
};
