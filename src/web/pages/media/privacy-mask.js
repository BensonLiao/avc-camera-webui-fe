const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const iconHotkeyBackspace = require('../../../resource/hotkey-backspace-32px.svg');
const iconHotkeyDeleted = require('../../../resource/hotkey-delete-32px.svg');
const iconCursor = require('../../../resource/cursor-24px.svg');
const Base = require('../shared/base');
const MaskArea = require('../../../core/components/fields/mask-area');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

module.exports = class PrivacyMask extends Base {
  static get propTypes() {
    return {
      privacyMaskSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        maskAreas: PropTypes.arrayOf(PropTypes.shape({
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
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[0]) && this.props.privacyMaskSettings.isEnable},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[1]) && this.props.privacyMaskSettings.isEnable},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[2]) && this.props.privacyMaskSettings.isEnable},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[3]) && this.props.privacyMaskSettings.isEnable}
    ];
  }

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
    const maskAreas = [...form.initialValues.maskAreas];
    const mouseDownEvent = {...event};

    for (let index = 0; index < maskAreaStates.length; index += 1) {
      if (!maskAreaStates[index].isVisible) {
        maskAreaStates[index].isVisible = true;
        maskAreas[index] = position;
        form.resetForm({
          values: {
            ...form.initialValues,
            isEnable: form.values.isEnable,
            maskAreas
          }
        });
        this.setState({maskAreaStates});

        setTimeout(() => {
          for (let maskAreaIndex = 0; maskAreaIndex < maskAreaStates.length; maskAreaIndex += 1) {
            // Recover other areas.
            if (maskAreaIndex !== index) {
              form.setFieldValue(`maskAreas.${maskAreaIndex}`, form.values.maskAreas[maskAreaIndex]);
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

  onSubmitPrivacyMaskForm = values => {
    progress.start();
    api.multimedia.updatePrivacyMaskSettings({
      isEnable: values.isEnable,
      maskAreas: (() => {
        const result = [];

        this.state.maskAreaStates.forEach((state, index) => {
          if (state.isVisible) {
            result.push(values.maskAreas[index]);
          }
        });
        return result;
      })()
    })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  privacyMaskFormRender = form => {
    const {values} = form;
    const {maskAreaStates} = this.state;
    const maskAreaItems = [0, 1, 2, 3];

    return (
      <Form className="row">
        <BreadCrumb
          className="px-0"
          path={[_('Video'), _('Privacy Mask')]}
          routes={['/media/stream']}
        />
        <div className="col-7 px-0">
          <div ref={this.videoWrapperRef} id="pm-video-wrapper" className="video-wrapper">
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
                      name={`maskAreas.${index}`}
                      component={MaskArea}
                      text={_('Mask Area')}
                      className="bounding-primary"
                      parentElementId="pm-video-wrapper"
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
            <div className="card-header">{_('Privacy Mask')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('On/Off')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-function"/>
                  <label className="custom-control-label" htmlFor="switch-function">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="form-group mb-5">
                <span className="form-text text-primary">{_('Drag a Mask Area.')}</span>
              </div>
              <div className="form-group">
                <div className="card-header l-24 light text-size-18">{_('Note Area')}</div>
                <div className="card-body l-32 light px-3 py-3">
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{_('Set a Mask.')}</span>
                    <div className="d-flex align-items-center drag-icon">
                      <img src={iconCursor}/>
                      <span className="text-size-12">{_('Drag')}</span>
                    </div>
                  </div>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{_('Erase a Mask.')}</span>
                    <div className="d-flex justify-content-end align-items-center flex-wrap">
                      <img src={iconHotkeyBackspace}/>
                      <span className="font-italic text-size-14 mx-2">{_('or')}</span>
                      <img src={iconHotkeyDeleted}/>
                    </div>
                  </div>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="font-italic text-size-14">•{_('Up to 4 Mask Areas.')}</span>
                  </div>
                </div>
              </div>
              <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                {_('Apply')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {privacyMaskSettings} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <Formik
              initialValues={privacyMaskSettings}
              onSubmit={this.onSubmitPrivacyMaskForm}
            >
              {this.privacyMaskFormRender}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
