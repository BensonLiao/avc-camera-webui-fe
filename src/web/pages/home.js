const axios = require('axios');
const download = require('downloadjs');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const videoFocusSettingsSchema = require('webserver-form-schema/video-focus-settings-schema');
const defaultVideoBackground = require('../../resource/video-bg.jpg');
const Base = require('./shared/base');
const _ = require('../../languages');
const utils = require('../../core/utils');
const api = require('../../core/apis/web-api');
const Slider = require('../../core/components/fields/slider');
const FormikEffect = require('../../core/components/formik-effect');
const deviceNameValidator = require('../validations/system/device-name-validator');

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
        hdrEnabled: `${nextValues.hdrEnabled}`,
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

  onSubmitDeviceNameForm = ({deviceName}, {resetForm}) => {
    progress.start();
    api.system.updateDeviceName(deviceName)
      .then(response => {
        resetForm({values: {deviceName: response.data.deviceName}});
      })
      .catch(utils.renderError)
      .finally(progress.done);
  };

  videoSettingsFormRender = form => {
    const {values} = form;

    return (
      <Form className="card shadow">
        <FormikEffect onChange={this.onChangeVideoSettings}/>
        <div className="card-header">{_('Quick Start')}</div>
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 my-1 d-flex justify-content-between align-items-center">
              <span className="text-size-20">{_('WDR')}</span>
              <div className="custom-control custom-switch d-inline-block ml-2">
                <Field name="hdrEnabled" type="checkbox" checked={values.hdrEnabled === 'true' ? true : undefined} className="custom-control-input" id="switch-hdr-enabled"/>
                <label className="custom-control-label" htmlFor="switch-hdr-enabled">
                  <span>{_('ON')}</span>
                  <span>{_('OFF')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-0"/>
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 my-1 d-flex justify-content-between align-items-center">
              <span className="text-size-20">{_('Focus')}</span>
              <button
                disabled={this.state.$isApiProcessing} type="button"
                className="btn btn-outline-primary rounded-pill tip text-nowrap py-0 px-3"
                onClick={this.generateClickAutoFocusButtonHandler(form)}
              >
                {_('Auto Focus')}
              </button>
            </div>
          </div>
        </div>
        <hr className="my-0"/>
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 my-1 d-flex justify-content-between align-items-center">
              <div className="form-group w-100 mb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="text-size-16 mb-0 text-left">Zoom</label>
                  <span className="text-primary text-size-14">{values.zoom}</span>
                </div>
                <Field
                  updateFieldOnStop
                  disabled={this.state.isAutoFocusProcessing}
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
            {_('Reset to Defaults')}
          </button>
        </div>
      </Form>
    );
  };

  deviceNameFormRender = ({errors, touched}) => {
    return (
      <Form className="form-group">
        <Field name="deviceName" type="text"
          className={classNames('form-control', {'is-invalid': errors.deviceName && touched.deviceName})}/>
        <button disabled={this.state.$isApiProcessing} className="d-none" type="submit"/>
      </Form>
    );
  };

  render() {
    const {systemInformation} = this.props;
    const usedDiskPercentage = Math.ceil((systemInformation.usedDiskSize / systemInformation.totalDiskSize) * 100);
    const classTable = {
      faceRecognitionState: classNames({
        'text-success': systemInformation.isEnableFaceRecognition,
        'text-muted': !systemInformation.isEnableFaceRecognition
      }),
      ageGenderState: classNames({
        'text-success': systemInformation.isEnableAgeGender,
        'text-muted': !systemInformation.isEnableAgeGender
      }),
      humanoidDetectionState: classNames({
        'text-success': systemInformation.isEnableHumanoidDetection,
        'text-muted': !systemInformation.isEnableHumanoidDetection
      })
    };

    return (
      <div className="main-content">
        <div className="page-home">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-4">
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

                {/* System information */}
                <div className="card border-0 shadow">
                  <table>
                    <thead>
                      <tr>
                        <th>{_('Device Name')}</th>
                        <th>{_('Analytic')}</th>
                        <th>{_('Device Status')}</th>
                        <th>{_('SD Card')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="align-top">
                          <Formik
                            initialValues={{deviceName: this.state.deviceName}}
                            validate={utils.makeFormikValidator(deviceNameValidator)}
                            onSubmit={this.onSubmitDeviceNameForm}
                          >
                            {this.deviceNameFormRender}
                          </Formik>
                        </td>
                        <td className="align-top">
                          {systemInformation.isEnableFaceRecognition && (
                            <div>
                              <span>{_('Facial Recognition: ')}</span>
                              <span className={classTable.faceRecognitionState}>
                                {_(`${systemInformation.isEnableFaceRecognition ? 'On' : 'Off'}`)}
                              </span>
                            </div>
                          )}
                          {systemInformation.isEnableAgeGender && (
                            <div>
                              <span>{_('Age Gender: ')}</span>
                              <span className={classTable.ageGenderState}>
                                {_(`${systemInformation.isEnableAgeGender ? 'On' : 'Off'}`)}
                              </span>
                            </div>
                          )}
                          {systemInformation.isEnableHumanoidDetection && (
                            <div>
                              <span>{_('Human Detection: ')}</span>
                              <span className={classTable.humanoidDetectionState}>
                                {_(`${systemInformation.isEnableHumanoidDetection ? 'On' : 'Off'}`)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="align-top">
                          {systemInformation.deviceStatus === 0 && (
                            <span className="badge badge-pill badge-danger">{_('Error')}</span>
                          )}
                          {systemInformation.deviceStatus === 1 && (
                            <span className="badge badge-pill badge-success">{_('Normal')}</span>
                          )}
                        </td>
                        <td className="align-top">
                          <div className="progress">
                            {
                              isNaN(usedDiskPercentage) ?
                                <div className="progress-bar"/> :
                                <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                                  {`${usedDiskPercentage}%`}
                                </div>
                            }
                          </div>
                          <p>
                            {
                              _('Free: {0}, Total: {1}', [
                                filesize(systemInformation.totalDiskSize - systemInformation.usedDiskSize),
                                filesize(systemInformation.totalDiskSize)
                              ])
                            }
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-4 pl-0">
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
