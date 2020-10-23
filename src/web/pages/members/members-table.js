import {Link} from 'capybara-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../i18n';

const MembersTable = ({params, members, groups, filterHandler, deleteMemberModal}) => {
  const sort = {
    name: {
      handler: filterHandler(
        'sort',
        (params.sort || 'name') === 'name' ? '-name' : null
      ),
      icon: classNames({
        'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-name',
        'fas fa-fw text-muted ml-3 fa-caret-up': (params.sort || 'name') === 'name'
      })
    },
    organization: {
      handler: filterHandler(
        'sort',
        params.sort === 'organization' ? '-organization' : 'organization'
      ),
      icon: classNames({
        'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-organization',
        'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'organization'
      })
    },
    group: {
      handler: filterHandler(
        'sort',
        params.sort === 'group' ? '-group' : 'group'
      ),
      icon: classNames({
        'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-group',
        'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'group'
      })
    }
  };

  const tableItems = title => (
    <td>
      <CustomTooltip placement="top-start" title={title}>
        <div>
          {title}
        </div>
      </CustomTooltip>
    </td>
  );

  return (
    <div className="col-12 mb-5 table-responsive">
      <table className="table custom-style">
        <thead>
          <tr className="shadow">
            <th className="text-center" style={{width: '20%'}}>{i18n.t('User Picture')}</th>
            <th style={{width: '15%'}}>
              <a href="#name" onClick={sort.name.handler}>{i18n.t('Name')}</a>
              <i className={sort.name.icon}/>
            </th>
            <th style={{width: '15%'}}>
              <a href="#organization" onClick={sort.organization.handler}>{i18n.t('Organization')}</a>
              <i className={sort.organization.icon}/>
            </th>
            <th style={{width: '15%'}}>
              <a href="#group" onClick={sort.group.handler}>{i18n.t('Group')}</a>
              <i className={sort.group.icon}/>
            </th>
            <th style={{width: '20%'}}>{i18n.t('Note')}</th>
            <th style={{width: '15%'}}>{i18n.t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {
            /* Empty Search Message */
            !members.items.length && (
              <tr>
                <td className="text-size-20 text-center" colSpan="10">
                  <i className="fas fa-frown-open fa-fw text-dark"/> {i18n.t('Can\'t find any data.')}
                </td>
              </tr>
            )
          }
          {
            members.items.map(member => {
              return (
                <tr key={member.id}>
                  <td className="text-center">
                    <div className="thumbnail-wrapper">
                      <div className="rounded-circle overflow-hidden circle-crop">
                        <div className="thumbnail" style={{backgroundImage: `url('data:image/jpeg;base64,${member.pictures[0]}')`}}/>
                      </div>
                    </div>
                  </td>
                  {tableItems(member.name)}
                  {tableItems(member.organization)}
                  {tableItems((groups.items.find(x => x.id === member.groupId) || {}).name || '')}
                  {tableItems(member.note)}
                  <td className="text-left group-btn">
                    <CustomTooltip title={i18n.t('Edit Member: {{0}}', {0: member.name})}>
                      <Link
                        className="btn btn-link"
                        to={{
                          name: 'web.users.members.details',
                          params: {
                            ...params,
                            memberId: member.id
                          }
                        }}
                      >
                        <i className="fas fa-pen fa-lg fa-fw"/>
                      </Link>
                    </CustomTooltip>
                    <CustomTooltip title={i18n.t('Delete Member: {{0}}', {0: member.name})}>
                      <button
                        className="btn btn-link"
                        type="button"
                        onClick={deleteMemberModal(member)}
                      >
                        <i className="far fa-trash-alt fa-lg fa-fw"/>
                      </button>
                    </CustomTooltip>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

MembersTable.propTypes = {
  params: PropTypes.shape({sort: PropTypes.string}).isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string
    }).isRequired).isRequired
  }).isRequired,
  members: PropTypes.shape({
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      organization: PropTypes.string,
      groupId: PropTypes.string,
      note: PropTypes.string,
      pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    }).isRequired).isRequired
  }).isRequired,
  filterHandler: PropTypes.func.isRequired,
  deleteMemberModal: PropTypes.func.isRequired
};

export default MembersTable;
