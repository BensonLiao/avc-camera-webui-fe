const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const _ = require('../../../languages');
const Base = require('../shared/base');
const MemberModal = require('../../../core/components/member-modal');
const Pagination = require('../../../core/components/pagination');
const utils = require('../../../core/utils');
const EventsSidebar = require('./events-sidebar');
const EventsSearchForm = require('./event-search-form');
const EventsTable = require('./events-table');
const SearchMember = require('../../../core/components/search-member').default;

module.exports = class Events extends Base {
  static get propTypes() {
    return {
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
      }),
      authStatus: PropTypes.shape(EventsSidebar.propTypes.authStatus).isRequired,
      faceEvents: PropTypes.shape(EventsTable.events).isRequired,
      systemDateTime: PropTypes.shape(EventsSearchForm.propTypes.systemDateTime).isRequired,
      remainingPictureCount: PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
    this.state.type = props.params.type || 'face-recognition';
    this.state.isShowMemberModal = false;
    this.state.isShowSearchMemberModal = false;
    this.state.currentMember = null;
    this.state.currentMemberName = null;
    this.state.eventPictureUrl = null;
    this.state.isShowStartDatePicker = false;
    this.state.isShowEndDatePicker = false;
    this.state.updateMemberModal = false;
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
   * Generate the handler to add `member`.
   * @param {*} defaultPictureUrl
   * @returns {Function} The handler.
   */
  generateMemberAddHandler = defaultPictureUrl => event => {
    event.preventDefault();
    this.setState(prevState => ({
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
  generateMemberModifyHandler = (memberName, defaultPictureUrl) => event => {
    event.preventDefault();
    this.setState({
      isShowSearchMemberModal: true,
      currentMemberName: memberName,
      eventPictureUrl: defaultPictureUrl
    });
  };

  onSubmittedMemberForm = () => {
    this.setState({
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    });
    getRouter().go({
      name: this.currentRoute.name,
      params: this.props.params
    }, {reload: true});
  };

  onHideMemberModal = () => {
    this.setState({
      isShowMemberModal: false,
      currentMember: null,
      eventPictureUrl: null
    });
  };

  onHideSearchMemberModal = () => {
    this.setState({
      isShowSearchMemberModal: false,
      currentMemberName: null
    });
  };

  render() {
    const {$isApiProcessing, type, isShowMemberModal, isShowSearchMemberModal, currentMember, currentMemberName, eventPictureUrl} = this.state;
    const {params, authStatus, groups, faceEvents, systemDateTime, remainingPictureCount} = this.props;
    let events;
    if (type === 'face-recognition') {
      events = faceEvents;
    }

    const hrefTemplate = getRouter().generateUri(
      this.currentRoute,
      {
        ...params,
        index: undefined
      }
    );

    return (
      <>
        <EventsSidebar
          params={params}
          isApiProcessing={$isApiProcessing}
          authStatus={authStatus}
          type={type}
          currentRouteName={this.currentRoute.name}
        />
        <div className="main-content left-menu-active sub">
          <div className="page-events bg-white">
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
                    currentRouteName={this.currentRoute.name}
                  />
                </div>
                <EventsTable
                  params={params}
                  events={events}
                  groups={groups}
                  systemDateTime={systemDateTime}
                  remainingPictureCount={remainingPictureCount}
                  filterHandler={this.generateChangeFilterHandler}
                  addMemberHandler={this.generateMemberAddHandler}
                  modifyMemberHandler={this.generateMemberModifyHandler}
                />
                <Pagination
                  index={faceEvents.index}
                  size={faceEvents.size}
                  total={faceEvents.total}
                  itemQuantity={faceEvents.items.length}
                  hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index={index}` : `${hrefTemplate}?index={index}`}
                />
              </div>
            </div>
          </div>
          <MemberModal
            key={this.state.updateMemberModal}
            isApiProcessing={$isApiProcessing}
            isShowModal={isShowMemberModal}
            groups={groups}
            member={currentMember}
            remainingPictureCount={remainingPictureCount}
            defaultPictureUrl={eventPictureUrl}
            onHide={this.onHideMemberModal}
            onSubmitted={this.onSubmittedMemberForm}
          />
          <SearchMember
            isApiProcessing={$isApiProcessing}
            memberName={currentMemberName}
            eventPictureUrl={eventPictureUrl}
            isShowModal={isShowSearchMemberModal}
            onHide={this.onHideSearchMemberModal}
          />
        </div>
      </>
    );
  }
};
