const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const iconUsers = require('../../../resource/users-24px.svg');
const iconUser = require('../../../resource/user-24px.svg');
const iconUserShield = require('../../../resource/user-shield-24px.svg');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const {SECURITY_USERS_MAX} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
module.exports = class Users extends Base {
  static get propTypes() {
    return {
      users: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          permission: PropTypes.string.isRequired,
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
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        this.hideDeleteUserModal();
      });
  };

  hideDeleteUserModal = () => {
    this.setState({isShowDeleteUserModal: false});
  };

  render() {
    const {permissionFilter, $user: {account}, $isApiProcessing, isShowDeleteUserModal, deleteUserTarget} = this.state;
    const users = permissionFilter === 'all' ?
      this.props.users.items :
      this.props.users.items.filter(user => permissionFilter === UserPermission.root ?
        user.permission.toString() === UserPermission.root || user.permission.toString() === UserPermission.superAdmin :
        user.permission.toString() === permissionFilter);
    const isAddUserDisabled = users.length >= SECURITY_USERS_MAX;
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top sub">
          <h2>{_('Accounts')}</h2>
          <nav className="nav flex-column">
            <Link to="/users/accounts" title={_('All Accounts')}
              className={classNames('nav-link text-size-16 py-1 px-3 users-nav',
                {active: permissionFilter === 'all'},
                {'bg-light': permissionFilter === 'all'}
              )}
            >
              <img className="pl-2 pr-4" src={iconUsers}/>{_('All Accounts')}
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
                    to={{name: 'web.users.accounts.new-user', params: this.props.params}}
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
                        <th style={{width: '34%'}}>{_('Username')}</th>
                        <th style={{width: '33%'}}>{_('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        users.map((user, index) => {
                          const tdClass = classNames({'border-bottom': index >= users.length - 1});
                          const isSuperAdmin = user.permission === UserPermission.superAdmin;
                          return (
                            <tr key={user.id}>
                              <td className={tdClass}>
                                <span className={classNames('badge badge-pill text-size-16 px-3', (user.permission === UserPermission.root || isSuperAdmin) ? 'badge-admin' : 'badge-guest')}>
                                  {_(`permission-${user.permission}`)}
                                </span>
                              </td>
                              <td className={tdClass}>{user.account}</td>
                              <td className={classNames('text-left group-btn', tdClass)}>
                                <Link className="btn btn-link" to={{name: 'web.users.accounts.details', params: {...this.props.params, userId: user.id}}}>
                                  <i className="fas fa-pen fa-lg fa-fw"/>
                                </Link>
                                { !isSuperAdmin &&
                                  <CustomTooltip
                                    show={user.account === account}
                                    title={_('Cannot Delete Account That is Currently Logged In')}
                                  >
                                    <span>
                                      <button
                                        // Super Admin account should not be deleted, due to app restrictions
                                        disabled={user.account === account}
                                        className="btn btn-link"
                                        type="button"
                                        onClick={this.generateShowDeleteUserModalHandler(user)}
                                      >
                                        <i className="far fa-trash-alt fa-lg fa-fw"/>
                                      </button>
                                    </span>
                                  </CustomTooltip>}
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
          <CustomNotifyModal
            isShowModal={isShowDeleteUserModal}
            modalTitle={_('Delete Account')}
            modalBody={_('Are you sure to delete account {0}?', [deleteUserTarget && deleteUserTarget.account])}
            isConfirmDisable={$isApiProcessing}
            onHide={this.hideDeleteUserModal}
            onConfirm={this.confirmDeleteUser}/>
        </div>
      </>
    );
  }
};
