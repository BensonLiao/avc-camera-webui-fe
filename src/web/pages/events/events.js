import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {getRouter} from 'capybara-router';
import Similarity from 'webserver-form-schema/constants/event-filters/similarity';
import RecognitionType from 'webserver-form-schema/constants/event-filters/recognition-type';
import i18n from '../../../i18n';
import MemberModal from '../../../core/components/member-modal';
import Pagination from '../../../core/components/pagination';
import utils from '../../../core/utils';
import EventsSidebar from './events-sidebar';
import EventsSearchForm from './event-search-form';
import EventsTable from './events-table';
import SearchMember from '../../../core/components/search-member';
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
    setState(prevState => ({
      ...state,
      isShowMemberModal: true,
      currentMember: null,
      eventPictureUrl: defaultPictureUrl,
      updateMemberModal: !prevState.updateMemberModal
    }));
  };

  /**
   * Generate the handler to add photo to current member.
   * @param {String} memberName
   * @param {*} defaultPictureUrl
   * @returns {Function} The handler.
   */
  const generateMemberModifyHandler = (memberName, defaultPictureUrl) => event => {
    event.preventDefault();
    setState({
      ...state,
      isShowSearchMemberModal: true,
      currentMemberName: memberName,
      eventPictureUrl: defaultPictureUrl
    });
  };

  const onSubmittedMemberForm = () => {
    setState({
      ...state,
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    });
    getRouter().go({
      name: currentRoute.name,
      params: params
    }, {reload: true});
  };

  const onHideMemberModal = () => {
    setState({
      ...state,
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    });
  };

  const onHideSearchMemberModal = () => {
    setState({
      ...state,
      isShowSearchMemberModal: false,
      currentMemberName: null
    });
  };

  const hrefTemplate = getRouter().generateUri(
    currentRoute,
    {
      ...params,
      index: undefined
    }
  );

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
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card quantity-wrapper float-right">
                  <div className="card-body">
                    <div className="quantity">{utils.formatNumber(faceEvents.total)}</div>
                    <div className="description">{i18n.t('Total')}</div>
                  </div>
                </div>
                <EventsSearchForm
                  params={params}
                  systemDateTime={systemDateTime}
                  isApiProcessing={isApiProcessing}
                  currentRouteName={currentRoute.name}
                />
              </div>
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
                itemQuantity={faceEvents.items.length}
                hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index=` : `${hrefTemplate}?index=`}
              />
            </div>
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
