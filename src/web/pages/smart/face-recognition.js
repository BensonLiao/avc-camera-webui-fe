const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const ConfidenceLevel = require('webserver-form-schema/constants/face-recognition-confidence-level');
const MaskArea = require('../../../core/components/fields/mask-area');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class FaceRecognition extends Base {
  static get propTypes() {
    return {
      faceRecognitionSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        isShowMember: PropTypes.bool.isRequired,
        isShowGroup: PropTypes.bool.isRequired,
        isShowUnknown: PropTypes.bool.isRequired,
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

  generateInitialValues = faceRecognitionSettings => {
    return {
      ...faceRecognitionSettings,
      isEnableTriggerArea: (() => {
        const {triggerArea} = faceRecognitionSettings;

        return !(triggerArea.x === 0 && triggerArea.y === 0 && triggerArea.width === 100 && triggerArea.height === 100);
      })(),
      isEnableRecognitionInformation:
        faceRecognitionSettings.isShowMember ||
        faceRecognitionSettings.isShowGroup ||
        faceRecognitionSettings.isShowUnknown
    };
  };

  onSubmitFaceRecognitionSettingsForm = values => {
    // Todo: not implemented
    console.log(values);
  };

  faceRecognitionSettingsFormRender = form => {
    const {values, setFieldValue} = form;

    return (
      <>
        <div className="col-7 pr-24">
          <p>{JSON.stringify(values.faceFrame)}</p>{/* Todo: debug code */}
          <div id="fr-video-wrapper" className="video-wrapper">
            <img className="img-fluid" src="https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"/>
            <div className="draggable-cover border-black" style={{left: 0, top: 0, width: '100%', height: '100%'}}>
              <p className="description text-size-20">{_('Trigger area')}</p>
              <div className="left-top-point"/>
              <div className="left-bottom-point"/>
              <div className="right-top-point"/>
              <div className="right-bottom-point"/>
            </div>
            <Field name="faceFrame" component={MaskArea} parentElementId="fr-video-wrapper" text={_('Face size')}/>
          </div>
        </div>

        <div className="col-5 pl-24">
          <div className="card shadow">
            <div className="card-header">{_('Face recognition')}</div>
            <Form className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Recognition function')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" type="checkbox" checked={values.isEnable} className="custom-control-input" id="switch-face-recognition"/>
                  <label className="custom-control-label" htmlFor="switch-face-recognition">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Similarity level')}</label>
                <div className="btn-group">
                  <button type="button"
                    className={classNames('btn btn-sm btn-outline-success', {active: values.confidenceLevel === ConfidenceLevel.low})}
                    onClick={() => setFieldValue('confidenceLevel', ConfidenceLevel.low)}
                  >
                    {_(`confidence-level-${ConfidenceLevel.low}`)}
                  </button>
                  <button type="button"
                    className={classNames('btn btn-sm btn-outline-success', {active: values.confidenceLevel === ConfidenceLevel.medium})}
                    onClick={() => setFieldValue('confidenceLevel', ConfidenceLevel.medium)}
                  >
                    {_(`confidence-level-${ConfidenceLevel.medium}`)}
                  </button>
                  <button type="button"
                    className={classNames('btn btn-sm btn-outline-success', {active: values.confidenceLevel === ConfidenceLevel.high})}
                    onClick={() => setFieldValue('confidenceLevel', ConfidenceLevel.high)}
                  >
                    {_(`confidence-level-${ConfidenceLevel.high}`)}
                  </button>
                </div>
              </div>

              <hr/>

              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <label className="mb-0">{_('Trigger area')}</label>
                    <i className="fas fa-info-circle text-size-14 text-primary pl-2"/>
                  </div>
                  <div className="custom-control custom-switch">
                    <Field name="isEnableTriggerArea" type="checkbox" checked={values.isEnableTriggerArea} className="custom-control-input" id="switch-trigger-area"/>
                    <label className="custom-control-label" htmlFor="switch-trigger-area">
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </div>
                <span className="text-size-16 text-primary">
                  {_('The default is full screen, it is changeable.')}
                </span>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Face size')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnableFaceFrame" type="checkbox" checked={values.isEnableFaceFrame} className="custom-control-input" id="switch-face-size"/>
                  <label className="custom-control-label" htmlFor="switch-face-size">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>

              <hr/>

              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Display recognition name')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnableRecognitionInformation" type="checkbox" checked={values.isEnableRecognitionInformation} className="custom-control-input" id="switch-show-name"/>
                  <label className="custom-control-label" htmlFor="switch-show-name">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              {
                values.isEnableRecognitionInformation && (
                  <div className="form-group">
                    <div className="form-check mb-3">
                      <Field name="isShowMember" checked={values.isShowMember} className="form-check-input" type="checkbox" id="input-show-all"/>
                      <label className="form-check-label" htmlFor="input-show-all">{_('Display name')}</label>
                    </div>
                    <div className="form-check mb-3">
                      <Field name="isShowGroup" checked={values.isShowGroup} className="form-check-input" type="checkbox" id="input-show-register-group"/>
                      <label className="form-check-label" htmlFor="input-show-register-group">{_('Display group')}</label>
                    </div>
                    <div className="form-check">
                      <Field name="isShowUnknown" checked={values.isShowUnknown} className="form-check-input" type="checkbox" id="input-show-unknown-personal"/>
                      <label className="form-check-label" htmlFor="input-show-unknown-personal">{_('Display "Unknown"')}</label>
                    </div>
                  </div>
                )
              }

              <button type="submit" className="btn btn-block btn-primary rounded-pill">
                {_('Apply')}
              </button>
            </Form>
          </div>
        </div>
      </>
    );
  };

  render() {
    const initialValues = this.generateInitialValues(this.props.faceRecognitionSettings);

    return (
      <div className="page-smart">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <nav>
                <ol className="breadcrumb rounded-pill">
                  <li className="breadcrumb-item active">
                    <Link to="/smart/face-recognition">{_('Smart functions')}</Link>
                  </li>
                  <li className="breadcrumb-item">{_('Face recognition')}</li>
                </ol>
              </nav>
            </div>

            <Formik
              initialValues={initialValues}
              onSubmit={this.onSubmitFaceRecognitionSettingsForm}
            >
              {this.faceRecognitionSettingsFormRender}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
