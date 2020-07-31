const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');
const NTPTimeZoneList = require('webserver-form-schema/constants/system-sync-time-ntp-timezone-list');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');
const utils = require('../../../core/utils');

module.exports = class EventsTable extends React.PureComponent {
  static get propTypes() {
    return {
      params: PropTypes.shape({sort: PropTypes.string}).isRequired,
      events: PropTypes.shape({
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
      }).isRequired,
      filterHandler: PropTypes.func.isRequired,
      modifyMemberHandler: PropTypes.func.isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }).isRequired,
      systemDateTime: PropTypes.shape({
        ntpTimeZone: PropTypes.oneOf(NTPTimeZoneList.all()).isRequired,
        syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
  }

  /**
   * Find group with its id.
   * @param {Number} groupId
   * @returns {Object}
   */
  findGroup = groupId => {
    return this.props.groups.items.find(x => x.id === groupId);
  };

  render() {
    const {params, events, filterHandler, modifyMemberHandler, systemDateTime} = this.props;
    const defaultIconClass = 'fas fa-fw text-muted ml-3';
    const tableField = [
      {
        handler: filterHandler('sort', (params.sort || '-time') === '-time' ? 'time' : null),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': (params.sort || '-time') === '-time'},
          {'fa-caret-up': params.sort === 'time'}),
        title: _('Time'), width: {width: '14%'}
      },
      {title: _('Capture'), width: {width: '10%'}},
      {title: _('User Picture'), width: {width: '10%'}},
      {
        handler: filterHandler('sort', params.sort === 'name' ? '-name' : 'name'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-name'},
          {'fa-caret-up': params.sort === 'name'}),
        title: _('Name'), width: {width: '10%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'group' ? '-group' : 'group'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-group'},
          {'fa-caret-up': params.sort === 'group'}),
        title: _('Group'), width: {width: '8%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'organization' ? '-organization' : 'organization'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-organization'},
          {'fa-caret-up': params.sort === 'organization'}),
        title: _('Organization'), width: {width: '14%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'confidence' ? '-confidence' : 'confidence'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-confidence'},
          {'fa-caret-up': params.sort === 'confidence'}),
        title: _('Similarity'), width: {width: '10%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'recognitionResult' ? '-recognitionResult' : 'recognitionResult'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-recognitionResult'},
          {'fa-caret-up': params.sort === 'recognitionResult'}),
        title: _('Recognition Result'), width: {width: '8%'}
      },
      {title: _('Note'), width: {width: '10%'}},
      {title: _('Actions'), width: {width: '6%'}}
    ];
    return (
      <div className="col-12 mb-5">
        <table className="table custom-style" style={{tableLayout: 'fixed'}}>
          <thead>
            <tr className="shadow">
              {tableField.map(item => {
                const render = item.handler ? (<><a href="#" onClick={item.handler}>{item.title}</a><i className={item.icon}/></>) : item.title;
                return (
                  <th key={item.title} style={item.width}>
                    {render}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {
              /* The empty view */
              !events.items.length && (
                <tr>
                  <td className="text-size-20 text-center" colSpan="10">
                    <i className="fas fa-frown-open fa-fw text-dark"/> {_('Can\'t find any data.')}
                  </td>
                </tr>
              )
            }
            {
              events.items.map((event, index) => {
                const item = event.confidences[0];
                const lengthCheck = event.confidences.length;
                const ifExists = lengthCheck > 0 && item.member;
                const isEnrolled = lengthCheck > 0 && item.enrollStatus === EnrollStatus.registered;
                if (systemDateTime.syncTimeOption === SyncTimeOption.ntp) {
                  event.time = new Date(event.time).toLocaleString('en-US', {timeZone: systemDateTime.ntpTimeZone});
                } else {
                  event.time = (new Date(new Date(event.time).getTime() + (new Date(event.time).getTimezoneOffset() * 60 * 1000)));
                }

                return (
                  <tr key={event.id}>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      {utils.formatDate(event.time, {withSecond: true})}
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      <div style={{width: 56, height: 56}}>
                        <div className="rounded-circle overflow-hidden" style={{margin: 0, padding: '0 0 100%', position: 'relative'}}>
                          <div style={{
                            background: '50%',
                            backgroundSize: 'cover',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundImage: `url('${event.pictureThumbUrl}')`
                          }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      {ifExists ? (
                        <img
                          className="rounded-circle"
                          src={`data:image/jpeg;base64,${item.member.pictures[0]}`}
                          style={{height: '56px'}}
                        />
                      ) : '-'}
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      <CustomTooltip placement="top-start" title={ifExists ? item.member.name : ''}>
                        <div>
                          {ifExists ? item.member.name : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      <CustomTooltip placement="top-start" title={ifExists ? (this.findGroup(item.member.groupId) || {name: '-'}).name : ''}>
                        <div>
                          {ifExists ? (this.findGroup(item.member.groupId) || {name: '-'}).name : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      <CustomTooltip placement="top-start" title={ifExists ? item.member.organization || '-' : ''}>
                        <div>
                          {ifExists ? item.member.organization || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      {lengthCheck > 0 ? _(`confidence-${item.confidence}`) : '-'}
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      {
                        lengthCheck > 0 && (
                          <CustomTooltip title={item.score}>
                            <span className={classNames('badge badge-pill', {'badge-success': isEnrolled}, {'badge-danger': !isEnrolled})}>
                              {isEnrolled ? _(`enroll-status-${EnrollStatus.registered}`) : _(`enroll-status-${EnrollStatus.unknown}`)}
                            </span>
                          </CustomTooltip>
                        )
                      }
                    </td>
                    <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                      <CustomTooltip placement="top-start" title={ifExists ? item.member.note || '-' : ''}>
                        <div>
                          {ifExists ? item.member.note || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td className={classNames('text-left', {'border-bottom': index === events.items.length - 1})}>
                      <CustomTooltip title={isEnrolled ? _('Edit Current Member') : _('Add as New Member')}>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={isEnrolled ? modifyMemberHandler(item.member) : modifyMemberHandler(null, event.pictureThumbUrl)}
                        >
                          <i className={classNames('fas', {'fa-pen fa-fw': isEnrolled}, {'fa-plus text-size-20': !isEnrolled})}/>
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
  }
};
