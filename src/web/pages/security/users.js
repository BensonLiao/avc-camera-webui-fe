import PropTypes from 'prop-types';
import React, {useState} from 'react';
import UsersSidebar from './users-sidebar';
import UsersTable from './users-table';
import withGlobalStatus from '../../withGlobalStatus';

const Users = ({users}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');
  return (
    <>
      <UsersSidebar
        setPermissionFilter={setPermissionFilter}
        permissionFilter={permissionFilter}
      />
      <UsersTable
        users={users}
        permissionFilter={permissionFilter}
      />
    </>
  );
};

Users.propTypes = {users: PropTypes.shape(UsersTable.propTypes.users).isRequired};

export default withGlobalStatus(Users);
