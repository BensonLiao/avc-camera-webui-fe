import classNames from 'classnames';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Link, getRouter} from '@benson.liao/capybara-router';
import UserPermission from 'webserver-form-schema/constants/user-permission';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import i18nUtils from '../../../i18n/utils';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import ErrorDisplay from '../../../core/components/error-display';

const UsersTable = ({permissionFilter, users}) => {
  const {isApiProcessing, user: {account}} = useContextState();
  const [isShowDeleteUserModal, setIsShowDeleteUserModal] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const generateShowDeleteUserModalHandler = user => {
    return event => {
      event.preventDefault();
      setIsShowDeleteUserModal(true);
      setDeleteUserTarget(user);
    };
  };

  // superAdmin is the same as admin, viewer is the same as guest
  const usersList = permissionFilter === 'all' ?
    users :
    users.filter(user => permissionFilter === UserPermission.root ?
      user.permission.toString() === UserPermission.root || user.permission.toString() === UserPermission.superAdmin :
      user.permission.toString() === permissionFilter || user.permission.toString() === UserPermission.viewer);

  const confirmDeleteUser = event => {
    event.preventDefault();
    progress.start();
    api.user.deleteUser(deleteUserTarget.id)
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        setIsShowDeleteUserModal(false);
      });
  };

  return (
    <>
      <div className="users-table">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th style={{width: '33%'}}>{i18n.t('userManagement.accounts.permission')}</th>
                <th style={{width: '34%'}}>{i18n.t('userManagement.accounts.username')}</th>
                <th style={{width: '33%'}}>{i18n.t('userManagement.accounts.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {
                usersList.map((user, index) => {
                  const tdClass = classNames({'border-bottom': index >= usersList.length - 1});
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
                          {i18nUtils.getAccountPermissonI18N(user.permission, <ErrorDisplay/>)}
                        </span>
                      </td>
                      <td className={tdClass}>{user.account}</td>
                      <td className={classNames('text-left group-btn', tdClass)}>
                        <Link
                          className="btn btn-link"
                          to={{
                            name: 'web.users.accounts.details',
                            params: {userId: user.id}
                          }}
                        >
                          <i className="fas fa-pen fa-lg fa-fw"/>
                        </Link>
                        { !isSuperAdmin && (
                          <CustomTooltip
                            show={user.account === account}
                            title={i18n.t('userManagement.accounts.tooltip.deleteAccountError1')}
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
      {/* Delete user modal */}
      <CustomNotifyModal
        isShowModal={isShowDeleteUserModal}
        modalTitle={i18n.t('userManagement.accounts.modal.confirmDeleteTitle')}
        modalBody={i18n.t('userManagement.accounts.modal.confirmDeleteBody', {0: deleteUserTarget && deleteUserTarget.account})}
        isConfirmDisable={isApiProcessing}
        onHide={() => setIsShowDeleteUserModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </>
  );
};

UsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    permission: PropTypes.string.isRequired,
    account: PropTypes.string.isRequired
  })).isRequired,
  permissionFilter: PropTypes.string.isRequired
};

export default UsersTable;
