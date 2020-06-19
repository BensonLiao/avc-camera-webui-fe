const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');
const utils = require('../../../core/utils');

module.exports = class EventsTable extends React.PureComponent {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        sort: PropTypes.string
      }).isRequired,
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
    const {params, events, filterHandler, modifyMemberHandler} = this.props;

    const sort = {
      time: {
        handler: filterHandler(
          'sort',
          (params.sort || '-time') === '-time' ? 'time' : null
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': (params.sort || '-time') === '-time',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'time'
        })
      },
      name: {
        handler: filterHandler(
          'sort',
          params.sort === 'name' ? '-name' : 'name'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-name',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'name'
        })
      },
      organization: {
        handler: filterHandler(
          'sort',
          params.sort === 'organization' ? '-organization' : 'organization'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-organization',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'organization'
        })
      },
      group: {
        handler: filterHandler(
          'sort',
          params.sort === 'group' ? '-group' : 'group'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-group',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'group'
        })
      },
      confidence: {
        handler: filterHandler(
          'sort',
          params.sort === 'confidence' ? '-confidence' : 'confidence'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-confidence',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'confidence'
        })
      },
      recognitionResult: {
        handler: filterHandler(
          'sort',
          params.sort === 'recognitionResult' ? '-recognitionResult' : 'recognitionResult'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': params.sort === '-recognitionResult',
          'fas fa-fw text-muted ml-3 fa-caret-up': params.sort === 'recognitionResult'
        })
      }
    };

    return (

      <div className="col-12 mb-5">
        <table className="table custom-style" style={{tableLayout: 'fixed'}}>
          <thead>
            <tr className="shadow">
              <th style={{width: '14%'}}>
                <a href="#time" onClick={sort.time.handler}>{_('Time')}</a>
                <i className={sort.time.icon}/>
              </th>
              <th style={{width: '10%'}}>{_('Capture')}</th>
              <th style={{width: '10%'}}>{_('User Picture')}</th>
              <th style={{width: '10%'}}>
                <a href="#" onClick={sort.name.handler}>{_('Name')}</a>
                <i className={sort.name.icon}/>
              </th>
              <th style={{width: '8%'}}>
                <a href="#" onClick={sort.group.handler}>{_('Group')}</a>
                <i className={sort.group.icon}/>
              </th>
              <th style={{width: '14%'}}>
                <a href="#" onClick={sort.organization.handler}>{_('Organization')}</a>
                <i className={sort.organization.icon}/>
              </th>
              <th style={{width: '10%'}}>
                <a href="#" onClick={sort.confidence.handler}>{_('Similarity')}</a>
                <i className={sort.confidence.icon}/>
              </th>
              <th style={{width: '8%'}}>
                <a href="#" onClick={sort.recognitionResult.handler}>{_('Recognition Result')}</a>
                <i className={sort.recognitionResult.icon}/>
              </th>
              <th style={{width: '10%'}}>{_('Note')}</th>
              <th style={{width: '6%'}}>{_('Actions')}</th>
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
              events.items.map((event, index) => (
                <tr key={event.id}>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {utils.formatDate(event.time, {withSecond: true})}
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    <div style={{width: 56, height: 56}}>
                      <div className="rounded-circle overflow-hidden" style={{margin: 0, padding: '0 0 100%', position: 'relative'}}>
                        <div style={{background: '50%', backgroundSize: 'cover', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, backgroundImage: `url('${event.pictureThumbUrl}')`}}/>
                      </div>
                    </div>
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].member ?
                        <img className="rounded-circle" src={`data:image/jpeg;base64,${event.confidences[0].member.pictures[0]}`} style={{height: '56px'}}/> :
                        '-'
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].member ?
                        event.confidences[0].member.name :
                        '-'
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].member ?
                        (this.findGroup(event.confidences[0].member.groupId) || {name: '-'}).name :
                        '-'
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].member ?
                        event.confidences[0].member.organization || '-' :
                        '-'
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 ?
                        _(`confidence-${event.confidences[0].confidence}`) :
                        '-'
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && (
                        <CustomTooltip title={event.confidences[0].score}>
                          {
                            event.confidences[0].enrollStatus === EnrollStatus.registered ?
                              <span className="badge badge-success badge-pill">{_(`enroll-status-${EnrollStatus.registered}`)}</span> :
                              <span className="badge badge-danger badge-pill">{_(`enroll-status-${EnrollStatus.unknown}`)}</span>
                          }
                        </CustomTooltip>
                      )
                    }
                  </td>
                  <td className={classNames({'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].member ?
                        event.confidences[0].member.note || '-' :
                        '-'
                    }
                  </td>
                  <td className={classNames('text-left', {'border-bottom': index === events.items.length - 1})}>
                    {
                      event.confidences.length > 0 && event.confidences[0].enrollStatus === EnrollStatus.registered ?
                        <CustomTooltip title={_('Edit Current Member')}>
                          <button className="btn btn-link" type="button" onClick={modifyMemberHandler(event.confidences[0].member)}>
                            <i className="fas fa-pen fa-fw"/>
                          </button>
                        </CustomTooltip> :
                        <CustomTooltip title={_('Add as New Member')}>
                          <button className="btn btn-link" type="button" onClick={modifyMemberHandler(null, event.pictureThumbUrl)}>
                            <i className="fas fa-plus text-size-20"/>
                          </button>
                        </CustomTooltip>
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
};
