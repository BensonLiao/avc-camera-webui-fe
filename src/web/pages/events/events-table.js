const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const NTPTimeZoneList = require('webserver-form-schema/constants/system-sync-time-ntp-timezone-list');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');
const utils = require('../../../core/utils');
const wrappedApi = require('../../../core/apis');
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
          recognitionType: PropTypes.oneOf(RecognitionType.all()).isRequired,
          member: PropTypes.shape({
            id: PropTypes.string.isRequired,
            picture: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            group: PropTypes.string,
            organization: PropTypes.string,
            note: PropTypes.string
          }),
          confidences: PropTypes.shape({
            score: PropTypes.string.isRequired,
            similarity: PropTypes.oneOf(Similarity.all()).isRequired
          }).isRequired
        }).isRequired).isRequired
      }).isRequired,
      filterHandler: PropTypes.func.isRequired,
      addMemberHandler: PropTypes.func.isRequired,
      modifyMemberHandler: PropTypes.func.isRequired,
      systemDateTime: PropTypes.shape({
        ntpTimeZone: PropTypes.oneOf(NTPTimeZoneList.all()).isRequired,
        syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired
      }).isRequired,
      remainingPictureCount: PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
  }

  generateEnlargePhotoHandler = eventPhotoUrl => {
    wrappedApi({
      method: 'get',
      url: eventPhotoUrl,
      responseType: 'blob'
    })
      .then(response => {
        window.open(window.URL.createObjectURL(response.data), '_blank', 'rel=noopener noreferrer');
      });
  }

  render() {
    const {
      params,
      events,
      filterHandler,
      addMemberHandler,
      modifyMemberHandler,
      systemDateTime,
      remainingPictureCount
    } = this.props;
    const isOverPhotoLimit = remainingPictureCount <= 0 && remainingPictureCount !== null;
    const defaultIconClass = 'fas fa-fw text-muted ml-3';
    const tableField = [
      {
        handler: filterHandler('sort', (params.sort || '-time') === '-time' ? 'time' : null),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': (params.sort || '-time') === '-time'},
          {'fa-caret-up': params.sort === 'time'}),
        title: _('Time'),
        width: {width: '14%'}
      },
      {
        title: _('Capture'),
        width: {width: '10%'}
      },
      {
        title: _('User Picture'),
        width: {width: '10%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'name' ? '-name' : 'name'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-name'},
          {'fa-caret-up': params.sort === 'name'}),
        title: _('Name'),
        width: {width: '10%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'group' ? '-group' : 'group'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-group'},
          {'fa-caret-up': params.sort === 'group'}),
        title: _('Group'),
        width: {width: '8%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'organization' ? '-organization' : 'organization'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-organization'},
          {'fa-caret-up': params.sort === 'organization'}),
        title: _('Organization'),
        width: {width: '14%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'confidence' ? '-confidence' : 'confidence'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-confidence'},
          {'fa-caret-up': params.sort === 'confidence'}),
        title: _('Similarity'),
        width: {width: '10%'}
      },
      {
        handler: filterHandler('sort', params.sort === 'recognitionResult' ? '-recognitionResult' : 'recognitionResult'),
        icon: classNames(defaultIconClass,
          {'fa-caret-down': params.sort === '-recognitionResult'},
          {'fa-caret-up': params.sort === 'recognitionResult'}),
        title: _('Recognition Result'),
        width: {width: '8%'}
      },
      {
        title: _('Note'),
        width: {width: '10%'}
      },
      {
        title: _('Actions'),
        width: {width: '6%'}
      }
    ];
    return (
      <div className="col-12 mb-5 table-responsive">
        <table className="table custom-style">
          <thead>
            <tr className="shadow">
              {tableField.map(item => {
                return (
                  <th key={item.title} style={item.width}>
                    {
                      item.handler ?
                        <><a href="#" onClick={item.handler}>{item.title}</a><i className={item.icon}/></> :
                        item.title
                    }
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
              events.items.map(event => {
                if (systemDateTime.syncTimeOption === SyncTimeOption.ntp) {
                  event.time = new Date(event.time).toLocaleString('en-US', {timeZone: systemDateTime.ntpTimeZone});
                } else {
                  event.time = (new Date(new Date(event.time).getTime() + (new Date(event.time).getTimezoneOffset() * 60 * 1000)));
                }

                return (
                  <tr key={event.id}>
                    <td>
                      {utils.formatDate(event.time, {withSecond: true})}
                    </td>
                    <td>
                      <div style={{
                        width: 56,
                        height: 56
                      }}
                      >
                        <div
                          className="rounded-circle overflow-hidden"
                          style={{
                            margin: 0,
                            padding: '0 0 100%',
                            position: 'relative'
                          }}
                        >
                          {event.pictureThumbUrl && (
                            <a
                              onClick={() => {
                                this.generateEnlargePhotoHandler(event.pictureLargeUrl);
                              }}
                            >
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
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {event.member && event.member.picture ? (
                        <img
                          className="rounded-circle"
                          src={`data:image/jpeg;base64,${event.member.picture}`}
                          style={{height: '56px'}}
                        />
                      ) : '-'}
                    </td>
                    <td>
                      <CustomTooltip placement="top-start" title={event.member ? event.member.name || '' : ''}>
                        <div>
                          {event.member ? event.member.name || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td>
                      <CustomTooltip placement="top-start" title={event.member ? event.member.group || '' : ''}>
                        <div>
                          {event.member ? event.member.group || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td>
                      <CustomTooltip placement="top-start" title={event.member ? event.member.organization || '' : ''}>
                        <div>
                          {event.member ? event.member.organization || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td>
                      {event.confidences && event.recognitionType !== RecognitionType.fake ? _(`confidence-${event.confidences.similarity}`) : '-'}
                    </td>
                    <td>
                      <CustomTooltip title={event.confidences ? event.confidences.score || '' : ''}>
                        <span className={classNames('badge badge-pill',
                          {'badge-success': event.recognitionType === RecognitionType.registered},
                          {'badge-danger': event.recognitionType === RecognitionType.unknown},
                          {'badge-warning': event.recognitionType === RecognitionType.fake}
                        )}
                        >
                          {_(`enroll-status-${event.recognitionType}`)}
                        </span>
                      </CustomTooltip>
                    </td>
                    <td>
                      <CustomTooltip placement="top-start" title={event.member ? event.member.note || '' : ''}>
                        <div>
                          {event.member ? event.member.note || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                    <td>
                      {event.recognitionType === RecognitionType.fake ? '-' : (
                        <CustomTooltip show={isOverPhotoLimit} title={_('Photo Limit Reached')}>
                          <div className="d-flex justify-content-center">
                            <button
                              disabled={isOverPhotoLimit}
                              className="btn text-primary dropdown-toggle p-0"
                              type="button"
                              data-toggle="dropdown"
                              style={{
                                boxShadow: 'none',
                                pointerEvents: isOverPhotoLimit ? 'none' : 'auto'
                              }}
                            >
                              {_('Add')}
                            </button>
                            <div className="dropdown-menu dropdown-menu-right shadow">
                              <a
                                className="dropdown-item px-3"
                                onClick={addMemberHandler(event.pictureThumbUrl)}
                              >{_('Add as New Member')}
                              </a>
                              <a
                                className="dropdown-item px-3"
                                onClick={modifyMemberHandler(event.member && event.member.name, event.pictureThumbUrl)}
                              >{_('Add to Existing Member')}
                              </a>
                            </div>
                          </div>
                        </CustomTooltip>
                      )}
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
