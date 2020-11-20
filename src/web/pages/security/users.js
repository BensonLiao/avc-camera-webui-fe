import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {RouterView, Link} from 'capybara-router';
import i18n from '../../../i18n';
import {SECURITY_USERS_MAX} from '../../../core/constants';
import withGlobalStatus from '../../withGlobalStatus';
import UsersSidebar from './users-sidebar';
import UsersTable from './users-table';

const Users = ({users}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');
  const isAddUserDisabled = users.total >= SECURITY_USERS_MAX;
  return (
    <>
      <UsersSidebar
        setPermissionFilter={setPermissionFilter}
        permissionFilter={permissionFilter}
      />
      <div className="main-content left-menu-active sub">
        <div className="page-users bg-white">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 text-right mr-32px mb-4">
                <Link
                  to={{name: 'web.users.accounts.new-user'}}
                  tabIndex={(isAddUserDisabled ? -1 : null)}
                  className={classNames(
                    'btn btn-outline-primary rounded-pill px-3',
                    {disabled: isAddUserDisabled}
                  )}
                >
                  <i className="fas fa-plus fa-fw"/> {i18n.t('New')}
                </Link>
              </div>
              <UsersTable
                users={users}
                permissionFilter={permissionFilter}
              />
            </div>
          </div>
          <RouterView/>
        </div>
      </div>

    </>
  );
};

Users.propTypes = {users: PropTypes.shape(UsersTable.propTypes.users).isRequired};

export default withGlobalStatus(Users);
