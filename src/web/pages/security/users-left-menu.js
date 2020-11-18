import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Link} from 'capybara-router';
import React from 'react';
import i18n from '../../../i18n';
import iconUser from '../../../resource/user-24px.svg';
import iconUsers from '../../../resource/users-24px.svg';
import iconUserShield from '../../../resource/user-shield-24px.svg';
import UserPermission from 'webserver-form-schema/constants/user-permission';

const UsersLeftMenu = ({permissionFilter, generateChangePermissionFilterHandler}) => {
  return (
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
  );
};

UsersLeftMenu.propTypes = {
  permissionFilter: PropTypes.string.isRequired,
  generateChangePermissionFilterHandler: PropTypes.func.isRequired
};

export default UsersLeftMenu;
