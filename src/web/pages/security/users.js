/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import UsersSidebar from './users-sidebar';
import UsersMainContent from './users-main-content';
import withGlobalStatus from '../../withGlobalStatus';

const Users = ({users: usersProp}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');
  return (
    <>
      <UsersSidebar
        setPermissionFilter={setPermissionFilter}
        permissionFilter={permissionFilter}
      />
      <UsersMainContent
        usersProp={usersProp}
        permissionFilter={permissionFilter}
      />
    </>
  );
};

Users.propTypes = {users: PropTypes.shape({items: UsersMainContent.propTypes.users}).isRequired};

export default withGlobalStatus(Users);
