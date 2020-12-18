import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import progress from 'nprogress';
import {RouterView, Link, getRouter} from '@benson.liao/capybara-router';
import Pagination from '../../../core/components/pagination';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import CustomTooltip from '../../../core/components/tooltip';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import MembersDatabase from './members-database';
import MembersSearchForm from './members-search-form';
import MembersSidebar from './members-sidebar';
import MembersTable from './members-table';
import MembersSelectedGroup from './members-selectedGroup';
import DeviceSync from './members-deviceSync';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Members = ({groups, members, params, remainingPictureCount, deviceSync}) => {
  const {isApiProcessing} = useContextState();
  const currentRoute = getRouter().findRouteByName('web.users.members');

  const hrefTemplate = currentRoute.generateUri(
    {
      ...params,
      index: undefined
    }
  );

  const [state, setState] = useState({
    deleteGroupTarget: null,
    deleteMemberTarget: null,
    isShowSelectModal: {
      deleteGroup: false,
      deleteMember: false
    }
  });

  // State used to switch pages between 'members', 'database' and 'sync'
  const [page, setPage] = useState('members');

  const {deleteGroupTarget, deleteMemberTarget} = state;
  const isOverPhotoLimit = remainingPictureCount <= 0 && remainingPictureCount !== null;

  const hideModal = selectedModal => () => {
    return setState(prevState => ({
      ...prevState,
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  const memberCardModalRender = mode => {
    const {isShowSelectModal: {[mode]: isShowModal}} = state;

    const modalType = {
      deleteGroup: {
        showModal: isShowModal,
        hideModal: hideModal(mode),
        modalOnSubmit: confirmDeleteGroup,
        modalTitle: i18n.t('userManagement.members.modal.group.confirmDeleteTitle'),
        modalBody: i18n.t('userManagement.members.modal.group.confirmDeleteBody', {0: deleteGroupTarget && deleteGroupTarget.name})
      },
      deleteMember: {
        showModal: isShowModal,
        hideModal: hideModal(mode),
        modalOnSubmit: confirmDeleteMember,
        modalTitle: i18n.t('userManagement.members.modal.member.confirmDeleteTitle'),
        modalBody: i18n.t('userManagement.members.modal.member.confirmDeleteBody', {0: deleteMemberTarget && deleteMemberTarget.name})
      }
    };
    return (
      <CustomNotifyModal
        isShowModal={modalType[mode].showModal}
        modalTitle={modalType[mode].modalTitle}
        modalBody={modalType[mode].modalBody}
        isConfirmDisable={isApiProcessing}
        onHide={modalType[mode].hideModal}
        onConfirm={modalType[mode].modalOnSubmit}
      />
    );
  };

  const generateShowDeleteGroupModalHandler = group => {
    return event => {
      event.preventDefault();
      setState(prevState => ({
        ...prevState,
        isShowSelectModal: {
          ...prevState.isShowSelectModal,
          deleteGroup: true
        },
        deleteGroupTarget: group
      }));
    };
  };

  const generateShowDeleteMemberModalHandler = member => {
    return event => {
      event.preventDefault();
      setState(prevState => ({
        ...prevState,
        isShowSelectModal: {
          ...prevState.isShowSelectModal,
          deleteMember: true
        },
        deleteMemberTarget: member
      }));
    };
  };

  const confirmDeleteMember = event => {
    event.preventDefault();
    progress.start();
    api.member.deleteMember(deleteMemberTarget.id)
      .then(() => {
        hideModal('deleteMember');
        getRouter().reload();
      })
      .finally(progress.done);
  };

  const confirmDeleteGroup = event => {
    event.preventDefault();
    progress.start();
    api.group.deleteGroup(deleteGroupTarget.id)
      .then(() => {
        hideModal('deleteGroup');
        if (deleteGroupTarget.id === params.group) {
          getRouter().go(
            {
              name: 'web.users.members',
              params: {
                ...params,
                group: undefined,
                index: undefined
              }
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
  const generateChangeFilterHandler = (paramKey, value) => event => {
    event.preventDefault();
    getRouter().go({
      name: currentRoute.name,
      params: {
        ...params,
        index: undefined,
        [paramKey]: value === undefined ?
          event.target.value :
          (value == null ? undefined : value)
      }
    });
  };

  return (
    <>
      {/* Left menu */}
      <MembersSidebar
        params={params}
        groups={groups}
        page={page}
        filterHandler={generateChangeFilterHandler}
        deleteGroupHandler={generateShowDeleteGroupModalHandler}
        setPage={setPage}
      />
      {/* Main content */}
      <div className="main-content left-menu-active sub">
        <div className={classNames('page-members', page === 'database' ? 'bg-color' : 'bg-white')}>
          <div className="container-fluid">
            <div className="row">
              { page === 'members' && (
                <>
                  <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                    <MembersSearchForm
                      isApiProcessing={isApiProcessing}
                      currentRouteName={currentRoute.name}
                      params={params}
                    />
                    <CustomTooltip show={isOverPhotoLimit} title={i18n.t('userManagement.members.tooltip.photoLimitExceeded')}>
                      <div className="dropdown">
                        <button
                          className="btn border-primary text-primary rounded-pill dropdown-toggle"
                          type="button"
                          disabled={isOverPhotoLimit}
                          style={isOverPhotoLimit ? {pointerEvents: 'none'} : {}}
                          data-toggle="dropdown"
                        >
                          <i className="fas fa-plus fa-fw text-primary"/>{i18n.t('common.button.new')}
                        </button>
                        <div className="dropdown-menu dropdown-menu-right shadow">
                          <Link
                            className="dropdown-item"
                            to={{
                              name: 'web.users.members.new-member',
                              params: params
                            }}
                          >
                            {i18n.t('userManagement.members.addNewMember')}
                          </Link>
                          <Link className="dropdown-item" to="/users/events">{i18n.t('userManagement.members.addMemberFromEvent')}</Link>
                        </div>
                      </div>
                    </CustomTooltip>
                  </div>
                  <MembersSelectedGroup
                    selectedGroup={groups.items.find(x => x.id === params.group)}
                    params={params}
                  />
                  <MembersTable
                    params={params}
                    members={members}
                    groups={groups}
                    filterHandler={generateChangeFilterHandler}
                    deleteMemberModal={generateShowDeleteMemberModalHandler}
                  />
                  <Pagination
                    index={members.index}
                    size={members.size}
                    total={members.total}
                    currentPageItemQuantity={members.items.length}
                    hrefTemplate={hrefTemplate.indexOf('?') >= 0 ?
                      `${hrefTemplate}&index=` :
                      `${hrefTemplate}?index=`}
                  />
                </>
              )}
              { page === 'database' && (
                <div className="col-12 database">
                  <MembersDatabase
                    isApiProcessing={isApiProcessing}
                  />
                </div>
              )}
              { page === 'sync' && (
                <div className="col-12 sync">
                  <DeviceSync
                    deviceSync={deviceSync}
                  />
                </div>
              )}
            </div>
          </div>
          <RouterView/>
        </div>
      </div>
      {/* Delete group modal */}
      {memberCardModalRender('deleteGroup')}
      {/* Delete member modal */}
      {memberCardModalRender('deleteMember')}
    </>
  );
};

Members.propTypes = {
  params: PropTypes.shape({group: PropTypes.string}).isRequired,
  groups: PropTypes.shape(MembersTable.propTypes.groups).isRequired,
  members: PropTypes.shape(MembersTable.propTypes.members).isRequired,
  remainingPictureCount: PropTypes.number.isRequired,
  deviceSync: PropTypes.any
};

export default withGlobalStatus(Members);
