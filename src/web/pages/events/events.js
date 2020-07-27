const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');
const NTPTimeZoneList = require('webserver-form-schema/constants/system-sync-time-ntp-timezone-list');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const _ = require('../../../languages');
const Base = require('../shared/base');
const MemberModal = require('../../../core/components/member-modal');
const Pagination = require('../../../core/components/pagination');
const utils = require('../../../core/utils');
const EventsSidebar = require('./events-sidebar');
const EventsSearchForm = require('./event-search-form');
const EventsTable = require('./events-table');

module.exports = class Events extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection']),
        confidence: PropTypes.oneOfType([
          PropTypes.oneOf(Confidence.all()),
          PropTypes.arrayOf(PropTypes.oneOf(Confidence.all()))
        ]),
        enrollStatus: PropTypes.oneOfType([
          PropTypes.oneOf(EnrollStatus.all()),
          PropTypes.arrayOf(PropTypes.oneOf(EnrollStatus.all()))
        ])
      }).isRequired,
      authStatus: PropTypes.shape({
        isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
        isEnableAgeGenderKey: PropTypes.bool.isRequired,
        isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }),
      faceEvents: PropTypes.shape({
        index: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          pictureThumbUrl: PropTypes.string.isRequired,
          time: PropTypes.string.isRequired,
          confidences: PropTypes.arrayOf(PropTypes.shape({
            score: PropTypes.number.isRequired,
            confidence: PropTypes.oneOf(Confidence.all()).isRequired,
            enrollStatus: PropTypes.oneOf(EnrollStatus.all()).isRequired,
            member: PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              organization: PropTypes.string,
              groupId: PropTypes.string,
              note: PropTypes.string,
              pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
            })
          }).isRequired).isRequired
        }).isRequired).isRequired
      }),
      systemDateTime: PropTypes.shape({
        ntpTimeZone: PropTypes.oneOf(NTPTimeZoneList.all()).isRequired,
        syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
    this.state.type = props.params.type || 'face-recognition';
    this.state.isShowMemberModal = false;
    this.state.currentMember = null;
    this.state.defaultMemberPictureUrl = null;
    this.state.isShowStartDatePicker = false;
    this.state.isShowEndDatePicker = false;
  }

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

  /**
   * Generate the handler to modify `member`.
   * @param {Object} member
   * @param {*} defaultPictureUrl
   * @returns {Function} The handler.
   */
  generateMemberModifyHandler = (member, defaultPictureUrl) => event => {
    event.preventDefault();
    this.setState({
      isShowMemberModal: true,
      currentMember: member,
      defaultMemberPictureUrl: defaultPictureUrl
    });
  };

  onSubmittedMemberForm = () => {
    this.setState({
      isShowMemberModal: false,
      currentMember: null,
      defaultMemberPictureUrl: null
    });
    getRouter().go({name: this.currentRoute.name, params: this.props.params}, {reload: true});
  };

  onHideMemberModal = () => {
    this.setState({
      isShowMemberModal: false,
      currentMember: null,
      defaultMemberPictureUrl: null
    });
  };

  render() {
    const {$isApiProcessing, type, isShowMemberModal, currentMember, defaultMemberPictureUrl} = this.state;
    const {params, authStatus, groups, faceEvents, systemDateTime} = this.props;
    let events;
    if (type === 'face-recognition') {
      events = faceEvents;
    }

    const hrefTemplate = getRouter().generateUri(
      this.currentRoute,
      {...params, index: undefined}
    );

    return (
      <>
        <EventsSidebar
          params={params}
          isApiProcessing={$isApiProcessing}
          authStatus={authStatus}
          type={type}
          currentRouteName={this.currentRoute.name}/>
        <div className="main-content left-menu-active bg-white">
          <div className="page-histories">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="card quantity-wrapper float-right">
                    <div className="card-body">
                      <div className="quantity">{utils.formatNumber(events.total)}</div>
                      <div className="description">{_('Total')}</div>
                    </div>
                  </div>
                  <EventsSearchForm
                    params={params}
                    systemDateTime={systemDateTime}
                    isApiProcessing={$isApiProcessing}
                    currentRouteName={this.currentRoute.name}/>
                </div>
                <EventsTable
                  params={params}
                  events={events}
                  groups={groups}
                  systemDateTime={systemDateTime}
                  filterHandler={this.generateChangeFilterHandler}
                  modifyMemberHandler={this.generateMemberModifyHandler}/>
                <Pagination index={faceEvents.index}
                  size={faceEvents.size}
                  total={faceEvents.total}
                  itemQuantity={faceEvents.items.length}
                  hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index={index}` : `${hrefTemplate}?index={index}`}/>
              </div>
            </div>
          </div>
          <MemberModal
            isApiProcessing={$isApiProcessing}
            isShowModal={isShowMemberModal}
            groups={groups}
            member={currentMember}
            defaultPictureUrl={defaultMemberPictureUrl}
            onHide={this.onHideMemberModal}
            onSubmitted={this.onSubmittedMemberForm}/>
        </div>
      </>
    );
  }
};
