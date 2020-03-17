const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const Modal = require('react-bootstrap/Modal').default;
const {Formik, Form, Field} = require('formik');
const ContentEditable = require('react-contenteditable').default;
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const outputIcon = require('../../../resource/icon-output-40px.svg');
const Base = require('../shared/base');
const DatePicker = require('../../../core/components/fields/date-picker');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Cards extends Base {
  constructor(props) {
    super(props);
    this.cardFormTitleRef = React.createRef();
    this.state.cards = props.cards.items;
    this.state.isShowCardDetailsModal = false;
    this.state.cardDetails = null;
    this.state.isShowStartDatePicker = false;
    this.state.isShowEndDatePicker = false;
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
        isEnableFaceRecognition: card.isEnableFaceRecognition,
        isEnableApp: card.isEnableApp
      };
    }

    return {
      type: NotificationCardType.faceRecognition,
      title: '輸入通知名稱',
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
      isEnableFaceRecognition: false,
      isEnableApp: false
    };
  };

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
      .catch(utils.renderError)
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
      .catch(utils.renderError)
      .finally(progress.done);
  };

  generateClickCardHandler = cardId => event => {
    event.preventDefault();
    if (cardId == null) {
      this.setState({
        isShowCardDetailsModal: true,
        cardDetails: null
      });
    } else {
      this.setState(prevState => {
        const card = prevState.cards.find(x => x.id === cardId);
        if (card) {
          return {
            isShowCardDetailsModal: true,
            cardDetails: card
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

  onSubmitCardForm = values => {
    const data = {
      ...values,
      groups: values.$groups ? [values.$groups] : []
    };

    progress.start();
    if (data.id == null) {
      // Create a new card.
      api.notification.addCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            cards.push(response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .catch(utils.renderError)
        .finally(progress.done);
    } else {
      // Update the card.
      api.notification.updateCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            const index = cards.findIndex(x => x.id === data.id);
            cards.splice(index, 1, response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .catch(utils.renderError)
        .finally(progress.done);
    }
  };

  cardFormRender = ({values, setFieldValue}) => {
    const {groups} = this.props;
    const {$isApiProcessing, isShowStartDatePicker, isShowEndDatePicker} = this.state;
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
      const emails = [...values.emails];
      emails.push(values.$email);
      setFieldValue('emails', emails);
      setFieldValue('$email', '');
    };

    const generateDeleteEmailHandler = index => event => {
      event.preventDefault();
      const emails = [...values.emails];
      emails.splice(index, 1);
      setFieldValue('emails', emails);
    };

    const onChangeTitle = event => {
      if (event.target.value) {
        setFieldValue('title', event.target.value);
      }
    };

    return (
      <Form className="modal-content">
        <div className="modal-body d-flex justify-content-between align-content-center pb-2">
          <div className="d-flex align-content-center">
            <button
              disabled={$isApiProcessing || values.id == null} type="button"
              className="btn btn-star rounded-pill btn-secondary"
              onClick={this.generateToggleTopHandler(values.id)}
            >
              <i className="fas fa-bell fa-fw fa-lg"/>
            </button>
            <ContentEditable
              innerRef={this.cardFormTitleRef}
              html={values.title}
              tagName="p" className="title text-primary ml-3 my-0"
              onChange={onChangeTitle}/>
            <a className="btn-edit-title ml-3" href="#" onClick={onClickTitleEditButton}>
              <i className="fas fa-pen"/>
            </a>
          </div>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="type" component="select" className="form-control border-0">
              <option value={NotificationCardType.faceRecognition}>{_('Facial Recognition')}</option>
            </Field>
          </div>
        </div>
        <nav>
          <div className="nav nav-tabs">
            <a className="nav-item nav-link active" data-toggle="tab" href="#tab-notification-time">{_('Schedule')}</a>
            <a className="nav-item nav-link" data-toggle="tab" href="#tab-notification-condition">{_('Rule')}</a>
            <a className="nav-item nav-link" data-toggle="tab" href="#tab-notification-target">{_('Subject')}</a>
          </div>
        </nav>
        <div className="modal-body tab-content">
          {/* Time settings */}
          <div className="tab-pane fade show active" id="tab-notification-time">
            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{_('Time')}</label>
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
                    component={DatePicker}
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
                    component={DatePicker}
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
                <div className="col-auto my-1">
                  <button
                    disabled={!values.$start || !values.$end || values.timePeriods.length >= 5}
                    className="btn btn-primary rounded-circle" type="button"
                    onClick={onClickAddTimePeriod}
                  >
                    <i className="fas fa-plus fa-lg"/>
                  </button>
                </div>
              </div>
              {
                values.timePeriods.map((timePeriod, index) => (
                  <div key={timePeriod.id} className="form-row mb-1">
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
          </div>

          {/* Condition settings */}
          <div className="tab-pane fade" id="tab-notification-condition">
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
            <div className="col-auto my-1">
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

          {/* Notification receiver */}
          <div className="tab-pane fade" id="tab-notification-target">
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
            <div className="form-group">
              <div className="card">
                <div className="card-body">
                  <div className="form-group d-flex justify-content-between align-items-center">
                    <label className="mb-0">{_('I/O output {0}', ['1'])}</label>
                    <div className="custom-control custom-switch">
                      <Field name="isEnableGPIO1" type="checkbox" className="custom-control-input" id="switch-notification-target-output-1"/>
                      <label className="custom-control-label" htmlFor="switch-notification-target-output-1">
                        <span>{_('ON')}</span>
                        <span>{_('OFF')}</span>
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="mb-0">{_('I/O output {0}', ['2'])}</label>
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
                  <div className="form-group">
                    <label className="text-size-16 mb-0">{_('Email Attachment')}</label>
                  </div>
                  <div className="form-group">
                    {
                      NotificationEmailAttachmentType.all().map(attachmentType => (
                        <div key={attachmentType} className="form-check mb-3">
                          <Field name="emailAttachmentType" className="form-check-input" type="radio" id={`input-notification-mail-attachment-${attachmentType}`} value={attachmentType}/>
                          <label className="form-check-label" htmlFor={`input-notification-mail-attachment-${attachmentType}`}>
                            {_(`email-attachment-type-${attachmentType}`)}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                  <hr/>

                  <div className="form-group">
                    <label className="text-size-16 mb-0">{_('Receiver')}</label>
                  </div>
                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-auto my-1">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fas fa-envelope"/></span>
                          </div>
                          <Field name="$email" type="text" className="form-control" placeholder={_('Enter email address')} style={{width: 260}}/>
                        </div>
                      </div>
                      <div className="col-auto my-1">
                        <button
                          disabled={!values.$email} type="button"
                          className="btn btn-secondary btn-new-row rounded-circle"
                          onClick={onClickAddEmail}
                        >
                          <i className="fas fa-plus"/>
                        </button>
                      </div>
                    </div>
                  </div>
                  {
                    values.emails.map((email, index) => {
                      const key = `${index}${email}`;
                      return (
                        <div key={key} className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item">
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
          </div>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {_('Add')}
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
            <button
              disabled={$isApiProcessing} type="button"
              className={classNames('btn btn-star rounded-pill', {'btn-secondary': !card.isTop})}
              onClick={this.generateToggleTopHandler(card.id)}
            >
              <i className="fas fa-bell fa-fw fa-lg"/>
            </button>
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
                      {group.name}
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
    const {cards, isShowCardDetailsModal, cardDetails} = this.state;
    const topCards = cards.filter(x => x.isTop);
    const normalCards = cards.filter(x => !x.isTop);

    return (
      <>
        <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
          <div className="page-notification pt-0 pb-0">
            <div className="container-fluid">
              <div className="filter d-flex align-items-center text-nowrap mb-0">
                <label className="mb-0">{_('Notification Filters')}</label>
                <button className="btn btn-primary rounded-pill shadow-sm ml-4" type="button">{_('Facial Recognition')}</button>
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
