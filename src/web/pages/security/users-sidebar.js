import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Link} from '@benson.liao/capybara-router';
import React from 'react';
import i18n from '../../../i18n';
import utils from '../../../core/utils';
import ErrorDisplay from '../../../core/components/error-display';
import iconUser from '../../../resource/user-24px.svg';
import iconUsers from '../../../resource/users-24px.svg';
import iconUserShield from '../../../resource/user-shield-24px.svg';
import UserPermission from 'webserver-form-schema/constants/user-permission';

const UsersLeftMenu = ({permissionFilter, setPermissionFilter}) => {
  const generateChangePermissionFilterHandler = permission => event => {
    event.preventDefault();
    setPermissionFilter(permission);
  };

  return (
    <div className="left-menu fixed-top sub shadow-sm">
      <h2>{i18n.t('userManagement.accounts.title')}</h2>
      <nav className="nav flex-column">
        <Link
          to="/users/accounts"
          title={i18n.t('userManagement.accounts.allAccounts')}
          className={classNames('nav-link text-size-16 py-1 px-3 users-nav',
            {active: permissionFilter === 'all'},
            {'bg-light': permissionFilter === 'all'}
          )}
        >
          <img className="pl-2 pr-4" src={iconUsers}/>{i18n.t('userManagement.accounts.allAccounts')}
        </Link>
      </nav>
      <hr/>
      <div className="groups">
        <div className="sub-title py-1 px-4">
          <h3>{i18n.t('userManagement.accounts.permission')}</h3>
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
              <span className="text-truncate text-size-14 pl-4">
                {utils.getAccountPermissonI18N(type, <ErrorDisplay/>)}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

UsersLeftMenu.propTypes = {
  permissionFilter: PropTypes.string.isRequired,
  setPermissionFilter: PropTypes.func.isRequired
};

export default UsersLeftMenu;
