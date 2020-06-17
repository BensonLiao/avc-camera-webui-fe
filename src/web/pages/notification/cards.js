const classNames = require('classnames');
const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const Modal = require('react-bootstrap/Modal').default;
const {Formik, Form, Field} = require('formik');
const ContentEditable = require('react-contenteditable').default;
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const outputIcon = require('../../../resource/icon-output-40px.svg');
const Base = require('../shared/base');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const CustomTooltip = require('../../../core/components/tooltip');
const sanitizeHtml = require('sanitize-html');
const {NOTIFY_CARDS_MAX, NOTIFY_CARDS_EMAIL_MAX} = require('../../../core/constants');

module.exports = class Cards extends Base {
  static get propTypes() {
    return {
      cards: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.cardFormTitleRef = React.createRef();
    this.state.cards = this.props.cards.items;
    this.state.isShowCardDetailsModal = false;
    this.state.cardDetails = null;
    this.state.isShowStartDatePicker = false;
    this.state.isShowEndDatePicker = false;
    this.state.isCardTitleOnFocus = false;
    this.state.cardTypeFilter = 'all';
    this.state.isTop = false;
  }

  generateCardInitialValues = card => {
    if (card) {
      return {
        id: card.id,
        type: card.type,
        title: card.title,
        isTop: card.isTop,
        isEnableTime: card.isEnableTime,
        $start: null,
        $end: null,
        timePeriods: card.timePeriods.map(x => ({...x, id: Math.random().toString(36).substr(2)})),
        $groups: card.groups.length > 0 ? card.groups[0] : '',
        faceRecognitionCondition: card.faceRecognitionCondition,
        isEnableGPIO: card.isEnableGPIO,
        isEnableGPIO1: card.isEnableGPIO1,
        isEnableGPIO2: card.isEnableGPIO2,
        isEnableEmail: card.isEnableEmail,
        $email: '',
        emails: card.emails,
        emailAttachmentType: card.emailAttachmentType,
        senderSubject: card.senderSubject,
        senderContent: card.senderContent,
        isEnableFaceRecognition: card.isEnableFaceRecognition,
        isEnableApp: card.isEnableApp
      };
    }

    return {
      type: NotificationCardType.faceRecognition,
      title: _('Enter Your Title'),
      isTop: false,
      isEnableTime: false,
      $start: null,
      $end: null,
      timePeriods: [],
      $groups: '',
      faceRecognitionCondition: NotificationFaceRecognitionCondition.always,
      isEnableGPIO: false,
      isEnableGPIO1: false,
      isEnableGPIO2: false,
      isEnableEmail: false,
      $email: '',
      emails: [],
      emailAttachmentType: NotificationEmailAttachmentType.faceThumbnail,
      senderSubject: '',
      senderContent: '',
      isEnableFaceRecognition: false,
      isEnableApp: false
    };
  };

  generateChangeNotificationCardTypeFilter = cardType => {
    return event => {
      event.preventDefault();
      this.setState({cardTypeFilter: cardType});
    };
  }

  generateDeleteCardHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    progress.start();
    api.notification.deleteCard(cardId)
      .then(() => this.setState(prevState => {
        const cards = [...prevState.cards];
        const index = cards.findIndex(x => x.id === cardId);

        if (index >= 0) {
          cards.splice(index, 1);
          return {cards};
        }
      }))
      .finally(progress.done);
  };

  generateToggleTopHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    const card = {...this.state.cards.find(x => x.id === cardId)};
    card.isTop = !card.isTop;
    progress.start();
    api.notification.updateCard(card)
      .then(response => this.setState(prevState => {
        const cards = [...prevState.cards];
        const index = cards.findIndex(x => x.id === cardId);

        if (index >= 0) {
          cards.splice(index, 1, response.data);
          return {cards};
        }
      }))
      .finally(progress.done);
  };

  generateClickCardHandler = cardId => event => {
    event.preventDefault();
    if (cardId == null) {
      if (this.state.cards.length >= NOTIFY_CARDS_MAX) {
        this.cardLimitError();
        return;
      }

      this.setState({
        isShowCardDetailsModal: true,
        cardDetails: null,
        isTop: false
      });
    } else {
      this.setState(prevState => {
        const card = prevState.cards.find(x => x.id === cardId);
        if (card) {
          return {
            isShowCardDetailsModal: true,
            cardDetails: card,
            isTop: card.isTop
          };
        }
      });
    }
  };

  onHideCardModal = () => {
    this.setState({isShowCardDetailsModal: false});
  };

  toggleStartDatePicker = () => this.setState(prevState => ({
    isShowStartDatePicker: !prevState.isShowStartDatePicker,
    isShowEndDatePicker: false
  }));

  onHideStartDatePicker = () => {
    this.setState({isShowStartDatePicker: false});
  };

  toggleEndDatePicker = () => this.setState(prevState => ({
    isShowEndDatePicker: !prevState.isShowEndDatePicker,
    isShowStartDatePicker: false
  }));

  onHideEndDatePicker = () => {
    this.setState({isShowEndDatePicker: false});
  };

  setCardTitleOnFocus = () => {
    this.setState({isCardTitleOnFocus: true});
  }

  setCardTitleOnBlur = () => {
    this.setState({isCardTitleOnFocus: false});
  }

  sanitizeInput = input => {
    return sanitizeHtml(input, {allowedTags: [], allowedAttributes: {}});
  }

  cardLimitError = () => { // Over card limit 32
    utils.showErrorNotification({
      title: _('Cards Limit Error'),
      message: _('Cannot create more than {0} cards', [NOTIFY_CARDS_MAX])
    });
  }

  onSubmitCardForm = values => {
    const data = {
      ...values,
      isTop: this.state.isTop,
      groups: values.$groups ? [values.$groups] : [],
      title: this.sanitizeInput(values.title)
    };

    if (data.id == null) {
      // Create a new card.
      if (this.state.cards.length >= NOTIFY_CARDS_MAX) {
        this.cardLimitError();
        return;
      }

      progress.start();
      api.notification.addCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            cards.push(response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .finally(progress.done);
    } else {
      // Update the card.
      progress.start();
      api.notification.updateCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            const index = cards.findIndex(x => x.id === data.id);
            cards.splice(index, 1, response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .finally(progress.done);
    }
  };

  cardFormRender = ({errors, touched, values, setFieldValue, validateField}) => {
    const {groups} = this.props;
    const {
      $isApiProcessing,
      isShowStartDatePicker,
      isShowEndDatePicker,
      isCardTitleOnFocus,
      cardDetails
    } = this.state;
    const onClickTitleEditButton = event => {
      event.preventDefault();
      this.cardFormTitleRef.current.focus();
    };

    const onClickAddTimePeriod = event => {
      event.preventDefault();
      const timePeriods = [...values.timePeriods];
      timePeriods.push({
        id: Math.random().toString(36).substr(2),
        start: values.$start,
        end: values.$end,
        isRepeat: false
      });
      setFieldValue('timePeriods', timePeriods);
      setFieldValue('$start', null);
      setFieldValue('$end', null);
    };

    const generateDeleteTimePeriodHandler = index => event => {
      event.preventDefault();
      const timePeriods = [...values.timePeriods];
      timePeriods.splice(index, 1);
      setFieldValue('timePeriods', timePeriods);
    };

    const onClickAddEmail = event => {
      event.preventDefault();
      validateField('$email').then(value => {
        if (!value) {
          const emails = [...values.emails];
          emails.push(values.$email);
          setFieldValue('emails', emails);
          setFieldValue('$email', '');
        }
      });
    };

    const validateEmail = () => {
      if (values.$email) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.$email)) {
          return _('Invalid email address');
        }

        const emails = [...values.emails];

        if (emails.length > NOTIFY_CARDS_EMAIL_MAX - 1) {
          return _('Number of receiver E-mails limit is 64');
        }

        return utils.duplicateCheck(emails, values.$email, _('Duplicate E-mail found'));
      }
    };

    const generateDeleteEmailHandler = index => event => {
      event.preventDefault();
      const emails = [...values.emails];
      emails.splice(index, 1);
      setFieldValue('emails', emails);
    };

    const onChangeTitle = event => {
      if (event.target.value) {
        setFieldValue('title', this.sanitizeInput(event.target.value));
      }
    };

    const toggleIsTop = () => {
      this.setState(
        prevState => ({
          isTop: !prevState.isTop
        })
      );
    };

    return (
      <Form className="modal-content">
        <div className="modal-body d-flex justify-content-between align-content-center pb-2">
          <div className="d-flex align-content-center">
            <CustomTooltip title={this.state.isTop ? _('Unpin Card') : _('Pin Card')}>
              <button
                type="button"
                className={classNames('btn btn-star rounded-pill', {'btn-secondary': !this.state.isTop})}
                onClick={toggleIsTop}
              >
                <i className="fas fa-bell fa-fw fa-lg"/>
              </button>
            </CustomTooltip>
            <ContentEditable
              innerRef={this.cardFormTitleRef}
              html={values.title}
              tagName="p"
              className={classNames(
                'title text-primary ml-3 my-0',
                {'text-truncate': !isCardTitleOnFocus}
              )}
              onChange={onChangeTitle}
              onFocus={this.setCardTitleOnFocus}
              onBlur={this.setCardTitleOnBlur}
            />

            <a className="btn-edit-title ml-3" href="#" onClick={onClickTitleEditButton}>
              <i className="fas fa-pen"/>
            </a>
          </div>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="type" component="select" className="form-control border-0">
              {
                NotificationCardType.all().filter(faceRecognition => (faceRecognition === '0' || faceRecognition === '3' || faceRecognition === '5')).map(faceRecognition => {
                  return <option key={faceRecognition} value={faceRecognition}>{_(`notification-card-${faceRecognition}`)}</option>;
                })
              }
            </Field>
          </div>
        </div>
        <Tab.Container defaultActiveKey="tab-notification-time">
          <Nav>
            <Nav.Item>
              <Nav.Link
                eventKey="tab-notification-time"
              >
                {_('Schedule')}
              </Nav.Link>
            </Nav.Item>
            {values.type === NotificationCardType.faceRecognition && (
              <Nav.Item>
                <Nav.Link
                  eventKey="tab-notification-condition"
                >
                  {_('Rule')}
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link
                eventKey="tab-notification-target"
              >
                {_('Subject')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="modal-body">
            <Tab.Content>
              <Tab.Pane eventKey="tab-notification-time">
                {/* Time settings */}
                <div className="form-group d-flex justify-content-between align-items-center">
                  <label className="mb-0">{_('Schedule')}</label>
                  <div className="custom-control custom-switch">
                    <Field name="isEnableTime" checked={values.isEnableTime} type="checkbox" className="custom-control-input" id="switch-notification-time"/>
                    <label className="custom-control-label" htmlFor="switch-notification-time">
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group pl-4 datepicker-wrapper">
                  <div className="form-row">
                    <div className="col-auto my-1 btn-group">
                      <Field
                        name="$start"
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
                        endDateFieldName="$end"
                        isShowPicker={isShowStartDatePicker}
                        onClickInput={this.toggleStartDatePicker}
                        onHide={this.onHideStartDatePicker}
                      />
                      <Field
                        name="$end"
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
                        startDateFieldName="$start"
                        isShowPicker={isShowEndDatePicker}
                        onClickInput={this.toggleEndDatePicker}
                        onHide={this.onHideEndDatePicker}
                      />
                    </div>
                    <CustomTooltip show={!values.$start || !values.$end} title={_('Please Enter Start and End Datetime')}>
                      <div className="col-auto my-1">
                        <button
                          disabled={!values.$start || !values.$end || values.timePeriods.length >= 5}
                          className="btn btn-primary rounded-circle" type="button"
                          style={(!values.$start || !values.$end) ? {pointerEvents: 'none'} : {}}
                          onClick={onClickAddTimePeriod}
                        >
                          <i className="fas fa-plus"/>
                        </button>
                      </div>
                    </CustomTooltip>
                  </div>
                  {
                    values.timePeriods.map((timePeriod, index) => (
                      <div key={timePeriod.id} className="form-row my-3">
                        <div className="col-12">
                          <div className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item">
                            <div>
                              {`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}
                            </div>
                            <a href="#" onClick={generateDeleteTimePeriodHandler(index)}><i className="fas fa-times-circle fa-lg"/></a>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="tab-notification-condition">
                {/* Condition settings */}
                {/* face-recognition */}
                <div className="form-group d-flex justify-content-between align-items-center">
                  <label className="mb-0">{_('Recognition')}</label>
                  <div className="custom-control custom-switch">
                    <Field name="isEnableFaceRecognition" checked={values.isEnableFaceRecognition} type="checkbox" className="custom-control-input" id="switch-notification-face-recognition"/>
                    <label className="custom-control-label" htmlFor="switch-notification-face-recognition">
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  {
                    NotificationFaceRecognitionCondition.all().map(condition => (
                      <div key={condition} className="form-check mb-3">
                        <Field name="faceRecognitionCondition" className="form-check-input" type="radio" id={`input-notification-face-recognition-${condition}`} value={condition}/>
                        <label className="form-check-label" htmlFor={`input-notification-face-recognition-${condition}`}>
                          {_(`face-recognition-condition-${condition}`)}
                        </label>
                      </div>
                    ))
                  }
                </div>
                <div className="form-group">
                  <div className="card">
                    <div className="card-body px-4 py-4">
                      <div className="form-group">
                        <label className="text-size-16 mb-0">{_('Group Type')}</label>
                      </div>
                      <div className="col-auto px-0">
                        <div className="select-wrapper border rounded-pill overflow-hidden d-flex align-items-center">
                          <i className="far fa-folder fa-sm"/>
                          <Field name="$groups" component="select" className="form-control border-0">
                            <option value="">{_('Everyone')}</option>
                            {
                              groups.items.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                              ))
                            }
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="tab-notification-target">
                {/* I/O Notification */}
                <div className="form-group d-flex justify-content-between align-items-center">
                  <label className="mb-0">I/O</label>
                  <div className="custom-control custom-switch">
                    <Field name="isEnableGPIO" type="checkbox" className="custom-control-input" id="switch-notification-target-io"/>
                    <label className="custom-control-label" htmlFor="switch-notification-target-io">
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </div>
                <div className={classNames('form-group', values.isEnableGPIO ? '' : 'd-none')}>
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group d-flex justify-content-between align-items-center">
                        <label className="mb-0">{_('Output {0}', ['1'])}</label>
                        <div className="custom-control custom-switch">
                          <Field name="isEnableGPIO1" type="checkbox" className="custom-control-input" id="switch-notification-target-output-1"/>
                          <label className="custom-control-label" htmlFor="switch-notification-target-output-1">
                            <span>{_('ON')}</span>
                            <span>{_('OFF')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0">{_('Output {0}', ['2'])}</label>
                        <div className="custom-control custom-switch">
                          <Field name="isEnableGPIO2" type="checkbox" className="custom-control-input" id="switch-notification-target-output-2"/>
                          <label className="custom-control-label" htmlFor="switch-notification-target-output-2">
                            <span>{_('ON')}</span>
                            <span>{_('OFF')}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr/>

                {/* E-mail Notification */}
                <div className="form-group d-flex justify-content-between align-items-center">
                  <label className="mb-0">{_('Email')}</label>
                  <div className="custom-control custom-switch">
                    <Field name="isEnableEmail" type="checkbox" className="custom-control-input" id="switch-notification-target-mail"/>
                    <label className="custom-control-label" htmlFor="switch-notification-target-mail">
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="card">
                    <div className="card-body">
                      <div className={classNames('form-group', {'d-none': values.type === NotificationCardType.digitalInput})}>
                        <label className="text-size-16 mb-3">{_('Email Attachment')}</label>
                        <div className="select-wrapper border rounded-pill overflow-hidden">
                          <Field
                            name="emailAttachmentType"
                            component="select"
                            className="form-control border-0"
                          >
                            {
                              NotificationEmailAttachmentType.all().map(attachmentType => (
                                !(values.type === NotificationCardType.motionDetection && attachmentType === NotificationEmailAttachmentType.faceThumbnail) && (
                                  <option
                                    key={attachmentType}
                                    value={attachmentType}
                                  >{_(`email-attachment-type-${attachmentType}`)}
                                  </option>)
                              ))
                            }
                          </Field>
                        </div>
                        <hr/>
                      </div>
                      <div className="form-group mb-4">
                        <label className="text-size-16">Subject :</label>
                        <Field
                          name="senderSubject"
                          type="text"
                          className="form-control"
                          placeholder={_('Specify the subject of notification emails.')}/>
                      </div>
                      <div className="form-group mb-4">
                        <label className="text-size-16">Content :</label>
                        <Field
                          name="senderContent"
                          type="text"
                          className="form-control"
                          placeholder={_('Append your message to notification emails.')}/>
                      </div>
                      <div className="form-group mb-1">
                        <label className="text-size-16 mb-0">{_('Receiver')} :</label>
                        <div className="form-row">
                          <div className="col-auto my-1">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  style={{borderColor: (errors.$email && touched.$email) && '#dc3545'}}
                                >
                                  <i className="fas fa-envelope"/>
                                </span>
                              </div>
                              <Field
                                name="$email"
                                type="text"
                                className={classNames('form-control', 'notification-email', {'is-invalid': errors.$email && touched.$email})}
                                validate={validateEmail}
                                placeholder={_('Enter email address')}/>
                            </div>
                          </div>
                          <CustomTooltip show={!values.$email} title={_('Please Enter an Email Address')}>

                            <div className="col-auto my-1">
                              <button
                                disabled={!values.$email}
                                style={values.$email ? {} : {pointerEvents: 'none'}}

                                type="button"
                                className="btn btn-primary rounded-circle"
                                onClick={onClickAddEmail}
                              >
                                <i className="fas fa-plus"/>
                              </button>
                            </div>
                          </CustomTooltip>

                        </div>
                        <div className={classNames({'is-invalid': errors.$email && touched.$email})}>
                          {
                            errors.$email && touched.$email && (
                              <div
                                style={{display: (errors.$email && touched.$email) && 'block'}}
                                className="invalid-feedback form-row"
                              >
                                {errors.$email}
                              </div>
                            )
                          }
                        </div>
                      </div>
                      {
                        values.emails.map((email, index) => {
                          const key = `${index}${email}`;
                          return (
                            <div key={key} className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item mb-3">
                              <div>{email}</div>
                              <a href="#" onClick={generateDeleteEmailHandler(index)}>
                                <i className="fas fa-times-circle fa-lg"/>
                              </a>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>

        <div className="modal-body">
          <div className="form-group">
            <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {cardDetails ? _('Confirm') : _('Add')}
            </button>
          </div>
          <button
            type="button" className="btn btn-info btn-block m-0 rounded-pill"
            onClick={this.onHideCardModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  cardRender = card => {
    const {groups} = this.props;
    const {$isApiProcessing} = this.state;

    return (
      <div key={card.id} className="card shadow overflow-hidden" onClick={this.generateClickCardHandler(card.id)}>
        <div className="card-title d-flex justify-content-between align-items-center">
          <div className="title text-truncate">
            <CustomTooltip title={card.isTop ? _('Unpin Card') : _('Pin Card')}>
              <button
                disabled={$isApiProcessing} type="button"
                className={classNames('btn btn-star rounded-pill', {'btn-secondary': !card.isTop})}
                onClick={this.generateToggleTopHandler(card.id)}
              >
                <i className="fas fa-bell fa-fw fa-lg"/>
              </button>
            </CustomTooltip>

            <a className="ml-3" href="#">{card.title}</a>
          </div>
          <div className="icons d-flex justify-content-end">
            {
              card.isEnableEmail && (
                <div className="icon rounded-pill d-flex justify-content-center align-items-center">
                  <i className="fas fa-envelope fa-fw fa-lg"/>
                </div>
              )
            }
            {
              card.isEnableGPIO && (
                <div className="icon rounded-pill d-flex justify-content-center align-items-center ml-2">
                  <img src={outputIcon}/>
                </div>
              )
            }
          </div>
        </div>
        <div className="card-body">
          <table>
            <tbody>
              <tr>
                <th>{_('Analytic')}</th>
                <td>{_(`notification-card-${card.type}`)}</td>
              </tr>
              {
                card.timePeriods.map((timePeriod, index) => {
                  const key = `${index}`;

                  return (
                    <tr key={key}>
                      <th>{index === 0 ? _('Schedule') : ''}</th>
                      <td>{`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}</td>
                    </tr>
                  );
                })
              }
              <tr>
                <th>{_('Rule')}</th>
                <td>{_(`face-recognition-condition-${card.faceRecognitionCondition}`)}</td>
              </tr>
            </tbody>
          </table>
          <div className="chips-wrapper">
            <div className="chips">
              {
                card.groups.slice(0, 2).map(groupId => {
                  const group = groups.items.find(x => x.id === groupId);
                  return (
                    <span key={groupId} className="border border-primary rounded-pill text-primary">
                      {group ? group.name : ''}
                    </span>
                  );
                })
              }
            </div>
            {
              card.groups.length > 2 && (
                <div className="chips-sum-extra">
                  <span className="border border-primary rounded-pill text-primary">+{card.groups.length - 2}</span>
                </div>
              )
            }
          </div>
          <button
            disabled={$isApiProcessing} type="button"
            className="btn btn-secondary rounded-circle btn-delete"
            onClick={this.generateDeleteCardHandler(card.id)}
          >
            <i className="far fa-trash-alt fa-lg"/>
          </button>
        </div>
      </div>
    );
  };

  render() {
    const {cards, isShowCardDetailsModal, cardDetails, cardTypeFilter} = this.state;
    const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
    const topCards = filterCards.filter(x => x.isTop);
    const normalCards = filterCards.filter(x => !x.isTop);
    return (
      <>
        <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
          <div className="page-notification pt-0 pb-0">
            <div className="container-fluid">
              <div className="filter d-flex align-items-center text-nowrap mb-0">
                <label className="mb-0">{_('Notification Filters')}</label>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === 'all'},
                    {'btn-primary': cardTypeFilter === 'all'}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter('all')}
                >{_('notification-card-filter-all')}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === NotificationCardType.faceRecognition},
                    {'btn-primary': cardTypeFilter === NotificationCardType.faceRecognition}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.faceRecognition)}
                >{_(`notification-card-${NotificationCardType.faceRecognition}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === NotificationCardType.motionDetection},
                    {'btn-primary': cardTypeFilter === NotificationCardType.motionDetection}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.motionDetection)}
                >{_(`notification-card-${NotificationCardType.motionDetection}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === NotificationCardType.digitalInput},
                    {'btn-primary': cardTypeFilter === NotificationCardType.digitalInput}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.digitalInput)}
                >{_(`notification-card-${NotificationCardType.digitalInput}`)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content left-menu-active">
          <div className="page-notification pt-0">
            <div className="container-fluid">
              {
                topCards.length > 0 && (
                  <>
                    <h3 className="mb-2">{_('Pinned')}</h3>
                    <hr className="my-1"/>
                    <div className="card-container">
                      {topCards.map(this.cardRender)}
                    </div>
                  </>
                )
              }

              <h3 className="mb-2">{_('Others')}</h3>
              <hr className="my-1"/>

              <div className="card-container mb-4">
                {normalCards.map(this.cardRender)}
              </div>

              <div className="fixed-actions-section fixed-bottom text-center pb-5">
                <button className="btn btn-outline-primary btn-lg bg-white text-primary border-0 rounded-circle shadow"
                  type="button" onClick={this.generateClickCardHandler()}
                >
                  <i className="fas fa-plus"/>
                </button>
              </div>
            </div>

            {/* Modal */}
            <Modal
              autoFocus={false} show={isShowCardDetailsModal}
              className="notification-card" dialogClassName="modal-600"
              onHide={this.onHideCardModal}
            >
              <Formik
                initialValues={this.generateCardInitialValues(cardDetails)}
                validateOnChange={false}
                onSubmit={this.onSubmitCardForm}
              >
                {this.cardFormRender}
              </Formik>
            </Modal>
          </div>
        </div>
      </>
    );
  }
};
