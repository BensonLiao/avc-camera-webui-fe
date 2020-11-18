import classNames from 'classnames';
import PropTypes from 'prop-types';
import progress from 'nprogress';
import React, {useState} from 'react';
import {RouterView, Link, getRouter} from 'capybara-router';
import UserPermission from 'webserver-form-schema/constants/user-permission';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';

const UsersMainContent = ({isAddUserDisabled, users, params}) => {
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
        onHide={() => setIsShowDeleteUserModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

UsersMainContent.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    permission: PropTypes.string.isRequired,
    account: PropTypes.string.isRequired
  })).isRequired,
  isAddUserDisabled: PropTypes.bool.isRequired,
  params: PropTypes.shape({})
};

export default UsersMainContent;
