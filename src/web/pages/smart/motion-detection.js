const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const {Link, getRouter} = require('capybara-router');
const {HotKeys} = require('react-hotkeys');
const MotionDetectionSettingsSchema = require('webserver-form-schema/motion-detection-settings-schema');
const MaskArea = require('../../../core/components/fields/mask-area');
const Slider = require('../../../core/components/fields/slider');
const utils = require('../../../core/utils');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');

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
      {isVisible: Boolean(props.motionDetectionSettings.areas[0])},
      {isVisible: Boolean(props.motionDetectionSettings.areas[1])},
      {isVisible: Boolean(props.motionDetectionSettings.areas[2])},
      {isVisible: Boolean(props.motionDetectionSettings.areas[3])}
    ];
  }

  generateInitialValues = settings => {
    return {...settings};
  };

  generateDeleteMaskAreaHandler = index => () => {
    this.setState(prevState => {
      const maskAreaStates = [...prevState.maskAreaStates];

      maskAreaStates[index].isVisible = false;
      return {maskAreaStates};
    });
  };

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
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  motionDetectionSettingsFormRender = form => {
    const {$isApiProcessing, maskAreaStates} = this.state;
    const {values} = form;
    const maskAreaItems = [0, 1, 2, 3];

    return (
      <Form className="row">
        <div className="col-12">
          <nav>
            <ol className="breadcrumb rounded-pill">
              <li className="breadcrumb-item active">
                <Link to="/analytic/face-recognition">{_('Analytic')}</Link>
              </li>
              <li className="breadcrumb-item">{_('Motion Detection')}</li>
            </ol>
          </nav>
        </div>

        <div className="col-7 pr-24">
          <div ref={this.videoWrapperRef} id="md-video-wrapper" className="video-wrapper">
            <img draggable={false} className="img-fluid" src="/api/snapshot"
              onMouseDown={this.generateVideoWrapperMouseDownHandler(form)}/>
            {
              maskAreaItems.map(index => (
                maskAreaStates[index].isVisible ?
                  <HotKeys key={index} keyMap={{DELETE: ['del', 'backspace']}} handlers={{DELETE: this.generateDeleteMaskAreaHandler(index)}}>
                    <Field rightBottomCornerRef={this.maskAreaRefs[index]} name={`areas.${index}`}
                      component={MaskArea} text={_('Detection Zone')}
                      className="border-green" parentElementId="md-video-wrapper"/>
                  </HotKeys> :
                  <div key={index}/>
              ))
            }
          </div>
        </div>

        <div className="col-5 pl-24">
          <div className="card shadow">
            <div className="card-header">{_('Motion Detection Recognition')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('On/Off')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" type="checkbox" className="custom-control-input" id="switch-motion-detection"/>
                  <label className="custom-control-label" htmlFor="switch-motion-detection">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>

              <hr/>

              <div className={classNames('form-group', values.isEnable ? '' : 'd-none')}>
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Sensitivity')}</label>
                  <span className="text-primary text-size-14">{values.sensibility}</span>
                </div>
                <Field name="sensibility" component={Slider} step={1}
                  min={MotionDetectionSettingsSchema.sensibility.min}
                  max={MotionDetectionSettingsSchema.sensibility.max}/>
              </div>
              <div className={classNames('form-group', values.isEnable ? '' : 'd-none')}>
                <div className="d-flex align-items-center">
                  <label className="mb-0">{_('Detection Zone')}</label>
                  <i className="fas fa-info-circle text-size-14 text-primary pl-2"/>
                </div>
                <span className="text-size-16 text-primary">
                  {_('Up to 4 detection zones')}
                </span>
              </div>

              <button disabled={$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
                {_('Apply')}
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
