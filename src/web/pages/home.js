const axios = require('axios');
const download = require('downloadjs');
const classNames = require('classnames');
const {getRouter} = require('capybara-router');
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
const Dropdown = require('../../core/components/fields/dropdown');
const FormikEffect = require('../../core/components/formik-effect');
const deviceNameValidator = require('../validations/system/device-name-validator');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamFormat = require('webserver-form-schema/constants/stream-format');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const {DEVICE_NAME_CHAR_MAX} = require('../../core/constants');

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
      }).isRequired,
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired
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

  deviceNameFormRender = ({errors, touched}) => {
    return (
      <Form className="form-group">
        <Field name="deviceName" type="text"
          maxLength={DEVICE_NAME_CHAR_MAX}
          className={classNames('form-control', {'is-invalid': errors.deviceName && touched.deviceName})}/>
        <button disabled={this.state.$isApiProcessing} className="d-none" type="submit"/>
      </Form>
    );
  };

  videoSettingsFormRender = form => {
    const {values} = form;

    return (
      <Form>
        <FormikEffect onChange={this.onChangeVideoSettings}/>
        <div className="card-header d-flex align-items-center justify-content-between">
          {_('Quick Start')}
          <button disabled={this.state.$isApiProcessing} type="button"
            className="btn btn-outline-light rounded-pill"
            onClick={this.generateClickResetButtonHandler(form)}
          >
            {_('Reset to Default')}
          </button>
        </div>
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
                  enableArrowKey
                  disabled={this.state.isAutoFocusProcessing}
                  name="zoom" component={Slider} step={0.1}
                  min={videoFocusSettingsSchema.zoom.min}
                  max={videoFocusSettingsSchema.zoom.max}/>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  fieldsRender = (fieldNamePrefix, options, values) => {
    return (
      <>
        <div className="form-group">
          <label>{_('Format')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              readOnly
              name={`${fieldNamePrefix}.format`}
              component="select"
              className="form-control border-0 select-readonly"
            >
              {
                options.format.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Resolution')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              readOnly
              name={`${fieldNamePrefix}.resolution`}
              component="select"
              className="form-control border-0 select-readonly"
            >
              {
                options.resolution.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Frame Rate (FPS)')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}.frameRate`}
              component="select"
              className="form-control border-0"
            >
              {
                options.frameRate.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Bandwidth Management')}</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <Field
                name={`${fieldNamePrefix}.bandwidthManagement`}
                component={Dropdown}
                buttonClassName="btn btn-outline-primary rounded-left"
                menuClassName="dropdown-menu-right"
                items={options.bandwidthManagement.map(x => ({value: x.value, label: x.label}))}
              />
            </div>
            <Field type="text" name={`${fieldNamePrefix}.bitRate`} className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.mbr})}/>
            <input readOnly type="text" className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.vbr})} placeholder="Auto"/>
            <Field type="text" name={`${fieldNamePrefix}.bitRate`} className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.cbr})}/>
            <div className="input-group-append">
              <span className="input-group-text">Kbps</span>
            </div>
          </div>
          <small className="text-info mb-3">
            {_('{0} - {1} Kbps', [StreamSettingsSchema.channelA.props.bitRate.min, StreamSettingsSchema.channelA.props.bitRate.max])}
          </small>
        </div>
        <div className="form-group">
          <label>{_('GOV')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              readOnly
              name={`${fieldNamePrefix}.gov`}
              component="select"
              className="form-control border-0 select-readonly"
            >
              {
                options.gov.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
      </>
    );
  };

  formRender = ({values}) => {
    const channelAOptions = {
      format: StreamFormat.all().map(x => ({label: x, value: x})),
      resolution: StreamResolution.all().filter(x => Number(x) <= 8 && Number(x) !== 4).map(x => ({label: _(`stream-resolution-${x}`), value: x})),
      frameRate: (() => {
        const result = [];
        for (let index = StreamSettingsSchema.channelA.props.frameRate.min; index <= StreamSettingsSchema.channelA.props.frameRate.max; index += 1) {
          result.push({label: `${index}`, value: `${index}`});
        }

        return result;
      })(),
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({label: _(`stream-bandwidth-management-${x}`), value: x})),
      gov: StreamGOV.all().map(x => ({label: x, value: x}))
    };
    const channelBOptions = {
      format: StreamFormat.all().map(x => ({label: x, value: x})),
      resolution: (() => {
        let options;
        if (Number(values.channelA.resolution) <= Number(StreamResolution['4'])) {
          options = [
            StreamResolution['0'],
            StreamResolution['1'],
            StreamResolution['2'],
            StreamResolution['3'],
            StreamResolution['4']
          ];
        } else {
          options = [
            StreamResolution['5'],
            StreamResolution['6'],
            StreamResolution['7'],
            StreamResolution['8']
          ];
        }

        return options.map(x => ({label: _(`stream-resolution-${x}`), value: x}));
      })(),
      frameRate: (() => {
        const result = [];
        for (let index = StreamSettingsSchema.channelB.props.frameRate.min; index <= StreamSettingsSchema.channelB.props.frameRate.max; index += 1) {
          result.push({label: `${index}`, value: `${index}`});
        }

        return result;
      })(),
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({label: _(`stream-bandwidth-management-${x}`), value: x})),
      gov: StreamGOV.all().map(x => ({label: x, value: x}))
    };

    return (
      <>
        <div className="card-header d-flex align-items-center justify-content-between rounded-0">
          {_('Stream Settings')}
          <button
            type="button"
            className="btn btn-outline-light rounded-pill"
            disabled={this.state.$isApiProcessing}
            onClick={this.onClickResetButton}
          >
            {_('Reset to Default')}
          </button>
        </div>
        <nav>
          <div className="nav nav-tabs">
            <a
              className="nav-item nav-link active"
              data-toggle="tab"
              href="#tab-channel-a"
            >
              {_('Stream {0}', '01')}
            </a>
            <a
              className="nav-item nav-link"
              data-toggle="tab"
              href="#tab-channel-b"
            >
              {_('Stream {0}', '02')}
            </a>
          </div>
        </nav>
        <Form className="card-body">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="tab-channel-a">
              {this.fieldsRender('channelA', channelAOptions, values.channelA)}
            </div>
            <div className="tab-pane fade" id="tab-channel-b">
              {this.fieldsRender('channelB', channelBOptions, values.channelB)}
            </div>
          </div>

          <div className="form-group mt-5">
            <button
              type="submit"
              className="btn btn-block btn-primary rounded-pill"
              disabled={this.state.$isApiProcessing}
            >
              {_('Apply')}
            </button>
          </div>
        </Form>
      </>
    );
  };

  generateOnChangeBandwidthManagement = bandwidthManagement => {
    return event => {
      event.preventDefault();
      this.setState({bandwidthManagement});
    };
  }

  onSubmit = values => {
    progress.start();
    api.multimedia.updateStreamSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onClickResetButton = event => {
    event.preventDefault();
    progress.start();
    api.multimedia.resetStreamSettings()
      .then(getRouter().reload)
      .catch(utils.renderError)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  render() {
    const {systemInformation, streamSettings} = this.props;
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
                <div className="card shadow">
                  <Formik initialValues={this.generateInitialValues(this.props.videoSettings)}>
                    {this.videoSettingsFormRender}
                  </Formik>
                  <Formik
                    initialValues={streamSettings}
                    onSubmit={this.onSubmit}
                  >
                    {this.formRender}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
