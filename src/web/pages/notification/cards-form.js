
const classNames = require('classnames');
const ContentEditable = require('react-contenteditable').default;
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const React = require('react');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const NotificationFaceRecognitionVMSEvent = require('webserver-form-schema/constants/notification-face-recognition-vms-event');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');
const {NOTIFY_CARDS_MAX, NOTIFY_CARDS_EMAIL_MAX} = require('../../../core/constants');
const utils = require('../../../core/utils');
const CardsFormSchedule = require('./cards-form-schedule');
const CardsFormRule = require('./cards-form-rule');

module.exports = class CardsForm extends React.PureComponent {
  static get propTypes() {
    return {
      groups: PropTypes.object.isRequired,
      isApiProcessing: PropTypes.bool.isRequired,
      isShowCardDetailsModal: PropTypes.bool.isRequired,
      cardDetails: PropTypes.object,
      sanitizeInput: PropTypes.func.isRequired,
      onHideCardModal: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {cardDetails: null};
  }

  state = {
    isCardTitleOnFocus: false
  };

  setCardTitleOnFocus = () => {
    this.setState({isCardTitleOnFocus: true});
  }

  setCardTitleOnBlur = () => {
    this.setState({isCardTitleOnFocus: false});
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
        isEnableVMS: card.isEnableVMS,
        faceRecognitionVMSEvent: card.faceRecognitionVMSEvent,
        $email: '',
        emails: card.emails,
        emailAttachmentType: card.emailAttachmentType,
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
      isEnableVMS: true,
      faceRecognitionVMSEvent: NotificationFaceRecognitionVMSEvent.motionDetect,
      $email: '',
      emails: [],
      emailAttachmentType: NotificationEmailAttachmentType.faceThumbnail,
      isEnableFaceRecognition: false,
      isEnableApp: false
    };
  };

  cardLimitError = () => { // Over card limit 32
    utils.showErrorNotification({
      title: _('Cards Limit Error'),
      message: _('Cannot create more than {0} cards', [NOTIFY_CARDS_MAX])
    });
  }

  cardFormRender = ({errors, touched, values, setFieldValue, validateField}) => {
    const {groups, isApiProcessing, onHideCardModal, cardDetails} = this.props;
    const {isCardTitleOnFocus} = this.state;
    const onClickTitleEditButton = event => {
      event.preventDefault();
      this.cardFormTitleRef.current.focus();
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
        setFieldValue('title', this.props.sanitizeInput(event.target.value));
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
                {/* Schedule settings */}
                <CardsFormSchedule
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="tab-notification-condition">
                {/* Rule settings */}
                {/* face-recognition */}
                <CardsFormRule
                  values={values}
                  groups={groups}
                />
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="tab-notification-target">
                {/* Subject settings */}
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

                {/* VMS Notification */}
                <div className={classNames('form-group', {'d-none': values.type === NotificationCardType.digitalInput})}>
                  <div className="form-group d-flex justify-content-between align-items-center">
                    <label className="mb-0">{_('Video Management System')}</label>
                    <div className="custom-control custom-switch">
                      <Field name="isEnableVMS" type="checkbox" className="custom-control-input" id="switch-notification-target-vms" checked={values.isEnableVMS}/>
                      <label className="custom-control-label" htmlFor="switch-notification-target-vms">
                        <span>{_('ON')}</span>
                        <span>{_('OFF')}</span>
                      </label>
                    </div>
                  </div>
                  <div className={classNames('form-group', {'d-none': values.type === NotificationCardType.motionDetection})}>
                    <div className="card">
                      <div className="card-body">
                        <div className="form-group">
                          <label className="text-size-16 mb-0">{_('Method')}</label>
                        </div>
                        <div className="form-group">
                          {
                            NotificationFaceRecognitionVMSEvent.all().map(RecognitionVMSEvent => (
                              <div key={RecognitionVMSEvent} className="form-check mb-3">
                                <Field name="faceRecognitionVMSEvent" className="form-check-input" type="radio" id={`input-notification-vms-event-${RecognitionVMSEvent}`} value={RecognitionVMSEvent}/>
                                <label className="form-check-label" htmlFor={`input-notification-vms-event-${RecognitionVMSEvent}`}>
                                  {_(`notification-vms-event-${RecognitionVMSEvent}`)}
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr/>
                </div>

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
                      <div className="form-group">
                        <label className="text-size-16 mb-3">{_('Receiver')}</label>
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
            <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {cardDetails ? _('Confirm') : _('Add')}
            </button>
          </div>
          <button
            type="button" className="btn btn-info btn-block m-0 rounded-pill"
            onClick={onHideCardModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {isShowCardDetailsModal, onSubmit, cardDetails, onHideCardModal} = this.props;
    return (
      <Modal
        autoFocus={false} show={isShowCardDetailsModal}
        className="notification-card" dialogClassName="modal-600"
        onHide={onHideCardModal}
      >
        <Formik
          initialValues={this.generateCardInitialValues(cardDetails)}
          validateOnChange={false}
          onSubmit={onSubmit}
        >
          {this.cardFormRender}
        </Formik>
      </Modal>
    );
  }
};
