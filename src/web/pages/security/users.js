/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import progress from 'nprogress';
import {RouterView, Link, getRouter} from 'capybara-router';
import iconUsers from '../../../resource/users-24px.svg';
import iconUser from '../../../resource/user-24px.svg';
import iconUserShield from '../../../resource/user-shield-24px.svg';
import UserPermission from 'webserver-form-schema/constants/user-permission';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import {SECURITY_USERS_MAX} from '../../../core/constants';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Users = ({users: usersProp, params}) => {
  const {isApiProcessing, user: {account}} = useContextState();

  const [state, setState] = useState({
    isShowDeleteUserModal: false,
    deleteUserTarget: null,
    permissionFilter: 'all'
  });

  const {permissionFilter, isShowDeleteUserModal, deleteUserTarget} = state;
  // superAdmin is the same as admin, viewer is the same as guest
  const users = permissionFilter === 'all' ?
    usersProp.items :
    usersProp.items.filter(user => permissionFilter === UserPermission.root ?
      user.permission.toString() === UserPermission.root || user.permission.toString() === UserPermission.superAdmin :
      user.permission.toString() === permissionFilter || user.permission.toString() === UserPermission.viewer);
  const isAddUserDisabled = users.length >= SECURITY_USERS_MAX;

  const generateChangePermissionFilterHandler = permission => {
    return event => {
      event.preventDefault();
      setState(prevState => ({
        ...prevState,
        permissionFilter: permission
      }));
    };
  };

  const generateShowDeleteUserModalHandler = user => {
    return event => {
      event.preventDefault();
      setState(prevState => ({
        ...prevState,
        isShowDeleteUserModal: true,
        deleteUserTarget: user
      }));
    };
  };

  const confirmDeleteUser = event => {
    event.preventDefault();
    progress.start();
    api.user.deleteUser(deleteUserTarget.id)
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        hideDeleteUserModal();
      });
  };

  const hideDeleteUserModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowDeleteUserModal: false
    }));
  };

  return (
    <>
      {/* Left menu */}
      <div className="left-menu fixed-top sub">
        <h2>{i18n.t('Accounts')}</h2>
        <nav className="nav flex-column">
          <Link
            to="/users/accounts"
            title={i18n.t('All Accounts')}
            className={classNames('nav-link text-size-16 py-1 px-3 users-nav',
              {active: permissionFilter === 'all'},
              {'bg-light': permissionFilter === 'all'}
            )}
          >
            <img className="pl-2 pr-4" src={iconUsers}/>{i18n.t('All Accounts')}
          </Link>
        </nav>
        <hr/>
        <div className="groups">
          <div className="sub-title py-1 px-4">
            <h3>{i18n.t('Permission')}</h3>
          </div>
          {[UserPermission.root, UserPermission.guest].map(type => (
            <div
              key={type}
              className={classNames(
                'group-item d-flex justify-content-between align-items-center',
                {active: permissionFilter === type},
                {'bg-light': permissionFilter === type}
              )}
            >
              <a
                className="w-100 text-truncate d-flex align-items-center"
                href={`#${type}`}
                onClick={generateChangePermissionFilterHandler(type)}
              >
                <img src={type === UserPermission.root ? iconUserShield : iconUser}/>
                <span className="text-truncate text-size-14 pl-4">{i18n.t(`permission-${type}`)}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content left-menu-active sub">
        <div className="page-users bg-white">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 text-right mr-32px mb-4">
                <Link
                  to={{
                    name: 'web.users.accounts.new-user',
                    params: params
                  }}
                  tabIndex={(isAddUserDisabled ? -1 : null)}
                  className={classNames(
                    'btn btn-outline-primary rounded-pill px-3',
                    {disabled: isAddUserDisabled}
                  )}
                >
                  <i className="fas fa-plus fa-fw"/> {i18n.t('New')}
                </Link>
              </div>

              <div className="col-12">
                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th style={{width: '33%'}}>{i18n.t('Permission')}</th>
                      <th style={{width: '34%'}}>{i18n.t('Username')}</th>
                      <th style={{width: '33%'}}>{i18n.t('Actions')}</th>
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
                              <span
                                className={classNames(
                                  'badge badge-pill text-size-16 px-3',
                                  (user.permission === UserPermission.root || isSuperAdmin) ? 'badge-admin' : 'badge-guest'
                                )}
                              >
                                {i18n.t(`permission-${user.permission}`)}
                              </span>
                            </td>
                            <td className={tdClass}>{user.account}</td>
                            <td className={classNames('text-left group-btn', tdClass)}>
                              <Link
                                className="btn btn-link"
                                to={{
                                  name: 'web.users.accounts.details',
                                  params: {
                                    ...params,
                                    userId: user.id
                                  }
                                }}
                              >
                                <i className="fas fa-pen fa-lg fa-fw"/>
                              </Link>
                              { !isSuperAdmin && (
                                <CustomTooltip
                                  show={user.account === account}
                                  title={i18n.t('This account cannot be deleted because it is currently logged in to the device.')}
                                >
                                  <span>
                                    <button
                                      // Super Admin account should not be deleted, due to app restrictions
                                      disabled={user.account === account}
                                      className="btn btn-link"
                                      type="button"
                                      onClick={generateShowDeleteUserModalHandler(user)}
                                    >
                                      <i className="far fa-trash-alt fa-lg fa-fw"/>
                                    </button>
                                  </span>
                                </CustomTooltip>
                              )}
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
          modalTitle={i18n.t('Delete Account')}
          modalBody={i18n.t('Are you sure you want to delete account {{0}}?', {0: deleteUserTarget && deleteUserTarget.account})}
          isConfirmDisable={isApiProcessing}
          onHide={hideDeleteUserModal}
          onConfirm={confirmDeleteUser}
        />
      </div>
    </>
  );
};

Users.propTypes = {
  users: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      permission: PropTypes.string.isRequired,
      account: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

export default withGlobalStatus(Users);
