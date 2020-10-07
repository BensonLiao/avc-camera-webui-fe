const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const iconHotkeyBackspace = require('../../../resource/hotkey-backspace-32px.svg');
const iconHotkeyDeleted = require('../../../resource/hotkey-delete-32px.svg');
const iconCursor = require('../../../resource/cursor-24px.svg');
const MotionDetectionSettingsSchema = require('webserver-form-schema/motion-detection-settings-schema');
const MaskArea = require('../../../core/components/fields/mask-area');
const Slider = require('../../../core/components/fields/slider');
const Base = require('../shared/base');
const {default: i18n} = require('../../i18n');
const api = require('../../../core/apis/web-api');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class MotionDetection extends Base {
  static get propTypes() {
    return {
      motionDetectionSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        sensibility: PropTypes.number.isRequired,
        areas: PropTypes.arrayOf(PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired
        }).isRequired).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.videoWrapperRef = React.createRef();
    this.maskAreaRefs = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];
    this.state.maskAreaStates = [
      {isVisible: Boolean(props.motionDetectionSettings.areas[0]) && this.props.motionDetectionSettings.isEnable},
      {isVisible: Boolean(props.motionDetectionSettings.areas[1]) && this.props.motionDetectionSettings.isEnable},
      {isVisible: Boolean(props.motionDetectionSettings.areas[2]) && this.props.motionDetectionSettings.isEnable},
      {isVisible: Boolean(props.motionDetectionSettings.areas[3]) && this.props.motionDetectionSettings.isEnable}
    ];
  }

  generateInitialValues = settings => {
    return {...settings};
  };

  generateDeleteMaskAreaHandler = index => event => {
    // Delete if backspace or delete key is detected
    if (event.keyCode === 8 || event.keyCode === 46) {
      this.setState(prevState => {
        const maskAreaStates = [...prevState.maskAreaStates];
        maskAreaStates[index].isVisible = false;
        return {maskAreaStates};
      });
    }
  }

  generateVideoWrapperMouseDownHandler = form => event => {
    const width = this.videoWrapperRef.current.offsetWidth;
    const height = this.videoWrapperRef.current.offsetHeight;
    const rect = this.videoWrapperRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((event.clientX - rect.left) / width * 100),
      y: Math.round((event.clientY - rect.top) / height * 100),
      width: 1,
      height: 1
    };
    const maskAreaStates = [...this.state.maskAreaStates];
    const maskAreas = [...form.initialValues.areas];
    const mouseDownEvent = {...event};

    for (let index = 0; index < maskAreaStates.length; index += 1) {
      if (!maskAreaStates[index].isVisible) {
        maskAreaStates[index].isVisible = true;
        maskAreas[index] = position;
        form.resetForm({
          values: {
            ...form.initialValues,
            isEnable: form.values.isEnable,
            areas: maskAreas
          }
        });
        this.setState({maskAreaStates});

        setTimeout(() => {
          for (let maskAreaIndex = 0; maskAreaIndex < maskAreaStates.length; maskAreaIndex += 1) {
            // Recover other areas.
            if (maskAreaIndex !== index) {
              form.setFieldValue(`areas.${maskAreaIndex}`, form.values.areas[maskAreaIndex]);
            }
          }

          this.maskAreaRefs[index].current.dispatchEvent(
            new MouseEvent('mousedown', mouseDownEvent)
          );
        });
        return;
      }
    }
  };

  onSubmitMotionDetectionSettingsForm = values => {
    progress.start();
    api.smartFunction.updateMotionDetectionSettings({
      isEnable: values.isEnable,
      sensibility: values.sensibility,
      areas: (() => {
        const result = [];

        this.state.maskAreaStates.forEach((state, index) => {
          if (state.isVisible) {
            result.push(values.areas[index]);
          }
        });
        return result;
      })()
    })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  motionDetectionSettingsFormRender = form => {
    const {$isApiProcessing, maskAreaStates} = this.state;
    const {values} = form;
    const maskAreaItems = [0, 1, 2, 3];

    return (
      <Form className="row">
        <BreadCrumb
          path={[i18n.t('Analytic'), i18n.t('Motion Detection')]}
          routes={['/analytic/face-recognition']}
        />
        <div className="col-7 pl-3 pr-0">
          <div ref={this.videoWrapperRef} id="md-video-wrapper" className="video-wrapper">
            <img
              className="img-fluid"
              draggable={false}
              src="/api/snapshot"
              onMouseDown={this.generateVideoWrapperMouseDownHandler(form)}
            />
            {
              maskAreaItems.map(index => (
                maskAreaStates[index].isVisible ? (
                  <div key={index} className="draggable-wrapper" tabIndex={-1} onKeyDown={this.generateDeleteMaskAreaHandler(index)}>
                    <Field
                      rightBottomCornerRef={this.maskAreaRefs[index]}
                      name={`areas.${index}`}
                      component={MaskArea}
                      text={i18n.t('Detection Zone')}
                      className="bounding-primary"
                      parentElementId="md-video-wrapper"
                    />
                  </div>
                ) :
                  <div key={index}/>
              ))
            }
          </div>
        </div>

        <div className="col-5 pl-4 pr-0">
          <div className="card shadow">
            <div className="card-header">{i18n.t('Motion Detection')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{i18n.t('On/Off')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" type="checkbox" className="custom-control-input" id="switch-motion-detection"/>
                  <label className="custom-control-label" htmlFor="switch-motion-detection">
                    <span>{i18n.t('ON')}</span>
                    <span>{i18n.t('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="form-group mb-3">
                <span className="form-text text-primary">{i18n.t('Please Drag a Detection Zone Area.')}</span>
              </div>

              <hr/>

              <div className={classNames('form-group', values.isEnable ? '' : 'd-none')}>
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('Sensitivity')}</label>
                  <span className="text-primary text-size-14">{values.sensibility}</span>
                </div>
                <Field
                  name="sensibility"
                  component={Slider}
                  step={1}
                  min={MotionDetectionSettingsSchema.sensibility.min}
                  max={MotionDetectionSettingsSchema.sensibility.max}
                />
              </div>
              <div className="form-group">
                <div className="card-header l-24 light text-size-18">{i18n.t('Note Area')}</div>
                <div className="card-body l-32 light px-3 py-3">
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{i18n.t('Set a Zone.')}</span>
                    <div className="d-flex align-items-center drag-icon">
                      <img src={iconCursor}/>
                      <span className="text-size-12">{i18n.t('Drag')}</span>
                    </div>
                  </div>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{i18n.t('Erase a Zone.')}</span>
                    <div className="d-flex justify-content-end align-items-center flex-wrap">
                      <img src={iconHotkeyBackspace}/>
                      <span className="font-italic text-size-14 mx-2">{i18n.t('or')}</span>
                      <img src={iconHotkeyDeleted}/>
                    </div>
                  </div>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{i18n.t('Up to 4 Zone Areas.')}</span>
                  </div>
                </div>
              </div>

              <button disabled={$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
                {i18n.t('Apply')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {motionDetectionSettings} = this.props;

    return (
      <div className="page-smart">
        <div className="container-fluid">
          <Formik
            initialValues={this.generateInitialValues(motionDetectionSettings)}
            onSubmit={this.onSubmitMotionDetectionSettingsForm}
          >
            {this.motionDetectionSettingsFormRender}
          </Formik>
        </div>
      </div>
    );
  }
};
