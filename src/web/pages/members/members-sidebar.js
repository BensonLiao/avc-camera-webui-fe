import classNames from 'classnames';
import {Link} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import CustomTooltip from '../../../core/components/tooltip';
import {MEMBER_PAGES} from '../../../core/constants';
import {MEMBERS_PAGE_GROUPS_MAX} from '../../../core/constants';

const MembersSidebar = ({params, groups, filterHandler, deleteGroupHandler, setTab, tab}) => {
  const isAddGroupDisabled = groups.items.length >= MEMBERS_PAGE_GROUPS_MAX;
  const switchTab = tab => e => {
    e.preventDefault();
    setTab(tab);
  };

  return (
    <>
      <div className="left-menu fixed-top sub shadow-sm">
        <h2>{i18n.t('userManagement.members.title')}</h2>
        <nav className="nav flex-column">
          <Link
            to="/users/members"
            title={i18n.t('userManagement.members.allMembers')}
            className={classNames('nav-link text-size-16 py-1 px-3 users-nav',
              {active: !params.group && tab === MEMBER_PAGES.MEMBERS},
              {'bg-light': !params.group && tab === MEMBER_PAGES.MEMBERS}
            )}
          >
            <i className="fas fa-user-friends pl-2 pr-4"/>{i18n.t('userManagement.members.allMembers')}
          </Link>
        </nav>
        <hr/>
        <div className="groups">
          <div className="sub-title py-1 px-4">
            <h3>{i18n.t('userManagement.members.groups')}</h3>
            <CustomTooltip
              title={isAddGroupDisabled ?
                i18n.t('userManagement.members.tooltip.groupLimitExceeded') :
                i18n.t('userManagement.members.tooltip.createGroup')}
            >
              <span>
                <Link
                  to={{
                    name: 'web.users.members.new-group',
                    params: params
                  }}
                  tabIndex={(isAddGroupDisabled ? -1 : null)}
                  className={classNames('btn btn-link text-info p-0', {disabled: isAddGroupDisabled})}
                >
                  <i className="fas fa-plus text-size-16"/>
                </Link>
              </span>
            </CustomTooltip>
          </div>
          {
            groups.items.map(group => (
              <div
                key={group.id}
                className={classNames(
                  'group-item d-flex justify-content-between align-items-center',
                  {active: params.group === group.id},
                  {'bg-light': params.group === group.id}
                )}
              >
                <a
                  className="w-100 text-truncate d-flex align-items-center"
                  href={`#${group.id}`}
                  onClick={filterHandler('group', group.id)}
                >
                  <i className="far fa-folder text-size-20"/>
                  <span className="text-truncate text-size-14 pl-3">{group.name}</span>
                </a>
                <CustomTooltip title={i18n.t('userManagement.members.tooltip.deleteGroupWithName', {0: group.name})}>
                  <button
                    className="btn btn-link btn-delete text-info"
                    type="button"
                    onClick={deleteGroupHandler(group)}
                  >
                    <i className="far fa-trash-alt fa-fw text-size-20"/>
                  </button>
                </CustomTooltip>
              </div>
            ))
          }
          <hr/>
          <div className="sub-title py-3 px-4">
            <h3>{i18n.t('userManagement.members.database')}</h3>
          </div>
          <nav className="nav flex-column">
            <a
              href=""
              className={classNames('nav-link text-size-14 py-2 px-3 users-nav',
                {active: tab === MEMBER_PAGES.DATABASE},
                {'bg-light': tab === MEMBER_PAGES.DATABASE}
              )}
              onClick={switchTab(MEMBER_PAGES.DATABASE)}
            >
              <i className="fas fa-cog pl-2 pr-4"/>
              {i18n.t('userManagement.members.databaseSettings')}
            </a>
            <a
              href=""
              className={classNames('nav-link text-size-14 py-2 px-3 users-nav',
                {active: tab === MEMBER_PAGES.SYNC},
                {'bg-light': tab === MEMBER_PAGES.SYNC}
              )}
              onClick={switchTab(MEMBER_PAGES.SYNC)}
            >
              <div className="sidebar-database">
                <i className="fas fa-database pl-2 pr-4"/>
                <i className="fas fa-sync"/>
              </div>
              {i18n.t('userManagement.members.deviceSynchronization')}
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

MembersSidebar.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  deleteGroupHandler: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
  params: PropTypes.shape({group: PropTypes.string}).isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string
    }).isRequired).isRequired
  }).isRequired
};

export default MembersSidebar;
