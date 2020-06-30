
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
const _ = require('../../../languages');
const CardsFormSchedule = require('./cards-form-schedule');
const CardsFormRule = require('./cards-form-rule');
const CardsFormSubject = require('./cards-form-subject');
const CustomTooltip = require('../../../core/components/tooltip');

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
        type: PropTypes.string.isRequired
      }),
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string.isRequired
        }).isRequired)
      }).isRequired,
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

  render() {
    const {isApiProcessing,
      groups,
      isShowCardDetailsModal,
      onSubmit,
      cardDetails,
      onHideCardModal,
      isTop,
      toggleIsTop,
      sanitizeInput} = this.props;
    const {isCardTitleOnFocus} = this.state;

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
            const onClickTitleEditButton = event => {
              event.preventDefault();
              this.cardFormTitleRef.current.focus();
            };

            const onChangeTitle = event => {
              if (event.target.value) {
                setFieldValue('title', sanitizeInput(event.target.value));
              }
            };

            return (
              <Form className="modal-content">
                <div className="modal-body d-flex justify-content-between align-content-center pb-2">
                  <div className="d-flex align-content-center">
                    <CustomTooltip title={isTop ? _('Unpin Card') : _('Pin Card')}>
                      <button
                        type="button"
                        className={classNames('btn btn-star rounded-pill', {'btn-secondary': !isTop})}
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
                        <CardsFormRule
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
                      {cardDetails ? _('Confirm') : _('Add')}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-info btn-block m-0 rounded-pill"
                    onClick={onHideCardModal}
                  >
                    {_('Close')}
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
