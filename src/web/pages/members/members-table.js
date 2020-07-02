const classNames = require('classnames');
const {Link} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');

module.exports = class MembersTable extends React.PureComponent {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        sort: PropTypes.string
      }).isRequired,
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
  }

  render() {
    const {params, members, groups, filterHandler, deleteMemberModal} = this.props;

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
    return (
      <div className="col-12 mb-5">
        <table className="table custom-style" style={{tableLayout: 'fixed'}}>
          <thead>
            <tr className="shadow">
              <th className="text-center" style={{width: '20%'}}>{_('User Picture')}</th>
              <th style={{width: '15%'}}>
                <a href="#name" onClick={sort.name.handler}>{_('Name')}</a>
                <i className={sort.name.icon}/>
              </th>
              <th style={{width: '15%'}}>
                <a href="#organization" onClick={sort.organization.handler}>{_('Organization')}</a>
                <i className={sort.organization.icon}/>
              </th>
              <th style={{width: '15%'}}>
                <a href="#group" onClick={sort.group.handler}>{_('Group')}</a>
                <i className={sort.group.icon}/>
              </th>
              <th style={{width: '20%'}}>{_('Note')}</th>
              <th style={{width: '15%'}}>{_('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {
              members.items.map((member, index) => {
                const tdClass = classNames({'border-bottom':
                index >= members.items.length - 1});

                return (
                  <tr key={member.id}>
                    <td className={classNames('text-center', tdClass)}>
                      <img className="rounded-circle" style={{height: '56px'}}
                        src={`data:image/jpeg;base64,${member.pictures[0]}`}/>
                    </td>
                    <td className={tdClass}>
                      <CustomTooltip title={member.name}>
                        <span>
                          {member.name}
                        </span>
                      </CustomTooltip>
                    </td>
                    <td className={tdClass}>
                      <CustomTooltip title={member.organization}>
                        <span>
                          {member.organization || _('N/A')}
                        </span>
                      </CustomTooltip>
                    </td>
                    <td className={tdClass}>{(groups.items.find(x => x.id === member.groupId) || {}).name || _('N/A')}</td>
                    <td className={tdClass}>
                      <CustomTooltip title={member.note}>
                        <span>
                          {member.note || _('N/A')}
                        </span>
                      </CustomTooltip>
                    </td>
                    <td className={classNames('text-left group-btn', tdClass)}>
                      <Link className="btn btn-link" to={{name: 'web.users.members.details', params: {...params, memberId: member.id}}}>
                        <i className="fas fa-pen fa-lg fa-fw"/>
                      </Link>
                      <button className="btn btn-link" type="button"
                        onClick={deleteMemberModal(member)}
                      >
                        <i className="far fa-trash-alt fa-lg fa-fw"/>
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
};