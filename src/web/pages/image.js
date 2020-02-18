const axios = require('axios');
const download = require('downloadjs');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const videoFocusSettingsSchema = require('webserver-form-schema/video-focus-settings-schema');
const defaultVideoBackground = require('../../resource/video-bg.jpg');
const Base = require('./shared/base');
const _ = require('../../languages');
const utils = require('../../core/utils');
const api = require('../../core/apis/web-api');
const Slider = require('../../core/components/fields/slider');
const Dropdown = require('../../core/components/fields/dropdown');
const FormikEffect = require('../../core/components/formik-effect');

module.exports = class Home extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es']).isRequired,
        deviceName: PropTypes.string.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        usedDiskSize: PropTypes.number.isRequired,
        totalDiskSize: PropTypes.number.isRequired
      }).isRequired,
      videoSettings: PropTypes.shape({
        defoggingEnabled: PropTypes.bool.isRequired, // 除霧
        irEnabled: PropTypes.bool.isRequired, // 紅外線燈
        brightness: PropTypes.number.isRequired, // 亮度
        contrast: PropTypes.number.isRequired, // 對比
        hdrEnabled: PropTypes.oneOf(videoSettingsSchema.hdrEnabled.enum).isRequired, // HDR
        shutterSpeed: PropTypes.oneOf(videoSettingsSchema.shutterSpeed.enum).isRequired, // 快門速度
        aperture: PropTypes.oneOf(videoSettingsSchema.aperture.enum).isRequired, // 自動光圈
        saturation: PropTypes.number.isRequired, // 飽和度
        whiteblanceMode: PropTypes.oneOf(videoSettingsSchema.whiteblanceMode.enum).isRequired, // 白平衡
        whiteblanceManual: PropTypes.number.isRequired, // 白平衡-色溫
        daynightMode: PropTypes.oneOf(videoSettingsSchema.daynightMode.enum).isRequired, // 黑白模式
        sensitivity: PropTypes.number.isRequired, // 黑白模式-自動-靈敏度
        timePeriodStart: PropTypes.number.isRequired, // 黑白模式-指定時間
        timePeriodEnd: PropTypes.number.isRequired, // 黑白模式-指定時間
        sharpness: PropTypes.number.isRequired, // 銳利度
        orientation: PropTypes.oneOf(videoSettingsSchema.orientation.enum).isRequired, // 影像方向
        refreshRate: PropTypes.oneOf(videoSettingsSchema.refreshRate.enum).isRequired, // 刷新頻率
        isAutoFocus: PropTypes.bool.isRequired, // 自動對焦
        focalLength: PropTypes.number.isRequired, // 焦距
        zoom: PropTypes.number.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.streamPlayerRef = React.createRef();
    this.submitPromise = Promise.resolve();
    this.fetchSnapshotTimeoutId = null;
    this.state.deviceName = props.systemInformation.deviceName || '';
    this.state.isPlayStream = false;
    this.state.streamImageUrl = null;
    this.state.isAutoFocusProcessing = false;
  }

  componentWillUnmount() {
    if (this.state.isPlayStream) {
      if (this.state.streamImageUrl) {
        window.URL.revokeObjectURL(this.state.streamImageUrl);
      }

      this.setState(
        {isPlayStream: false, streamImageUrl: null},
        () => clearTimeout(this.fetchSnapshotTimeoutId)
      );
    }

    super.componentWillUnmount();
  }

  generateInitialValues = videoSettings => ({
    ...videoSettings,
    dnDuty: [
      videoSettings.timePeriodStart,
      videoSettings.timePeriodEnd
    ]
  });

  onChangeVideoSettings = ({nextValues, prevValues}) => {
    if (prevValues.focalLength !== nextValues.focalLength || prevValues.zoom !== nextValues.zoom) {
      // Change focus settings.
      this.submitPromise = this.submitPromise
        .then(() => api.video.updateFocusSettings(nextValues))
        .catch(utils.renderError);
    } else {
      // Change other settings.
      const values = {
        ...nextValues,
        timePeriodStart: nextValues.dnDuty[0],
        timePeriodEnd: nextValues.dnDuty[1]
      };

      this.submitPromise = this.submitPromise
        .then(() => api.video.updateSettings(values))
        .catch(utils.renderError);
    }
  };

  fetchSnapshot = () => {
    axios.get('/api/snapshot', {responseType: 'blob'})
      .then(response => {
        if (this.state.streamImageUrl) {
          window.URL.revokeObjectURL(this.state.streamImageUrl);
        }

        if (this.state.isPlayStream) {
          const imageUrl = window.URL.createObjectURL(response.data);
          this.setState({streamImageUrl: imageUrl}, this.fetchSnapshot);
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === 401) {
          location.href = '/login';
          return;
        }

        if (this.state.isPlayStream) {
          // Wait 500ms to retry.
          this.fetchSnapshotTimeoutId = setTimeout(this.fetchSnapshot, 500);
        }
      });
  };

  onTogglePlayStream = event => {
    event.preventDefault();
    this.setState(prevState => {
      if (prevState.isPlayStream) {
        // Stop play stream.
        if (prevState.streamImageUrl) {
          window.URL.revokeObjectURL(prevState.streamImageUrl);
        }

        return {isPlayStream: false, streamImageUrl: null};
      }

      // Start play stream.
      this.fetchSnapshot();
      return {isPlayStream: true};
    });
  };

  onClickDownloadImage = event => {
    event.preventDefault();
    download('/api/snapshot');
  };

  onClickRequestFullScreen = event => {
    event.preventDefault();
    if (this.streamPlayerRef.current.requestFullScreen) {
      this.streamPlayerRef.current.requestFullScreen();
    } else if (this.streamPlayerRef.current.mozRequestFullScreen) {
      this.streamPlayerRef.current.mozRequestFullScreen();
    } else if (this.streamPlayerRef.current.webkitRequestFullScreen) {
      this.streamPlayerRef.current.webkitRequestFullScreen();
    }
  };

  generateClickResetButtonHandler = ({resetForm}) => event => {
    event.preventDefault();
    progress.start();
    api.video.resetSettings()
      .then(() => api.video.getSettings())
      .then(response => resetForm({values: this.generateInitialValues(response.data)}))
      .catch(utils.renderError)
      .finally(progress.done);
  };

  generateClickAutoFocusButtonHandler = ({resetForm}) => event => {
    event.preventDefault();
    progress.start();
    this.setState({isAutoFocusProcessing: true});
    this.submitPromise = this.submitPromise
      .then(api.video.startAutoFocus)
      .then(api.video.getSettings)
      .then(response => {
        progress.done();
        resetForm({values: this.generateInitialValues(response.data)});
        this.setState({isAutoFocusProcessing: false});
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  videoSettingsFormRender = form => {
    const {values} = form;

    return (
      <Form className="card shadow">
        <FormikEffect onChange={this.onChangeVideoSettings}/>
        <div className="card-header">{_('Video properties')}</div>
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 col-lg-6 my-1 d-flex align-items-center">
              <span>{_('Defog')}</span>
              <div className="custom-control custom-switch d-inline-block ml-2">
                <Field name="defoggingEnabled" type="checkbox" checked={values.defoggingEnabled} className="custom-control-input" id="switch-defogging"/>
                <label className="custom-control-label" htmlFor="switch-defogging">
                  <span>{_('Auto')}</span>
                  <span>{_('Off')}</span>
                </label>
              </div>
            </div>
            <div className="col-12 col-lg-6 my-1 d-flex align-items-center justify-content-xl-end">
              <span>{_('IR light')}</span>
              <div className="custom-control custom-switch d-inline-block ml-2">
                <Field name="irEnabled" type="checkbox" checked={values.irEnabled} className="custom-control-input" id="switch-ir"/>
                <label className="custom-control-label" htmlFor="switch-ir">
                  <span>{_('Auto')}</span>
                  <span>{_('Off')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion" id="accordion-video-properties">
          {/* 亮度 */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#lightness">
                <i className="fas fa-chevron-up"/>{_('Brightness')}
              </button>
            </h2>

            <div id="lightness" className="collapse show" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Brightness')}</label>
                  <span className="text-primary text-size-14">{values.brightness}</span>
                </div>
                <Field name="brightness" component={Slider} step={1}
                  min={videoSettingsSchema.brightness.min}
                  max={videoSettingsSchema.brightness.max}/>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Contrast')}</label>
                  <span className="text-primary text-size-14">{values.contrast}</span>
                </div>
                <Field name="contrast" component={Slider} step={1}
                  min={videoSettingsSchema.contrast.min}
                  max={videoSettingsSchema.contrast.max}/>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('HDR')}</label>
                  <Field name="hdrEnabled" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={[{value: 'true', label: _('ON')}, {value: 'false', label: _('OFF')}]}/>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Shutter speed')}</label>
                  <Field name="shutterSpeed" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.shutterSpeed.enum.map(x => ({value: x, label: _(`shutter-speed-${x}`)}))}/>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Auto Iris')}</label>
                  <Field name="aperture" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.aperture.enum.map(x => ({value: x, label: _(`aperture-${x}`)}))}/>
                </div>
              </div>
            </div>
          </div>

          {/* 顏色 */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#color">
                <i className="fas fa-chevron-up"/>{_('Color')}
              </button>
            </h2>

            <div id="color" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Saturation')}</label>
                  <span className="text-primary text-size-14">{values.saturation}</span>
                </div>
                <Field name="saturation" component={Slider} step={1}
                  min={videoSettingsSchema.saturation.min}
                  max={videoSettingsSchema.saturation.max}/>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{_('White balance')}</label>
                  <Field name="whiteblanceMode" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.whiteblanceMode.enum.map(x => ({value: x, label: _(`white-balance-${x}`)}))}/>
                </div>
                {
                  values.whiteblanceMode === WhiteBalanceType.manual && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Color temperature')}</label>
                        <span className="text-primary text-size-14">{values.whiteblanceManual}</span>
                      </div>
                      <Field name="whiteblanceManual" component={Slider} step={1000}
                        min={videoSettingsSchema.whiteblanceManual.min}
                        max={videoSettingsSchema.whiteblanceManual.max}/>
                    </div>
                  )
                }
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{_('D/N')}</label>
                  <Field name="daynightMode" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.daynightMode.enum.map(x => ({value: x, label: _(`daynight-mode-${x}`)}))}/>
                </div>
                {
                  values.daynightMode === DaynightType.auto && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Sensitivity')}</label>
                        <span className="text-primary text-size-14">{values.sensitivity}</span>
                      </div>
                      <Field name="sensitivity" component={Slider} step={1}
                        min={videoSettingsSchema.sensitivity.min}
                        max={videoSettingsSchema.sensitivity.max}/>
                    </div>
                  )
                }
                {
                  values.daynightMode === DaynightType.manual && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Duty time')}</label>
                        <span className="text-primary text-size-14">
                          {utils.formatTimeRange(values.dnDuty)}
                        </span>
                      </div>
                      <Field name="dnDuty" component={Slider}
                        mode="range"
                        step={0.5}
                        min={videoSettingsSchema.timePeriodStart.min}
                        max={videoSettingsSchema.timePeriodEnd.max}/>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* 影像 */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#video">
                <i className="fas fa-chevron-up"/>{_('Video')}
              </button>
            </h2>

            <div id="video" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Sharpness')}</label>
                  <span className="text-primary text-size-14">{values.sharpness}</span>
                </div>
                <Field name="sharpness" component={Slider} step={1}
                  min={videoSettingsSchema.sharpness.min}
                  max={videoSettingsSchema.sharpness.max}/>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Orientation')}</label>
                  <Field name="orientation" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.orientation.enum.map(x => ({value: x, label: _(`orientation-${x}`)}))}/>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Flicker less')}</label>
                  <Field name="refreshRate" component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.refreshRate.enum.map(x => ({value: x, label: _(`refresh-rate-${x}`)}))}/>
                </div>
              </div>
            </div>
          </div>

          {/* 對焦 */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2 className="d-flex justify-content-between">
              <button type="button" data-toggle="collapse" data-target="#focus"
                className="btn btn-link btn-block text-left collapsed"
              >
                <i className="fas fa-chevron-up"/>{_('Focus')}
              </button>
              <button
                disabled={this.state.$isApiProcessing} type="button"
                className="btn btn-outline-primary rounded-pill tip text-nowrap py-0 px-3"
                onClick={this.generateClickAutoFocusButtonHandler(form)}
              >
                {_('Auto focus')}
              </button>
            </h2>

            <div id="focus" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Focal length')}</label>
                  <span className="text-primary text-size-14">{values.focalLength}</span>
                </div>
                <Field disabled={this.state.isAutoFocusProcessing}
                  name="focalLength" component={Slider} step={1}
                  min={videoFocusSettingsSchema.focalLength.min}
                  max={videoFocusSettingsSchema.focalLength.max}/>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>ZOOM</label>
                  <span className="text-primary text-size-14">{values.zoom}</span>
                </div>
                <Field disabled={this.state.isAutoFocusProcessing}
                  name="zoom" component={Slider} step={0.1}
                  min={videoFocusSettingsSchema.zoom.min}
                  max={videoFocusSettingsSchema.zoom.max}/>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-0"/>
        <div className="card-body pt-0 mt-5">
          <button disabled={this.state.$isApiProcessing} type="button"
            className="btn btn-outline-primary btn-block rounded-pill"
            onClick={this.generateClickResetButtonHandler(form)}
          >
            {_('Reset to defaults')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    return (
      <div className="main-content">
        <div className="page-home">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-5">
                  <img ref={this.streamPlayerRef}
                    className="img-fluid" src={this.state.streamImageUrl || defaultVideoBackground}
                    onClick={this.onTogglePlayStream}/>
                  {
                    !this.state.isPlayStream && (
                      <div className="cover d-flex justify-content-center align-items-center">
                        <button className="btn-play" type="button" onClick={this.onTogglePlayStream}>
                          <i className="fas fa-play fa-fw"/>
                        </button>
                      </div>
                    )
                  }
                  {
                    this.state.isPlayStream && !this.state.streamImageUrl && (
                      <div className="cover d-flex justify-content-center align-items-center text-muted"
                        onClick={this.onTogglePlayStream}
                      >
                        <div className="spinner-border">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    )
                  }
                  <div className="controls d-flex justify-content-end align-items-center">
                    <div>
                      <button className="btn-action" type="button" onClick={this.onClickDownloadImage}>
                        <i className="fas fa-camera"/>
                      </button>
                      <button className="btn-action" type="button" onClick={this.onClickRequestFullScreen}>
                        <i className="fas fa-expand-arrows-alt"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4 pl-24">
                <Formik initialValues={this.generateInitialValues(this.props.videoSettings)}>
                  {this.videoSettingsFormRender}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
