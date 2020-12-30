import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import Modal from 'react-bootstrap/Modal';
import {Nav, Tab} from 'react-bootstrap';
import NotificationCardSchema from 'webserver-form-schema/notification-card-schema';
import NotificationCardType from 'webserver-form-schema/constants/notification-card-type';
import NotificationEmailAttachmentType from 'webserver-form-schema/constants/notification-email-attachment-type';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import sanitizeHtml from 'sanitize-html';
import api from '../../../core/apis/web-api';
import CardsFormRule from './cards-form-rule';
import CardsFormSchedule from './cards-form-schedule';
import CardsFormSubject from './cards-form-subject';
import ContentEditable from '@benson.liao/react-content-editable';
import CustomTooltip from '../../../core/components/tooltip';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import {NOTIFY_CARDS_MAX} from '../../../core/constants';
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
  modelName
}) => {
  const defaultSubject = {
    faceRecognition: i18n.t('notification.cards.defaultSubjectFR', {0: modelName}),
    motionDetection: i18n.t('notification.cards.defaultSubjectMD', {0: modelName}),
    digitalInput: i18n.t('notification.cards.defaultSubjectDI', {0: modelName})
  };

  const generateCardInitialValues = card => {
    if (card) {
      return {
        id: card.id,
        type: card.type,
        title: card.title,
        isTop: card.isTop,
        isEnableTime: card.isEnableTime,
        $start: null,
        $end: null,
        timePeriods: card.timePeriods,
        $groups: card.groups.length > 0 ? card.groups[0] : '',
        faceRecognitionCondition: card.faceRecognitionCondition,
        isEnableGPIO: card.isEnableGPIO,
        isEnableGPIO1: card.isEnableGPIO1,
        isEnableGPIO2: card.isEnableGPIO2,
        isEnableEmail: card.isEnableEmail,
        $email: '',
        emails: card.emails,
        emailAttachmentType: card.emailAttachmentType,
        senderSubject: card.senderSubject || defaultSubjectTitle(card.type),
        senderContent: card.senderContent,
        emailContentPosition: card.emailContentPosition,
        isEnableFaceRecognition: card.isEnableFaceRecognition,
        isEnableApp: card.isEnableApp
      };
    }

    return {
      type: NotificationCardType.faceRecognition,
      title: i18n.t('notification.cards.defaultCardTitle'),
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
      senderSubject: i18n.t('notification.cards.defaultSubjectFR', {0: modelName}),
      senderContent: '',
      emailContentPosition: 0,
      isEnableFaceRecognition: false,
      isEnableApp: false
    };
  };

  const onChangeCardForm = ({nextValues, prevValues, formik}) => {
    if (prevValues.type !== nextValues.type && !(cardDetails && cardDetails.senderSubject)) {
      defaultSubjectTitle(nextValues.type, formik);
    }
  };

  const defaultSubjectTitle = (type, formik = null) => {
    switch (type) {
      case '0':
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.faceRecognition) : defaultSubject.faceRecognition;
      case '3':
        return formik ? formik.setFieldValue('senderSubject', defaultSubject.motionDetection) : defaultSubject.motionDetection;
      case '5':
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
                    title={i18n.t(isTop ?
                      'notification.cards.tooltip.unpin' :
                      'notification.cards.tooltip.pin')}
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
                  <Field name="type" component="select" className="form-control border-0">
                    {
                      NotificationCardType.all().filter(type => (
                        type === NotificationCardType.faceRecognition ||
                        type === NotificationCardType.motionDetection ||
                        type === NotificationCardType.digitalInput
                      )).map(
                        type => {
                          return <option key={type} value={type}>{utils.getNotificationCardTypeI18N(type)}</option>;
                        }
                      )
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
                      {i18n.t('notification.cards.schedule')}
                    </Nav.Link>
                  </Nav.Item>
                  {values.type === NotificationCardType.faceRecognition && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab-notification-condition"
                      >
                        {i18n.t('notification.cards.rule')}
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      eventKey="tab-notification-target"
                    >
                      {i18n.t('notification.cards.method')}
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
                      <CardsFormRule
                        faceRecognitionCondition={values.faceRecognitionCondition}
                        isEnableFaceRecognition={values.isEnableFaceRecognition}
                        groups={groups}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                  <Tab.Content>
                    <Tab.Pane eventKey="tab-notification-target">
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
                    {i18n.t(cardDetails ?
                      'common.button.confirm' :
                      'common.button.add')}
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
    isTop: PropTypes.bool.isRequired,
    timePeriods: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    senderSubject: PropTypes.string,
    senderContent: PropTypes.string,
    emailContentPosition: PropTypes.string.isRequired
  }),
  cards: PropTypes.array.isRequired,
  groups: PropTypes.shape(CardsFormRule.propTypes.groups.items).isRequired,
  modelName: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired,
  isShowCardDetailsModal: PropTypes.bool.isRequired,
  hideCardFormModal: PropTypes.func.isRequired,
  isTop: PropTypes.bool.isRequired,
  setIsTop: PropTypes.func.isRequired,
  cardLimitError: PropTypes.func.isRequired
};

CardsForm.defaultProps = {cardDetails: null};

export default CardsForm;
