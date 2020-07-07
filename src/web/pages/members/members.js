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
const MembersTable = require('./members-table');

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

    return (
      <>
        {/* Left menu */}
        <MembersSidebar
          isApiProcessing={$isApiProcessing}
          params={params}
          groups={groups}
          filterHandler={this.generateChangeFilterHandler}
          deleteGroupHandler={this.generateShowDeleteGroupModalHandler}
        />
        {/* Main content */}
        <div className="main-content left-menu-active sub">
          <div className="page-users bg-white">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                  <MembersSearchForm
                    isApiProcessing={$isApiProcessing}
                    currentRouteName={this.currentRoute.name}
                    params={params}
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
                      <CustomTooltip title={_(`Edit ${selectedGroup.name}`)}>
                        <Link className="ml-32px" to={{name: 'web.users.members.modify-group', params: params}}>
                          <i className="fas fa-pen fa-fw"/>
                        </Link>
                      </CustomTooltip>
                    </div>
                  )
                }
                <MembersTable
                  params={params}
                  members={members}
                  groups={groups}
                  filterHandler={this.generateChangeFilterHandler}
                  deleteMemberModal={this.generateShowDeleteMemberModalHandler}
                />
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
