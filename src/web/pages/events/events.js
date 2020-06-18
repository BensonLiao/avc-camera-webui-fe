const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const CustomTooltip = require('../../../core/components/tooltip');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');
const _ = require('../../../languages');
const Base = require('../shared/base');
const MemberModal = require('../../../core/components/member-modal');
const Pagination = require('../../../core/components/pagination');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const utils = require('../../../core/utils');
const EventsSidebar = require('./events-sidebar');

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
      systemInformation: PropTypes.shape({
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired
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
      })
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
   * Find group with its id.
   * @param {Number} groupId
   * @returns {Object}
   */
  findGroup = groupId => {
    return this.props.groups.items.find(x => x.id === groupId);
  };

  /**
   * Handler on user submit the search form.
   * @param {String} keyword
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  onSubmitSearchForm = ({keyword, start, end}) => {
    getRouter().go({
      name: this.currentRoute.name,
      params: {
        ...this.props.params,
        index: undefined,
        keyword,
        start: start ? start.toJSON() : undefined,
        end: end ? end.toJSON() : undefined
      }
    });
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

  toggleStartDatePicker = () => {
    this.setState(prevState => ({
      isShowStartDatePicker: !prevState.isShowStartDatePicker,
      isShowEndDatePicker: false
    }));
  }

  onHideStartDatePicker = () => {
    this.setState({isShowStartDatePicker: false});
  }

  toggleEndDatePicker = () => {
    this.setState(prevState => ({
      isShowEndDatePicker: !prevState.isShowEndDatePicker,
      isShowStartDatePicker: false
    }));
  }

  onHideEndDatePicker = () => {
    this.setState({isShowEndDatePicker: false});
  }

  searchFormRender = () => {
    const {isShowStartDatePicker, isShowEndDatePicker} = this.state;
    return (
      <Form>
        <div className="form-row datepicker-wrapper">
          <div className="col-auto px-0 btn-group">
            <Field
              name="start"
              component={DateTimePicker}
              dateTabText={_('Start Date')}
              timeTabText={_('Start Time')}
              inputProps={{
                className: classNames(
                  'btn start-date px-4',
                  {active: isShowStartDatePicker}
                ),
                placeholder: _('Start Datetime'),
                style: {whiteSpace: 'nowrap'}
              }}
              endDateFieldName="end"
              isShowPicker={isShowStartDatePicker}
              onClickInput={this.toggleStartDatePicker}
              onHide={this.onHideStartDatePicker}
            />
            <Field
              name="end"
              component={DateTimePicker}
              dateTabText={_('End Date')}
              timeTabText={_('End Time')}
              inputProps={{
                className: classNames(
                  'btn end-date px-4',
                  {active: isShowEndDatePicker}
                ),
                placeholder: _('End Datetime'),
                style: {whiteSpace: 'nowrap'}
              }}
              startDateFieldName="start"
              isShowPicker={isShowEndDatePicker}
              onClickInput={this.toggleEndDatePicker}
              onHide={this.onHideEndDatePicker}
            />
          </div>
        </div>
        <div className="form-row mt-4">
          <div className="col-auto px-0">
            <Field name="keyword" className="form-control" type="text" placeholder={_('Enter keywords')}/>
          </div>
          <div className="col-auto px-0 ml-3">
            <button className="btn btn-outline-primary rounded-pill px-3" type="submit">
              <i className="fas fa-search fa-fw"/> {_('Search')}
            </button>
          </div>
        </div>
      </Form>
    );
  };

  mainContentRender = events => {
    const searchFromInitialValues = {
      keyword: this.props.params.keyword || '',
      start: this.props.params.start ? new Date(this.props.params.start) : null,
      end: this.props.params.end ? new Date(this.props.params.end) : null
    };
    const hrefTemplate = getRouter().generateUri(
      this.currentRoute,
      {...this.props.params, index: undefined}
    );
    const sort = {
      time: {
        handler: this.generateChangeFilterHandler(
          'sort',
          (this.props.params.sort || '-time') === '-time' ? 'time' : null
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': (this.props.params.sort || '-time') === '-time',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'time'
        })
      },
      name: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'name' ? '-name' : 'name'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-name',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'name'
        })
      },
      organization: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'organization' ? '-organization' : 'organization'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-organization',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'organization'
        })
      },
      group: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'group' ? '-group' : 'group'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-group',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'group'
        })
      },
      confidence: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'confidence' ? '-confidence' : 'confidence'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-confidence',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'confidence'
        })
      },
      recognitionResult: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'recognitionResult' ? '-recognitionResult' : 'recognitionResult'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-recognitionResult',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'recognitionResult'
        })
      }
    };

    return (
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

              <Formik initialValues={searchFromInitialValues}
                onSubmit={this.onSubmitSearchForm}
              >
                {this.searchFormRender}
              </Formik>
            </div>

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
                              <button className="btn btn-link" type="button" onClick={this.generateMemberModifyHandler(event.confidences[0].member)}>
                                <i className="fas fa-pen fa-fw"/>
                              </button> :
                              <button className="btn btn-link" type="button" onClick={this.generateMemberModifyHandler(null, event.pictureThumbUrl)}>
                                <i className="fas fa-plus fa-fw"/>
                              </button>
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <Pagination index={this.props.faceEvents.index}
              size={this.props.faceEvents.size}
              total={this.props.faceEvents.total}
              itemQuantity={this.props.faceEvents.items.length}
              hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index={index}` : `${hrefTemplate}?index={index}`}/>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {$isApiProcessing, type} = this.state;
    const {params, systemInformation} = this.props;
    let events;
    if (type === 'face-recognition') {
      events = this.props.faceEvents;
    }

    return (
      <>
        <EventsSidebar
          params={params}
          systemInformation={systemInformation}
          type={type}/>

        <div className="main-content left-menu-active bg-white">
          {this.mainContentRender(events)}

          <MemberModal
            isApiProcessing={$isApiProcessing}
            isShowModal={this.state.isShowMemberModal}
            groups={this.props.groups}
            member={this.state.currentMember}
            defaultPictureUrl={this.state.defaultMemberPictureUrl}
            onHide={this.onHideMemberModal}
            onSubmitted={this.onSubmittedMemberForm}/>

        </div>
      </>
    );
  }
};
