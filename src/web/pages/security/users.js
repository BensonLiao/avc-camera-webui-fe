/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import UserPermission from 'webserver-form-schema/constants/user-permission';
import {SECURITY_USERS_MAX} from '../../../core/constants';
import UsersSidebar from './users-sidebar';
import UsersMainContent from './users-main-content';
import withGlobalStatus from '../../withGlobalStatus';

const Users = ({users: usersProp}) => {
  const [permissionFilter, setPermissionFilter] = useState('all');

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
      setPermissionFilter(permission);
    };
  };

  return (
    <>
      <UsersSidebar
        generateChangePermissionFilterHandler={generateChangePermissionFilterHandler}
        permissionFilter={permissionFilter}
      />
      <UsersMainContent
        users={users}
        isAddUserDisabled={isAddUserDisabled}
      />
    </>
  );
};

Users.propTypes = {users: PropTypes.shape({items: UsersMainContent.propTypes.users}).isRequired};

export default withGlobalStatus(Users);
