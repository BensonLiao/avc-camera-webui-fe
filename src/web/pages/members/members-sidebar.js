import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import CustomTooltip from '../../../core/components/tooltip';
import {MEMBERS_PAGE_GROUPS_MAX} from '../../../core/constants';
import MembersDatabase from './members-sidebar-database';
import {Link} from '@benson.liao/capybara-router';

const MembersSidebar = ({isApiProcessing, params, groups, filterHandler, deleteGroupHandler}) => {
  const isAddGroupDisabled = groups.items.length >= MEMBERS_PAGE_GROUPS_MAX;
  return (
    <>
      <div className="left-menu fixed-top sub">
        <h2>{i18n.t('Members')}</h2>
        <nav className="nav flex-column">
          <Link
            to={{name: 'web.users.members'}}
            title={i18n.t('All Members')}
            className={classNames('nav-link text-size-16 py-1 px-3 users-nav',
              {active: !params.group},
              {'bg-light': !params.group}
            )}
          >
            <i className="fas fa-user-friends pl-2 pr-4"/>{i18n.t('All Members')}
          </Link>
        </nav>
        <hr/>
        <div className="groups">
          <div className="sub-title py-1 px-4">
            <h3>{i18n.t('Groups')}</h3>
            <CustomTooltip title={isAddGroupDisabled ? i18n.t('Group number limit exceeded.') : i18n.t('Create a Group')}>
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
                <CustomTooltip title={i18n.t('Delete Group: {{0}}', {0: group.name})}>
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
          <MembersDatabase
            isApiProcessing={isApiProcessing}
          />
        </div>
      </div>
    </>
  );
};

MembersSidebar.propTypes = {
  isApiProcessing: PropTypes.bool.isRequired,
  filterHandler: PropTypes.func.isRequired,
  deleteGroupHandler: PropTypes.func.isRequired,
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
