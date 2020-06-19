const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const iconDescription = require('../../../resource/description-20px.svg');
const Base = require('../shared/base');
const Pagination = require('../../../core/components/pagination');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const CustomTooltip = require('../../../core/components/tooltip');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const MembersSearchForm = require('./members-search-form');
const MembersSidebar = require('./members-sidebar');

module.exports = class Members extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        group: PropTypes.string
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
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.members');
    this.state.deleteGroupTarget = null;
    this.state.selectedGroup = props.groups.items.find(x => x.id === props.params.group);
    this.state.deleteMemberTarget = null;
    this.state.isShowSelectModal = {
      deleteGroup: false,
      deleteMember: false
    };
  }

  showModal = selectedModal => event => {
    event.preventDefault();
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: true
      }
    }));
  };

  hideModal = selectedModal => () => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  memberCardModalRender = mode => {
    const {
      deleteGroupTarget,
      deleteMemberTarget,
      $isApiProcessing,
      isShowSelectModal: {
        [mode]: isShowModal
      }
    } = this.state;
    const modalType = {
      deleteGroup: {
        showModal: isShowModal,
        hideModal: this.hideModal(mode),
        modalOnSubmit: this.confirmDeleteGroup,
        modalTitle: _('Delete Group'),
        modalBody: _('Are you sure you want to delete group {0}?', [deleteGroupTarget && deleteGroupTarget.name])
      },
      deleteMember: {
        showModal: isShowModal,
        hideModal: this.hideModal(mode),
        modalOnSubmit: this.confirmDeleteMember,
        modalTitle: _('Delete Member'),
        modalBody: _('Are you sure you want to delete member {0}?', [deleteMemberTarget && deleteMemberTarget.name])
      }
    };
    return (
      <CustomNotifyModal
        isShowModal={modalType[mode].showModal}
        modalTitle={modalType[mode].modalTitle}
        modalBody={modalType[mode].modalBody}
        isConfirmDisable={$isApiProcessing}
        onHide={modalType[mode].hideModal}
        onConfirm={modalType[mode].modalOnSubmit}/>
    );
  }

  generateShowDeleteGroupModalHandler = group => {
    return event => {
      event.preventDefault();
      this.setState(prevState => ({
        ...prevState,
        isShowSelectModal: {
          ...prevState.isShowSelectModal,
          deleteGroup: true
        },
        deleteGroupTarget: group
      }));
    };
  };

  generateShowDeleteMemberModalHandler = member => {
    return event => {
      event.preventDefault();
      this.setState(prevState => ({
        ...prevState,
        isShowSelectModal: {
          ...prevState.isShowSelectModal,
          deleteMember: true
        },
        deleteMemberTarget: member
      }));
    };
  };

  confirmDeleteMember = event => {
    event.preventDefault();
    progress.start();
    api.member.deleteMember(this.state.deleteMemberTarget.id)
      .then(() => {
        this.hideModal('deleteMember');
        getRouter().reload();
      })
      .finally(progress.done);
  };

  confirmDeleteGroup = event => {
    event.preventDefault();
    progress.start();
    api.group.deleteGroup(this.state.deleteGroupTarget.id)
      .then(() => {
        this.hideModal('deleteGroup');
        if (this.state.deleteGroupTarget.id === this.props.params.group) {
          getRouter().go(
            {
              name: 'web.users.members',
              params: {...this.props.params, group: undefined, index: undefined}
            },
            {reload: true}
          );
        } else {
          getRouter().reload();
        }
      })
      .finally(progress.done);
  };

  /**
   * Generate the handler to change filter.
   * @param {String} paramKey
   * @param {*} value The filter value. Pass null to remove the param.
   * @returns {Function} The handler.
   */
  generateChangeFilterHandler = (paramKey, value) => event => {
    event.preventDefault();
    getRouter().go({
      name: this.currentRoute.name,
      params: {
        ...this.props.params,
        index: undefined,
        [paramKey]: value === undefined ?
          event.target.value :
          (value == null ? undefined : value)
      }
    });
  };

  render() {
    const {groups, members, params} = this.props;
    const {selectedGroup, $isApiProcessing} = this.state;
    const hrefTemplate = getRouter().generateUri(
      this.currentRoute,
      {...params, index: undefined}
    );
    const sort = {
      name: {
        handler: this.generateChangeFilterHandler(
          'sort',
          (params.sort || 'name') === 'name' ? '-name' : null
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-name',
          'fas fa-fw text-muted ml-3 fa-caret-up': (params.sort || 'name') === 'name'
        })
      },
      organization: {
        handler: this.generateChangeFilterHandler(
          'sort',
          params.sort === 'organization' ? '-organization' : 'organization'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-organization',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'organization'
        })
      },
      group: {
        handler: this.generateChangeFilterHandler(
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
      <>
        <MembersSidebar
          isApiProcessing={$isApiProcessing}
          filterHandler={this.generateChangeFilterHandler}
          deleteGroupHandler={this.generateShowDeleteGroupModalHandler}
          params={params}
          groups={groups}
        />

        {/* Main content */}
        <div className="main-content left-menu-active sub">
          <div className="page-users bg-white">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 d-flex justify-content-between align-items-center mb-4">

                  <MembersSearchForm
                    isApiProcessing={$isApiProcessing}
                    params={params}
                    currentRouteName={this.currentRoute.name}
                  />

                  <div className="dropdown">
                    <button className="btn border-primary text-primary rounded-pill dropdown-toggle" type="button" data-toggle="dropdown">
                      <i className="fas fa-plus fa-fw text-primary"/>{_('New')}
                    </button>
                    <div className="dropdown-menu dropdown-menu-right shadow">
                      <Link className="dropdown-item"
                        to={{name: 'web.users.members.new-member', params: params}}
                      >
                        {_('Add a New Member')}
                      </Link>
                      <Link className="dropdown-item" to="/users/events">{_('Add a Member from Events')}</Link>
                    </div>
                  </div>
                </div>

                {
                  selectedGroup && (
                    <div className="col-12 mb-4">
                      <i className="far fa-folder fa-fw fa-lg text-primary"/>
                      <span className="text-size-16 text-muted ml-3">
                        {selectedGroup.name}
                      </span>
                      <img className="ml-32px" src={iconDescription}/>
                      {
                        selectedGroup.note.length > 0 && (
                          <CustomTooltip title={selectedGroup.note}>
                            <div className="text-size-14 text-muted ml-2" style={{display: 'inline-block', lineHeight: 'initial', wordWrap: 'break-word', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '50%'}}>
                              {selectedGroup.note}
                            </div>
                          </CustomTooltip>
                        )
                      }
                      <Link className="ml-32px" to={{name: 'web.users.members.modify-group', params: params}}>
                        <i className="fas fa-pen fa-fw"/>
                      </Link>
                    </div>
                  )
                }

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
                                  onClick={this.generateShowDeleteMemberModalHandler(member)}
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

                <Pagination
                  index={members.index}
                  size={members.size}
                  total={members.total}
                  itemQuantity={members.items.length}
                  hrefTemplate={hrefTemplate.indexOf('?') >= 0 ?
                    `${hrefTemplate}&index={index}` :
                    `${hrefTemplate}?index={index}`}/>
              </div>
            </div>
            <RouterView/>
          </div>
        </div>

        {/* Delete group modal */}
        {this.memberCardModalRender('deleteGroup')}

        {/* Delete member modal */}
        {this.memberCardModalRender('deleteMember')}
      </>
    );
  }
};
