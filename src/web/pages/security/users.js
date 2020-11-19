import PropTypes from 'prop-types';
import React, {useState} from 'react';
import UsersSidebar from './users-sidebar';
import UsersMainContent from './users-main-content';
import withGlobalStatus from '../../withGlobalStatus';

const Users = ({users}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');
  return (
    <>
      <UsersSidebar
        setPermissionFilter={setPermissionFilter}
        permissionFilter={permissionFilter}
      />
      <UsersMainContent
        users={users}
        permissionFilter={permissionFilter}
      />
    </>
  );
};

Users.propTypes = {users: PropTypes.shape(UsersMainContent.propTypes.users).isRequired};

export default withGlobalStatus(Users);
