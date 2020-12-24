import axios from 'axios';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Similarity from 'webserver-form-schema/constants/event-filters/similarity';
import RecognitionType from 'webserver-form-schema/constants/event-filters/recognition-type';
import NTPTimeZoneList from 'webserver-form-schema/constants/system-sync-time-ntp-timezone-list';
import SyncTimeOption from 'webserver-form-schema/constants/system-sync-time';
import i18n from '../../../i18n';
import CustomTooltip from '../../../core/components/tooltip';
import utils from '../../../core/utils';
import ErrorDisplay from '../../../core/components/error-display';

const EventsTable = ({params, events, filterHandler, addMemberHandler, modifyMemberHandler, remainingPictureCount}) => {
  const generateEnlargePhotoHandler = eventPhotoUrl => {
    axios({
      method: 'get',
      url: eventPhotoUrl,
      responseType: 'blob'
    })
      .then(response => {
        window.open(window.URL.createObjectURL(response.data), '_blank', 'rel=noopener noreferrer');
      })
      .catch(_ => {});
  };

  const isOverPhotoLimit = remainingPictureCount <= 0 && remainingPictureCount !== null;
  const defaultIconClass = 'fas fa-fw text-muted ml-3';
  const tableField = [
    {
      handler: filterHandler('sort', (params.sort || '-time') === '-time' ? 'time' : null),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': (params.sort || '-time') === '-time'},
        {'fa-caret-up': params.sort === 'time'}),
      title: i18n.t('userManagement.events.time'),
      width: {width: '14%'}
    },
    {
      title: i18n.t('userManagement.events.capture'),
      width: {width: '10%'}
    },
    {
      title: i18n.t('userManagement.events.userPicture'),
      width: {width: '10%'}
    },
    {
      handler: filterHandler('sort', params.sort === 'name' ? '-name' : 'name'),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': params.sort === '-name'},
        {'fa-caret-up': params.sort === 'name'}),
      title: i18n.t('userManagement.events.name'),
      width: {width: '10%'}
    },
    {
      handler: filterHandler('sort', params.sort === 'group' ? '-group' : 'group'),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': params.sort === '-group'},
        {'fa-caret-up': params.sort === 'group'}),
      title: i18n.t('userManagement.events.group'),
      width: {width: '8%'}
    },
    {
      handler: filterHandler('sort', params.sort === 'organization' ? '-organization' : 'organization'),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': params.sort === '-organization'},
        {'fa-caret-up': params.sort === 'organization'}),
      title: i18n.t('userManagement.events.organization'),
      width: {width: '14%'}
    },
    {
      handler: filterHandler('sort', params.sort === 'confidence' ? '-confidence' : 'confidence'),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': params.sort === '-confidence'},
        {'fa-caret-up': params.sort === 'confidence'}),
      title: i18n.t('userManagement.events.similarity'),
      width: {width: '10%'}
    },
    {
      handler: filterHandler('sort', params.sort === 'recognitionResult' ? '-recognitionResult' : 'recognitionResult'),
      icon: classNames(defaultIconClass,
        {'fa-caret-down': params.sort === '-recognitionResult'},
        {'fa-caret-up': params.sort === 'recognitionResult'}),
      title: i18n.t('userManagement.events.status'),
      width: {width: '8%'}
    },
    {
      title: i18n.t('userManagement.events.note'),
      width: {width: '10%'}
    },
    {
      title: i18n.t('userManagement.events.actions'),
      width: {width: '6%'}
    }
  ];
  return (
    <div
      className="col-12 mb-5 table-responsive"
      style={{overflowY: 'hidden'}}
    >
      <table className="table custom-style">
        <thead>
          <tr className="shadow">
            {tableField.map(item => {
              return (
                <th key={item.title} style={item.width}>
                  {
                    item.handler ? (
                      <>
                        <a href="#" onClick={item.handler}>{item.title}</a>
                        <i className={item.icon}/>
                      </>
                    ) :
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
                  <i className="fas fa-frown-open fa-fw text-dark"/> {i18n.t('userManagement.events.noData')}
                </td>
              </tr>
            )
          }
          {
            events.items.map(event => {
              return (
                <tr key={event.id}>
                  <td>
                    {utils.formatDate(
                      utils.subtractTimezoneOffset(new Date(event.time)),
                      {withSecond: true}
                    )}
                  </td>
                  <td>
                    <div className="thumbnail-wrapper">
                      <div className="rounded-circle overflow-hidden circle-crop">
                        {event.pictureThumbUrl && (
                          <a onClick={() => generateEnlargePhotoHandler(event.pictureLargeUrl)}>
                            <div className="thumbnail" style={{backgroundImage: `url('${event.pictureThumbUrl}')`}}/>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {event.member && event.member.picture ? (
                      <div className="thumbnail-wrapper">
                        <div className="rounded-circle overflow-hidden circle-crop">
                          <div className="thumbnail" style={{backgroundImage: `url('data:image/jpeg;base64,${event.member.picture}')`}}/>
                        </div>
                      </div>
                    ) : '-'}
                  </td>
                  {['name', 'group', 'organization'].map(memberDetail => (
                    <td key={memberDetail}>
                      <CustomTooltip placement="top-start" title={event.member ? event.member[memberDetail] || '' : ''}>
                        <div>
                          {event.member ? event.member[memberDetail] || '-' : '-'}
                        </div>
                      </CustomTooltip>
                    </td>
                  ))}
                  <td>
                    {event.confidences && event.recognitionType !== RecognitionType.fake ?
                      utils.getEventConfidenceI18N(event.confidences.similarity, <ErrorDisplay/>) :
                      '-'}
                  </td>
                  <td>
                    <CustomTooltip title={event.confidences ? event.confidences.score || '' : ''}>
                      <span className={classNames('badge badge-pill',
                        {'badge-success': event.recognitionType === RecognitionType.registered},
                        {'badge-danger': event.recognitionType === RecognitionType.unknown},
                        {'badge-warning': event.recognitionType === RecognitionType.fake}
                      )}
                      >
                        {utils.getEventRecognitionTypeI18N(event.recognitionType, <ErrorDisplay/>)}
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
                      <CustomTooltip show={isOverPhotoLimit} title={i18n.t('userManagement.events.tooltip.photoLimitExceeded')}>
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
                            {i18n.t('common.button.add')}
                          </button>
                          <div className="dropdown-menu dropdown-menu-right shadow">
                            <a
                              className="dropdown-item px-3"
                              onClick={addMemberHandler(event.pictureThumbUrl)}
                            >{i18n.t('userManagement.events.addNewMember')}
                            </a>
                            <a
                              className="dropdown-item px-3"
                              onClick={modifyMemberHandler(event.member && event.member.name, event.pictureThumbUrl)}
                            >{i18n.t('userManagement.events.addExistingMember')}
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
};

EventsTable.propTypes = {
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

export default EventsTable;
