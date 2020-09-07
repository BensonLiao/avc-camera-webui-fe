const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const ConfidenceLevel = require('webserver-form-schema/constants/face-recognition-confidence-level');
const MaskArea = require('../../../core/components/fields/mask-area');
const api = require('../../../core/apis/web-api');
const _ = require('../../../languages');
const Base = require('../shared/base');
const CustomTooltip = require('../../../core/components/tooltip');
module.exports = class FaceRecognition extends Base {
  static get propTypes() {
    return {
      faceRecognitionSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        isShowMember: PropTypes.bool.isRequired,
        isShowGroup: PropTypes.bool.isRequired,
        isShowUnknown: PropTypes.bool.isRequired,
        isShowFake: PropTypes.bool.isRequired,
        triggerArea: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired
        }).isRequired,
        isEnableFaceFrame: PropTypes.bool.isRequired,
        faceFrame: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired
        }).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    // Show or hide trigger area
    this.state.isShowDetectionZone = true;
  }

  onToggleDetectionZone = () => {
    this.setState(prevState => ({isShowDetectionZone: !prevState.isShowDetectionZone}));
  }

  onSubmitFaceRecognitionSettingsForm = (values, faceRecognitionSettings) => {
    progress.start();

    const createPromises = () => {
      let promises = [];

      if (values.isEnable !== faceRecognitionSettings.isEnable) {
        promises.push(api.smartFunction.updateFRSetting(values));
      }

      if (values.isEnableSpoofing !== faceRecognitionSettings.isEnableSpoofing) {
        promises.push(api.smartFunction.updateFRSpoofing(values));
      }

      if (values.confidenceLevel !== faceRecognitionSettings.confidenceLevel) {
        promises.push(api.smartFunction.updateFRConfidenceLevel(values));
      }

      if (
        values.isShowMember !== faceRecognitionSettings.isShowMember ||
        values.isShowGroup !== faceRecognitionSettings.isShowGroup ||
        values.isShowUnknown !== faceRecognitionSettings.isShowUnknown ||
        values.isShowFake !== faceRecognitionSettings.isShowFake
      ) {
        promises.push(api.smartFunction.updateFREnrollDisplaySetting({
          ...values,
          isShowMember: values.isShowMember,
          isShowGroup: values.isShowGroup,
          isShowUnknown: values.isShowUnknown,
          isShowFake: values.isShowFake
        }));
      }

      if (
        values.triggerArea !== faceRecognitionSettings.triggerArea ||
        values.isEnableFaceFrame !== faceRecognitionSettings.isEnableFaceFrame ||
        values.faceFrame !== faceRecognitionSettings.faceFrame
      ) {
        promises.push(api.smartFunction.updateFRROI({
          ...values,
          triggerArea: values.triggerArea
        }));
      }

      return promises;
    };

    Promise.all(createPromises())
      .then(getRouter().reload)
      .finally(progress.done);
  }

  faceRecognitionSettingsFormRender = form => {
    const {faceRecognitionSettings: {isEnable}} = this.props;
    const {$isApiProcessing, isShowDetectionZone} = this.state;
    const {values, setFieldValue} = form;

    return (
      <>
        <div className="col-7 pl-3 pr-0">
          <div id="fr-video-wrapper" className="video-wrapper">
            <img className="img-fluid" draggable={false} src="/api/snapshot"/>
            {
              isShowDetectionZone && (
                <div className="draggable-wrapper" tabIndex={-1}>
                  <Field
                    name="triggerArea"
                    component={MaskArea}
                    text={_('Detection Zone')}
                    className="bounding-black"
                    parentElementId="fr-video-wrapper"
                  />
                </div>
              )
            }
            {
              values.isEnableFaceFrame && (
                <div className="draggable-wrapper" tabIndex={-1}>
                  <Field
                    name="faceFrame"
                    component={MaskArea}
                    text={_('Facial Detection Size')}
                    className="bounding-primary"
                    parentElementId="fr-video-wrapper"
                  />
                </div>
              )
            }
          </div>
        </div>
        <div className="col-5 pl-4 pr-0">
          <div className="card shadow">
            <div className="card-header">{_('Facial Recognition')}</div>
            <Form className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('On/Off')}</label>
                <div className="custom-control custom-switch">
                  <Field
                    name="isEnable"
                    type="checkbox"
                    checked={values.isEnable}
                    className="custom-control-input"
                    id="switch-face-recognition"
                  />
                  <label className="custom-control-label" htmlFor="switch-face-recognition">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              { isEnable && (
                <div className="form-group">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="mb-0">{_('Photo Spoofing')}</label>
                        <div className="custom-control custom-switch">
                          <Field
                            name="isEnableSpoofing"
                            type="checkbox"
                            checked={values.isEnableSpoofing}
                            className="custom-control-input"
                            id="switch-face-recognition-spoofing"
                          />
                          <label className="custom-control-label" htmlFor="switch-face-recognition-spoofing">
                            <span>{_('ON')}</span>
                            <span>{_('OFF')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0">{_('Level of Accuracy')}</label>
                        <div className="btn-group">
                          {ConfidenceLevel.all().map(confidenceLevel => (
                            <button
                              key={confidenceLevel}
                              type="button"
                              className={classNames(
                                'btn triple-wrapper btn-sm outline-success px-2 py-1',
                                {active: values.confidenceLevel === confidenceLevel}
                              )}
                              onClick={() => setFieldValue('confidenceLevel', confidenceLevel)}
                            >
                              {_(`confidence-level-${confidenceLevel}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <hr/>

              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <label className="mb-0">{_('Detection Zone')}</label>
                    <i className="fas fa-info-circle text-size-14 text-primary pl-2"/>
                  </div>
                  <CustomTooltip title={_('Show/Hide Detection Zone')}>
                    <div className="custom-control custom-switch">
                      <a
                        className="form-control-feedback text-muted"
                        tabIndex={-1}
                        onClick={this.onToggleDetectionZone}
                      >
                        <i className={classNames('fas', isShowDetectionZone ? 'fa-eye' : 'fa-eye-slash')}/>
                      </a>
                    </div>
                  </CustomTooltip>
                </div>
                <span className="text-size-16 text-primary">
                  {_('Default is Fullscreen')}
                </span>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Facial Detection Size')}</label>
                <div className="custom-control custom-switch">
                  <Field
                    name="isEnableFaceFrame"
                    type="checkbox"
                    checked={values.isEnableFaceFrame}
                    className="custom-control-input"
                    id="switch-face-size"
                  />
                  <label className="custom-control-label" htmlFor="switch-face-size">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>

              <hr/>

              <div className="form-group">
                <div className="form-check mb-3">
                  <Field
                    name="isShowMember"
                    checked={values.isShowMember}
                    className="form-check-input"
                    type="checkbox"
                    id="input-show-all"
                  />
                  <label className="form-check-label" htmlFor="input-show-all">{_('Display Name')}</label>
                </div>
                <div className="form-check mb-3">
                  <Field
                    name="isShowGroup"
                    checked={values.isShowGroup}
                    className="form-check-input"
                    type="checkbox"
                    id="input-show-register-group"
                  />
                  <label className="form-check-label" htmlFor="input-show-register-group">{_('Display Group')}</label>
                </div>
                <div className="form-check mb-3">
                  <Field
                    name="isShowUnknown"
                    checked={values.isShowUnknown}
                    className="form-check-input"
                    type="checkbox"
                    id="input-show-unknown-personal"
                  />
                  <label className="form-check-label" htmlFor="input-show-unknown-personal">{_('Display "Unknown"')}</label>
                </div>
                <div className="form-check">
                  <Field
                    name="isShowFake"
                    checked={values.isShowFake}
                    className="form-check-input"
                    type="checkbox"
                    id="input-show-fake"
                  />
                  <label className="form-check-label" htmlFor="input-show-fake">{_('Display "Fake"')}</label>
                </div>
              </div>

              <button disabled={$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                {_('Apply')}
              </button>
            </Form>
          </div>
        </div>
      </>
    );
  };

  render() {
    const initialValues = this.props.faceRecognitionSettings;

    return (
      <div className="page-smart">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <nav>
                <ol className="breadcrumb rounded-pill">
                  <li className="breadcrumb-item active">
                    <Link to="/analytic/face-recognition">{_('Analytic')}</Link>
                  </li>
                  <li className="breadcrumb-item">{_('Facial Recognition')}</li>
                </ol>
              </nav>
            </div>

            <Formik
              initialValues={initialValues}
              onSubmit={values => this.onSubmitFaceRecognitionSettingsForm(values, initialValues)}
            >
              {this.faceRecognitionSettingsFormRender}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
