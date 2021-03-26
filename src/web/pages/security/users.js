import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {RouterView, Link} from '@benson.liao/capybara-router';
import i18n from '../../../i18n';
import {getPaginatedData} from '../../../core/utils';
import {ITEMS_PER_PAGE} from '../../../core/constants';
import Pagination from '../../../core/components/pagination';
import {SECURITY_USERS_MAX} from '../../../core/constants';
import withGlobalStatus from '../../withGlobalStatus';
import UsersSidebar from './users-sidebar';
import UsersTable from './users-table';

const Users = ({users: {items: users}}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');
  const isAddUserDisabled = users.length >= SECURITY_USERS_MAX;
  const [pageNumber, setPageNumber] = useState(0);
  /**
   * Generate paginated list of users
   * @param {Array}   users  - Array of devices to paginate
   * @returns {Array}
   */
  const generatePaginatedUserList = users => {
    return getPaginatedData(users.map(device => device), ITEMS_PER_PAGE);
  };

  const paginatedUsersList = generatePaginatedUserList(users);
  return (
    <>
      <UsersSidebar
        setPermissionFilter={setPermissionFilter}
        permissionFilter={permissionFilter}
      />
      <div className="main-content left-menu-active sub">
        <div className="page-users bg-white">
          <div className="w-100 px-32px py-12px">
            <div className="text-right">
              <Link
                to={{name: 'web.users.accounts.new-user'}}
                tabIndex={(isAddUserDisabled ? -1 : null)}
                className={classNames(
                  'btn btn-outline-primary rounded-pill px-3',
                  {disabled: isAddUserDisabled}
                )}
              >
                <i className="fas fa-plus fa-fw"/> {i18n.t('common.button.new')}
              </Link>
            </div>
            <div
              className="horizontal-border"
              style={{
                width: 'calc(100% + 4rem)',
                marginLeft: '-2rem'
              }}
            />
            <UsersTable
              users={paginatedUsersList[pageNumber]}
              permissionFilter={permissionFilter}
            />
            <Pagination
              name="page"
              index={pageNumber}
              size={ITEMS_PER_PAGE}
              total={users.length}
              currentPageItemQuantity={paginatedUsersList[pageNumber]?.length ?? 0}
              hrefTemplate=""
              setPageIndexState={setPageNumber}
            />
          </div>
          <RouterView/>
        </div>
      </div>

    </>
  );
};

Users.propTypes = {users: PropTypes.shape(UsersTable.propTypes.users).isRequired};

export default withGlobalStatus(Users);
