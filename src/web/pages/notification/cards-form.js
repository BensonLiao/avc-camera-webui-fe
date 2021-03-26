import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import Modal from 'react-bootstrap/Modal';
import {Nav, Tab} from 'react-bootstrap';
import NotificationCardSchema from 'webserver-form-schema/notification-card-schema';
import NotificationCardType from 'webserver-form-schema/constants/notification-card-type';
import NotificationEmailAttachmentType from 'webserver-form-schema/constants/notification-email-attachment-type';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import notificationHdCapacityValidator from '../../validations/notifications/notification-hd-capacity-validator';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import sanitizeHtml from 'sanitize-html';
import api from '../../../core/apis/web-api';
import CardsFormRule from './cards-form-rule';
import CardsFormSchedule from './cards-form-schedule';
import CardsFormSubject from './cards-form-subject';
import ContentEditable from '@benson.liao/react-content-editable';
import CustomTooltip from '../../../core/components/tooltip';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import i18nUtils from '../../../i18n/utils';
import {NOTIFY_CARDS_MAX} from '../../../core/constants';
import {useConfirm} from '../../../core/components/confirm';
import utils from '../../../core/utils';

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
const CustomNormalWrapper = (
  <div style={{
    fontSize: '20px',
    fontWeight: 'bold',
    marginLeft: '1rem',
    cursor: 'pointer',
    color: primaryColor
  }}
  />
);

