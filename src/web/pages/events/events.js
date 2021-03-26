import axios from 'axios';
import download from 'downloadjs';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import RecognitionType from 'webserver-form-schema/constants/event-filters/recognition-type';
import Similarity from 'webserver-form-schema/constants/event-filters/similarity';
import EventsSidebar from './events-sidebar';
import EventsSearchForm from './event-search-form';
import EventsTable from './events-table';
import i18n from '../../../i18n';
import MemberModal from '../../../core/components/member-modal';
import Pagination from '../../../core/components/pagination';
import SearchMember from '../../../core/components/search-member';
import {withApiWrapper} from '../../../core/apis';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Events = ({params, authStatus, groups, faceEvents, systemDateTime, remainingPictureCount}) => {
  const {isApiProcessing} = useContextState();
  const currentRoute = getRouter().findRouteByName('web.users.events');
  const [state, setState] = useState({
    type: params.type || 'face-recognition',
    isShowMemberModal: false,
    isShowSearchMemberModal: false,
    currentMember: null,
    currentMemberName: null,
    eventPictureUrl: null,
    updateMemberModal: false
  });
  const {type, updateMemberModal, isShowMemberModal, isShowSearchMemberModal, currentMember, currentMemberName, eventPictureUrl} = state;

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

  /**
   * Generate the handler to add `member`.
   * @param {*} defaultPictureUrl
   * @returns {Function} The handler.
   */
  const generateMemberAddHandler = defaultPictureUrl => event => {
    event.preventDefault();
    testEventSnapshotLink(defaultPictureUrl)
      .then(() =>
        setState(prevState => ({
          ...prevState,
          isShowMemberModal: true,
          currentMember: null,
          eventPictureUrl: defaultPictureUrl,
          updateMemberModal: !prevState.updateMemberModal
        }))
      )
      // if Event URL is invalid
      .catch(_ => {});
  };

  /**
   * Generate the handler to add photo to current member.
   * @param {String} memberName
   * @param {*} defaultPictureUrl
   * @returns {Function} The handler.
   */
  const generateMemberModifyHandler = (memberName, defaultPictureUrl) => event => {
    event.preventDefault();
    testEventSnapshotLink(defaultPictureUrl)
      .then(() =>
        setState(prevState => ({
          ...prevState,
          isShowSearchMemberModal: true,
          currentMemberName: memberName,
          eventPictureUrl: defaultPictureUrl
        }))
      )
      // if Event URL is invalid
      .catch(_ => {});
  };

  const testEventSnapshotLink = defaultPictureUrl => new Promise(resolve => (
    resolve(axios({
      method: 'get',
      url: defaultPictureUrl,
      responseType: 'blob',
      timeout: 5 * 1000
    }))));

  const onSubmittedMemberForm = () => {
    setState(prevState => ({
      ...prevState,
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    }));
    getRouter().go({
      name: currentRoute.name,
      params: params
    }, {reload: true});
  };

  const onHideMemberModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    }));
  };

  const onHideSearchMemberModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowSearchMemberModal: false,
      currentMemberName: null
    }));
  };

  const hrefTemplate = currentRoute.generateUri(
    {
      ...params,
      index: undefined
    }
  );

  const downloadEventReport = () => {
    progress.start();
    withApiWrapper()({
      method: 'get',
      url: '/api/face-events/report.csv',
      responseType: 'blob'
    })
      .then(response => {
        download(response.data, 'event.csv');
      })
      .finally(progress.done);
  };

  return (
    <>
      <EventsSidebar
        params={params}
        isApiProcessing={isApiProcessing}
        authStatus={authStatus}
        type={type}
        currentRouteName={currentRoute.name}
      />
      <div className="main-content left-menu-active sub">
        <div className="page-events bg-white">
          <div className="w-100 px-32px py-12px">
            <div className="d-flex justify-content-between align-items-center">
              <EventsSearchForm
                params={params}
                systemDateTime={systemDateTime}
                isApiProcessing={isApiProcessing}
                currentRouteName={currentRoute.name}
              />
              <div className="ml-3">
                <button
                  className="btn btn-outline-primary rounded-pill"
                  type="button"
                  disabled={isApiProcessing}
                  onClick={downloadEventReport}
                >
                  <i className="fas fa-download mr-2"/>
                  {i18n.t('common.button.downloadReport')}
                </button>
              </div>
            </div>
            <div
              className="horizontal-border"
              style={{
                width: 'calc(100% + 4rem)',
                marginLeft: '-2rem'
              }}
            />
            <EventsTable
              params={params}
              events={faceEvents}
              groups={groups}
              systemDateTime={systemDateTime}
              remainingPictureCount={remainingPictureCount}
              filterHandler={generateChangeFilterHandler}
              addMemberHandler={generateMemberAddHandler}
              modifyMemberHandler={generateMemberModifyHandler}
            />
            <Pagination
              index={faceEvents.index}
              size={faceEvents.size}
              total={faceEvents.total}
              currentPageItemQuantity={faceEvents.items.length}
              hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index=` : `${hrefTemplate}?index=`}
            />
          </div>
        </div>
        <MemberModal
          key={updateMemberModal}
          isApiProcessing={isApiProcessing}
          isShowModal={isShowMemberModal}
          groups={groups}
          member={currentMember}
          remainingPictureCount={remainingPictureCount}
          defaultPictureUrl={eventPictureUrl}
          onHide={onHideMemberModal}
          onSubmitted={onSubmittedMemberForm}
        />
        <SearchMember
          isApiProcessing={isApiProcessing}
          memberName={currentMemberName}
          eventPictureUrl={eventPictureUrl}
          isShowModal={isShowSearchMemberModal}
          onHide={onHideSearchMemberModal}
        />
      </div>
    </>
  );
};

Events.propTypes = {
  params: PropTypes.shape({
    type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection']),
    confidence: PropTypes.oneOfType([
      PropTypes.oneOf(Similarity.all()),
      PropTypes.arrayOf(PropTypes.oneOf(Similarity.all()))
    ]),
    enrollStatus: PropTypes.oneOfType([
      PropTypes.oneOf(RecognitionType.all()),
      PropTypes.arrayOf(PropTypes.oneOf(RecognitionType.all()))
    ])
  }).isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string
    }).isRequired).isRequired
  }).isRequired,
  authStatus: PropTypes.shape(EventsSidebar.propTypes.authStatus).isRequired,
  faceEvents: PropTypes.shape(EventsTable.events).isRequired,
  systemDateTime: PropTypes.shape(EventsSearchForm.propTypes.systemDateTime).isRequired,
  remainingPictureCount: PropTypes.number.isRequired
};

export default withGlobalStatus(Events);
