const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const {HotKeys} = require('react-hotkeys');
const Base = require('../shared/base');
const MaskArea = require('../../../core/components/fields/mask-area');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

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
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[0])},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[1])},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[2])},
      {isVisible: Boolean(props.privacyMaskSettings.maskAreas[3])}
    ];
  }

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
    const maskAreas = [...form.initialValues.maskAreas];
    const mouseDownEvent = {...event};

    for (let index = 0; index < maskAreaStates.length; index += 1) {
      if (!maskAreaStates[index].isVisible) {
        maskAreaStates[index].isVisible = true;
        maskAreas[index] = position;
        form.resetForm({
          values: {
            ...form.initialValues,
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
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  privacyMaskFormRender = form => {
    const {values} = form;
    const {maskAreaStates} = this.state;
    const maskAreaItems = [0, 1, 2, 3];

    return (
      <Form className="row">
        <div className="col-12">
          <nav>
            <ol className="breadcrumb rounded-pill">
              <li className="breadcrumb-item active">
                <Link to="/media/stream">{_('Multimedia settings')}</Link>
              </li>
              <li className="breadcrumb-item">{_('Privacy mask')}</li>
            </ol>
          </nav>
        </div>

        <div className="col-8 pr-24">
          <div ref={this.videoWrapperRef} id="pm-video-wrapper" className="video-wrapper">
            <img draggable={false} className="img-fluid" src="/api/snapshot"
              onMouseDown={this.generateVideoWrapperMouseDownHandler(form)}/>
            {
              maskAreaItems.map(index => (
                maskAreaStates[index].isVisible ?
                  <HotKeys key={index} keyMap={{DELETE: ['del', 'backspace']}} handlers={{DELETE: this.generateDeleteMaskAreaHandler(index)}}>
                    <Field rightBottomCornerRef={this.maskAreaRefs[index]} name={`maskAreas.${index}`}
                      component={MaskArea} text={_('Mask area')}
                      className="border-green" parentElementId="pm-video-wrapper"/>
                  </HotKeys> :
                  <div key={index}/>
              ))
            }
          </div>
        </div>

        <div className="col-4 pl-24">
          <div className="card shadow">
            <div className="card-header">{_('Privacy mask')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Function')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-function"/>
                  <label className="custom-control-label" htmlFor="switch-function">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>{_('Mask area')}</label> <i className="fas fa-info-circle text-primary ml-2"/>
                <span className="form-text text-primary">{_('1. Please drag a mask area.')}</span>
                <span className="form-text text-primary">{_('2. The mask area limit is 4. To drag for creating, delete to remove.')}</span>
              </div>
              <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
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