const CardsForm = ({
  isApiProcessing,
  groups,
  isShowCardDetailsModal,
  hideCardFormModal,
  cardDetails,
  isTop,
  setIsTop,
  cardLimitError,
  cards,
  modelName,
  authStatus,
  triggerArea
}) => {
  const [currentTab, setCurrentTab] = useState('tab-notification-schedule');

  const defaultSubject = {
    faceRecognition: i18n.t('notification.cards.defaultSubjectFR', {0: modelName}),
    motionDetection: i18n.t('notification.cards.defaultSubjectMD', {0: modelName}),
    digitalInput: i18n.t('notification.cards.defaultSubjectDI', {0: modelName}),
    humanDetection: i18n.t('notification.cards.defaultSubjectHD', {0: modelName}),
    ageGender: i18n.t('notification.cards.defaultSubjectAG', {0: modelName})
  };
  const {isEnableFaceRecognitionKey, isEnableAgeGenderKey, isEnableHumanoidDetectionKey} = authStatus;
  // Confirm switch state is used to prevent tiggering Formik effect while setting field value
  const [confirmSwitch, setConfirmSwitch] = useState(true);
  const confirm = useConfirm();

  const setTab = event => {
    setCurrentTab(event);
  };

  const generateCardInitialValues = card => {
    if (card) {
      return {
        id: card.id,
        type: card.type,
        title: card.title,
        isTop: card.isTop,
        isEnableTime: card.isEnableTime,
        isEnableSchedule: card.isEnableSchedule,
        $start: null,
        $end: null,
        timePeriods: card.timePeriods,
        $groups: card.groups.length > 0 ? card.groups[0] : '',
        faceRecognitionCondition: card.faceRecognitionCondition,
        isEnableGPIO: card.isEnableGPIO,
        isEnableGPIO1: card.isEnableGPIO1,
        isEnableGPIO2: card.isEnableGPIO2,
        isEnableEmail: card.isEnableEmail,
        isEnableSDCardRecording: card.isEnableSDCardRecording,
        $email: '',
        emails: card.emails,
        emailAttachmentType: card.emailAttachmentType,
        senderSubject: card.senderSubject || defaultSubjectTitle(card.type),
        senderContent: card.senderContent,
        emailContentPosition: card.emailContentPosition,
        isEnableFaceRecognition: card.isEnableFaceRecognition,
        isEnableApp: card.isEnableApp,
        selectedDay: card.selectedDay,
        hdIntrusionAreaId: `${card.hdIntrusionAreaId}`,
        hdEnabled: card.hdEnabled,
        hdOption: card.hdOption,
        hdCapacity: card.hdCapacity
      };
    }

    return {
      type: isEnableFaceRecognitionKey ? NotificationCardType.faceRecognition : NotificationCardType.motionDetection,
      title: i18n.t('notification.cards.defaultCardTitle'),
      isTop: false,
      isEnableTime: false,
      isEnableSchedule: false,
      $start: null,
      $end: null,
      timePeriods: [],
      $groups: '',
      faceRecognitionCondition: NotificationFaceRecognitionCondition.always,
      isEnableGPIO: false,
      isEnableGPIO1: false,
      isEnableGPIO2: false,
      isEnableEmail: false,
      isEnableSDCardRecording: false,
      $email: '',
      emails: [],
      emailAttachmentType: isEnableFaceRecognitionKey ? NotificationEmailAttachmentType.faceThumbnail : NotificationEmailAttachmentType.screenshot,
      senderSubject: isEnableFaceRecognitionKey ? defaultSubject.faceRecognition : defaultSubject.motionDetection,
      senderContent: '',
      emailContentPosition: 0,
      isEnableFaceRecognition: false,
      isEnableApp: false,
      selectedDay: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      hdIntrusionAreaId: '0',
      hdEnabled: false,
      hdOption: '0',
      hdCapacity: 1
    };
  };

  const onChangeSelectValue = setFieldValue => event => {
    // Force switch tab back to `schedule` to prevent
    // viewing non existent tabs on different card types
    setCurrentTab('tab-notification-schedule');
    setFieldValue('type', event.target.value);
  };

  const onChangeCardForm = ({nextValues, prevValues, formik}) => {
    if (prevValues.type !== nextValues.type) {
      defaultSubjectTitle(nextValues.type, formik);
      if (nextValues.type !== NotificationCardType.faceRecognition) {
        formik.setFieldValue('emailAttachmentType', NotificationEmailAttachmentType.screenshot);
      }
    }

    // Clear time periods if switching between schedule modes (Repeat <-> Normal schedule) to prevent
    // showing 1970/1/1 date
    if (prevValues.isEnableSchedule !== nextValues.isEnableSchedule && confirmSwitch && formik.values.timePeriods.length > 0) {
      setConfirmSwitch(false);
      return confirm.open({
        title: i18n.t('notification.cards.confirmRepeatScheduleTitle'),
        body: i18n.t('notification.cards.confirmRepeatScheduleBody')
      })
        .then(isConfirm => {
          if (isConfirm) {
            return formik.setFieldValue('timePeriods', []);
          }

          formik.setFieldValue('isEnableSchedule', prevValues.isEnableSchedule);
        })
        // reset confirm state
        .then(() => setConfirmSwitch(true));
    }
  };

  const defaultSubjectTitle = (type, formik = null) => {
    switch (type) {
      case NotificationCardType.faceRecognition:
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.faceRecognition) : defaultSubject.faceRecognition;
      case NotificationCardType.humanoidDetection:
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.humanDetection) : defaultSubject.humanDetection;
      case NotificationCardType.ageGender:
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.ageGender) : defaultSubject.ageGender;
      case NotificationCardType.motionDetection:
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.motionDetection) : defaultSubject.motionDetection;
      case NotificationCardType.digitalInput:
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.digitalInput) : defaultSubject.digitalInput;
      default:
        break;
    }
  };

  const toggleIsTop = () => {
    setIsTop(prevState => (!prevState));
  };

  const sanitizeInput = input => {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });
  };

  const onSubmit = values => {
    const data = {
      ...values,
      timePeriods: utils.parseCardTimePeriods(values),
      isTop: isTop,
      groups: values.faceRecognitionCondition === NotificationFaceRecognitionCondition.success ?
        (values.$groups ? [values.$groups] : []) :
        [],
      title: sanitizeInput(values.title)
    };

    if (data.id == null) {
      // Create a new card.
      if (cards.length >= NOTIFY_CARDS_MAX) {
        return cardLimitError();
      }

      progress.start();
      api.notification.addCard(data)
        .then(getRouter().reload)
        .finally(progress.done);
    } else {
      // Update the card.
      progress.start();
      api.notification.updateCard(data)
        .then(getRouter().reload)
        .finally(progress.done);
    }
  };

  return (
    <Modal
      autoFocus={false}
      show={isShowCardDetailsModal}
      className="notification-card"
      dialogClassName="modal-600"
      onHide={hideCardFormModal}
    >
      <Formik
        initialValues={generateCardInitialValues(cardDetails)}
        validateOnChange={false}
        validate={notificationHdCapacityValidator}
        onSubmit={onSubmit}
      >
        {({errors, touched, values, setFieldValue, validateField}) => {
          const onChangeTitle = value => {
            if (value) {
              setFieldValue('title', sanitizeInput(value));
            }
          };

          return (
            <Form className="modal-content">
              <FormikEffect onChange={onChangeCardForm}/>
              <div className="modal-body d-flex justify-content-between align-content-center pb-2">
                <div className="d-flex align-content-center">
                  <CustomTooltip
                    title={isTop ?
                      i18n.t('notification.cards.tooltip.unpin') :
                      i18n.t('notification.cards.tooltip.pin')}
                  >
                    <button
                      type="button"
                      className={classNames('btn btn-star rounded-pill', {'btn-secondary': !isTop})}
                      onClick={toggleIsTop}
                    >
                      <i className="fas fa-bell fa-fw fa-lg"/>
                    </button>
                  </CustomTooltip>
                  <ContentEditable
                    ellipseOnBlur
                    tag="p"
                    width="240px"
                    maxLength={NotificationCardSchema.title.max}
                    value={values.title}
                    customWrapper={CustomNormalWrapper}
                    onChange={onChangeTitle}
                  />
                </div>
                <div className="select-wrapper border rounded-pill overflow-hidden">
                  <Field
                    name="type"
                    component="select"
                    className="form-control border-0"
                    onChange={onChangeSelectValue(setFieldValue)}
                  >
                    {
                      NotificationCardType.all().filter(type => (
                        (type === NotificationCardType.faceRecognition && isEnableFaceRecognitionKey) ||
                        type === NotificationCardType.motionDetection ||
                        (type === NotificationCardType.humanoidDetection && isEnableHumanoidDetectionKey) ||
                        (type === NotificationCardType.ageGender && isEnableAgeGenderKey) ||
                        type === NotificationCardType.digitalInput
                      )).map(
                        type => {
                          return <option key={type} value={type}>{i18nUtils.getNotificationCardTypeI18N(type)}</option>;
                        }
                      )
                    }
                  </Field>
                </div>
              </div>
              <Tab.Container activeKey={currentTab}>
                <Nav onSelect={setTab}>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="tab-notification-schedule"
                    >
                      {i18n.t('notification.cards.schedule')}
                    </Nav.Link>
                  </Nav.Item>
                  {(values.type === NotificationCardType.faceRecognition || values.type === NotificationCardType.humanoidDetection) && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab-notification-rule"
                      >
                        {i18n.t('notification.cards.rule')}
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      eventKey="tab-notification-subject"
                    >
                      {i18n.t('notification.cards.method')}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className="modal-body">
                  <Tab.Content>
                    <Tab.Pane eventKey="tab-notification-schedule">
                      {/* Schedule settings */}
                      <CardsFormSchedule
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                  <Tab.Content>
                    <Tab.Pane eventKey="tab-notification-rule">
                      {/* Rule settings */}
                      <CardsFormRule
                        values={values}
                        groups={groups}
                        errors={errors}
                        touched={touched}
                        triggerArea={triggerArea}
                        setFieldValue={setFieldValue}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                  <Tab.Content>
                    <Tab.Pane eventKey="tab-notification-subject">
                      {/* Subject settings */}
                      <CardsFormSubject
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        validateField={validateField}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
              <div className="modal-body">
                <div className="form-group">
                  <button
                    disabled={isApiProcessing}
                    type="submit"
                    className="btn btn-primary btn-block rounded-pill"
                  >
                    {cardDetails ?
                      i18n.t('common.button.confirm') :
                      i18n.t('common.button.add')}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-info btn-block m-0 rounded-pill"
                  onClick={hideCardFormModal}
                >
                  {i18n.t('common.button.cancel')}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

CardsForm.propTypes = {
  cardDetails: PropTypes.shape({
    emailAttachmentType: PropTypes.string.isRequired,
    emails: PropTypes.array.isRequired,
    faceRecognitionCondition: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    id: PropTypes.number.isRequired,
    isEnableApp: PropTypes.bool.isRequired,
    isEnableEmail: PropTypes.bool.isRequired,
    isEnableFaceRecognition: PropTypes.bool.isRequired,
    isEnableGPIO: PropTypes.bool.isRequired,
    isEnableGPIO1: PropTypes.bool.isRequired,
    isEnableGPIO2: PropTypes.bool.isRequired,
    isEnableTime: PropTypes.bool.isRequired,
    isEnableSchedule: PropTypes.bool.isRequired,
    isTop: PropTypes.bool.isRequired,
    timePeriods: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    senderSubject: PropTypes.string,
    senderContent: PropTypes.string,
    emailContentPosition: PropTypes.string.isRequired,
    selectedDay: PropTypes.object.isRequired,
    hdIntrusionAreaId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    hdEnabled: PropTypes.bool.isRequired,
    hdOption: PropTypes.string.isRequired,
    hdCapacity: PropTypes.number.isRequired
  }),
  cards: PropTypes.array.isRequired,
  groups: PropTypes.shape(CardsFormRule.propTypes.groups.items).isRequired,
  modelName: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired,
  isShowCardDetailsModal: PropTypes.bool.isRequired,
  hideCardFormModal: PropTypes.func.isRequired,
  isTop: PropTypes.bool.isRequired,
  setIsTop: PropTypes.func.isRequired,
  cardLimitError: PropTypes.func.isRequired,
  authStatus: PropTypes.shape({
    isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
    isEnableAgeGenderKey: PropTypes.bool.isRequired,
    isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
  }).isRequired,
  triggerArea: PropTypes.array.isRequired
};

CardsForm.defaultProps = {cardDetails: null};

export default CardsForm;
