
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const React = require('react');
const NotificationCardSchema = require('webserver-form-schema/notification-card-schema');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const i18n = require('../../../i18n').default;
const CardsFormSchedule = require('./cards-form-schedule');
const CardsFormRule = require('./cards-form-rule');
const CardsFormSubject = require('./cards-form-subject');
const CustomTooltip = require('../../../core/components/tooltip');
const FormikEffect = require('../../../core/components/formik-effect');
const ContentEditable = require('@benson.liao/react-content-editable').default;

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

module.exports = class CardsForm extends React.PureComponent {
  static get propTypes() {
    return {
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
      groups: PropTypes.shape(CardsFormRule.propTypes.groups.items).isRequired,
      modelName: PropTypes.string.isRequired,
      isApiProcessing: PropTypes.bool.isRequired,
      isShowCardDetailsModal: PropTypes.bool.isRequired,
      isTop: PropTypes.bool.isRequired,
      toggleIsTop: PropTypes.func.isRequired,
      sanitizeInput: PropTypes.func.isRequired,
      onHideCardModal: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {cardDetails: null};
  }

  constructor(props) {
    super(props);
    this.cardFormTitleRef = React.createRef();
    const {modelName} = props;
    this.defaultSubject = {
      faceRecognition: `${i18n.t('Face Recognition Event [{{0}}]', {0: modelName})}`,
      motionDetection: `${i18n.t('Motion Detection Event [{{0}}]', {0: modelName})}`,
      digitalInput: `${i18n.t('Digital Input Event [{{0}}]', {0: modelName})}`
    };
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
        timePeriods: card.timePeriods.map(x => ({
          ...x,
          id: Math.random().toString(36).substr(2)
        })),
        $groups: card.groups.length > 0 ? card.groups[0] : '',
        faceRecognitionCondition: card.faceRecognitionCondition,
        isEnableGPIO: card.isEnableGPIO,
        isEnableGPIO1: card.isEnableGPIO1,
        isEnableGPIO2: card.isEnableGPIO2,
        isEnableEmail: card.isEnableEmail,
        $email: '',
        emails: card.emails,
        emailAttachmentType: card.emailAttachmentType,
        senderSubject: card.senderSubject || this.defaultSubjectTitle(card.type),
        senderContent: card.senderContent,
        emailContentPosition: card.emailContentPosition,
        isEnableFaceRecognition: card.isEnableFaceRecognition,
        isEnableApp: card.isEnableApp
      };
    }

    return {
      type: NotificationCardType.faceRecognition,
      title: i18n.t('Enter card title'),
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
      senderSubject: `${i18n.t('Face Recognition Event [{{0}}]', {0: this.props.modelName})}`,
      senderContent: '',
      emailContentPosition: 0,
      isEnableFaceRecognition: false,
      isEnableApp: false
    };
  };

  onChangeCardForm = ({nextValues, prevValues, formik}) => {
    if (prevValues.type !== nextValues.type && !(this.props.cardDetails && this.props.cardDetails.senderSubject)) {
      this.defaultSubjectTitle(nextValues.type, formik);
    }
  }

  defaultSubjectTitle = (type, formik = null) => {
    switch (type) {
      case '0':
        return formik ? formik.setFieldValue('senderSubject', this.defaultSubject.faceRecognition) : this.defaultSubject.faceRecognition;
      case '3':
        return formik ? formik.setFieldValue('senderSubject', this.defaultSubject.motionDetection) : this.defaultSubject.motionDetection;
      case '5':
        return formik ? formik.setFieldValue('senderSubject', this.defaultSubject.digitalInput) : this.defaultSubject.digitalInput;
      default:
        break;
    }
  }

  render() {
    const {
      isApiProcessing,
      groups,
      isShowCardDetailsModal,
      onSubmit,
      cardDetails,
      onHideCardModal,
      isTop,
      toggleIsTop,
      sanitizeInput
    } = this.props;
    return (
      <Modal
        autoFocus={false}
        show={isShowCardDetailsModal}
        className="notification-card"
        dialogClassName="modal-600"
        onHide={onHideCardModal}
      >
        <Formik
          initialValues={this.generateCardInitialValues(cardDetails)}
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
                <FormikEffect onChange={this.onChangeCardForm}/>
                <div className="modal-body d-flex justify-content-between align-content-center pb-2">
                  <div className="d-flex align-content-center">
                    <CustomTooltip title={isTop ? i18n.t('Unpin Card') : i18n.t('Pin this card')}>
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
                      innerRef={this.cardFormTitleRef}
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
                          type === '0' || type === '3' || type === '5'
                        )).map(
                          type => {
                            return <option key={type} value={type}>{i18n.t(`notification-card-${type}`)}</option>;
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
                        {i18n.t('Schedule')}
                      </Nav.Link>
                    </Nav.Item>
                    {values.type === NotificationCardType.faceRecognition && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-notification-condition"
                        >
                          {i18n.t('Rule')}
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab-notification-target"
                      >
                        {i18n.t('Method')}
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
                      {cardDetails ? i18n.t('Confirm') : i18n.t('Add')}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-info btn-block m-0 rounded-pill"
                    onClick={onHideCardModal}
                  >
                    {i18n.t('Close')}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
};
