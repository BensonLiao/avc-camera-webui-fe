const axios = require('axios');
axios.interceptors.response.use(
  config => config,
  error => {
    if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
    }

    return Promise.reject(error);
  }
);
const classNames = require('classnames');
const PropTypes = require('prop-types');
const {getRouter} = require('capybara-router');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const defaultVideoBackground = require('../../resource/video-bg.jpg');
const Base = require('./shared/base');
const _ = require('../../languages');
const store = require('../../core/store');
const utils = require('../../core/utils');
const api = require('../../core/apis/web-api');
const deviceNameValidator = require('../validations/system/device-name-validator');
const {AVAILABLE_LANGUAGE_CODES, DEVICE_NAME_CHAR_MAX, SD_STATUS_LIST} = require('../../core/constants');
const VideoSetting = require('../../core/components/video-setting');
const VolumeProgressBar = require('../../core/components/volume-progress-bar');

module.exports = class Home extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(AVAILABLE_LANGUAGE_CODES).isRequired,
        deviceName: PropTypes.string.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        sdUsage: PropTypes.number.isRequired,
        sdTotal: PropTypes.number.isRequired,
        sdStatus: PropTypes.number.isRequired
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
          codec: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          codec: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      systemDateTime: PropTypes.shape({deviceTime: PropTypes.string.isRequired}).isRequired,
      authStatus: PropTypes.shape({
        isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
        isEnableAgeGenderKey: PropTypes.bool.isRequired,
        isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
      }).isRequired,
      faceRecognitionStatus: PropTypes.shape({isEnable: PropTypes.bool.isRequired}).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.streamPlayerRef = React.createRef();
    this.submitPromise = Promise.resolve();
    this.fetchSnapshotTimeoutId = null;
    this.state.deviceName = props.systemInformation.deviceName || '';
    this.state.isPlayStream = true;
    store.set(`${this.constructor.name}.isPlayStream`, true);
    this.state.streamImageUrl = null;
    this.state.isAutoFocusProcessing = false;
  }

  componentDidMount() {
    if (this.state.isPlayStream) {
      this.fetchSnapshot();
    }
  }

  componentWillUnmount() {
    if (this.state.streamImageUrl) {
      window.URL.revokeObjectURL(this.state.streamImageUrl);
    }

    store.set(`${this.constructor.name}.isPlayStream`, false);
    clearTimeout(this.fetchSnapshotTimeoutId);

    super.componentWillUnmount();
  }

  generateInitialValues = videoSettings => ({
    ...videoSettings,
    dnDuty: [
      videoSettings.timePeriodStart,
      videoSettings.timePeriodEnd
    ]
  });

  fetchSnapshot = () => {
    axios.get('/api/snapshot', {
      timeout: 1500,
      responseType: 'blob'
    })
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

        if (store.get(`${this.constructor.name}.isPlayStream`) &&
          (this.state.isPlayStream || error.code === 'ECONNABORTED')) {
          // Wait 500ms to retry.
          this.fetchSnapshotTimeoutId = setTimeout(this.fetchSnapshot, 500);
        }
      });
  };

  generateClickResetButtonHandler = ({resetForm}) => event => {
    event.preventDefault();
    progress.start();
    api.video.resetSettings()
      .then(() => api.video.getSettings())
      .then(response => {
        resetForm({values: this.generateInitialValues(response.data)});
      })
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
        resetForm({values: this.generateInitialValues(response.data)});
      })
      .finally(() => {
        progress.done();
        this.setState({isAutoFocusProcessing: false});
      });
  };

  onSubmitDeviceNameForm = ({deviceName}, {resetForm}) => {
    progress.start();
    api.system.updateDeviceName(deviceName)
      .then(response => {
        resetForm({values: {deviceName: response.data.deviceName}});
      })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  onBlurDeviceNameForm = event => {
    // Update device name only if the value has changed
    if (event.target.value !== this.props.systemInformation.deviceName) {
      progress.start();
      api.system.updateDeviceName(event.target.value)
        .then(getRouter().reload)
        .finally(progress.done);
    }
  };

  deviceNameFormRender = ({errors, touched}) => {
    return (
      <Form className="form-group">
        <Field
          name="deviceName"
          type="text"
          maxLength={DEVICE_NAME_CHAR_MAX}
          className={classNames('form-control', {'is-invalid': errors.deviceName && touched.deviceName})}
          onBlur={this.onBlurDeviceNameForm}
        />
        <button disabled={this.state.$isApiProcessing} className="d-none" type="submit"/>
      </Form>
    );
  };

  generateOnChangeBandwidthManagement = bandwidthManagement => {
    return event => {
      event.preventDefault();
      this.setState({bandwidthManagement});
    };
  }

  render() {
    const {
      systemInformation: {
        sdUsage,
        sdTotal,
        sdStatus,
        deviceStatus
      },
      authStatus: {
        isEnableFaceRecognitionKey,
        isEnableAgeGenderKey,
        isEnableHumanoidDetectionKey
      }, systemDateTime, videoSettings, faceRecognitionStatus
    } = this.props;
    const {$user, streamImageUrl, isPlayStream, deviceName} = this.state;
    const isAdmin = $user.permission === UserPermission.root || $user.permission === UserPermission.superAdmin;
    const classTable = {
      faceRecognitionState: classNames({
        'text-success': faceRecognitionStatus.isEnable && isEnableFaceRecognitionKey,
        'text-muted': !faceRecognitionStatus.isEnable || !isEnableFaceRecognitionKey
      }),
      ageGenderState: classNames({
        'text-success': isEnableAgeGenderKey,
        'text-muted': !isEnableAgeGenderKey
      }),
      humanoidDetectionState: classNames({
        'text-success': isEnableHumanoidDetectionKey,
        'text-muted': !isEnableHumanoidDetectionKey
      })
    };

    return (
      <div className={classNames('main-content', isAdmin ? '' : 'pl-0')}>
        <div className="page-home">
          <div className="container-fluid">
            <div className={classNames(isAdmin ? 'row' : 'd-flex justify-content-center')}>
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-4">
                  <div ref={this.streamPlayerRef}>
                    <img
                      className="img-fluid"
                      draggable={false}
                      src={streamImageUrl || defaultVideoBackground}
                      onClick={e => utils.onTogglePlayStream(e, this)}
                    />
                    <div
                      className={classNames('cover d-flex justify-content-center align-items-center', {pause: isPlayStream})}
                      onClick={e => utils.onTogglePlayStream(e, this)}
                    >
                      <button className="btn-play" type="button">
                        <i className="fas fa-play fa-fw"/>
                      </button>
                    </div>
                    {
                      isPlayStream && !streamImageUrl && (
                        <div
                          className="cover d-flex justify-content-center align-items-center text-muted"
                          onClick={e => utils.onTogglePlayStream(e, this)}
                        >
                          <div className="spinner-border">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )
                    }
                    <div className="controls d-flex justify-content-end align-items-center">
                      <div>
                        <button className="btn-action" type="button" onClick={e => utils.onClickDownloadImage(e)}>
                          <i className="fas fa-camera"/>
                        </button>
                        <button className="btn-action" type="button" onClick={e => utils.toggleFullscreen(e, this.streamPlayerRef)}>
                          <i className="fas fa-expand-arrows-alt"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System information */}
                { isAdmin && (
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
                              initialValues={{deviceName: deviceName}}
                              validate={utils.makeFormikValidator(deviceNameValidator)}
                              onSubmit={this.onSubmitDeviceNameForm}
                            >
                              {this.deviceNameFormRender}
                            </Formik>
                          </td>
                          <td className="align-top">
                            <div>
                              <span>{_('Facial Recognition: ')}</span>
                              <span className={classTable.faceRecognitionState}>
                                {_(`${isEnableFaceRecognitionKey ? faceRecognitionStatus.isEnable ? 'On' : 'Off' : 'Unlicensed'}`)}
                              </span>
                            </div>
                            {isEnableAgeGenderKey && (
                              <div>
                                <span>{_('Age Gender: ')}</span>
                                <span className={classTable.ageGenderState}>
                                  {_(`${isEnableAgeGenderKey ? 'On' : 'Off'}`)}
                                </span>
                              </div>
                            )}
                            {isEnableHumanoidDetectionKey && (
                              <div>
                                <span>{_('Human Detection: ')}</span>
                                <span className={classTable.humanoidDetectionState}>
                                  {_(`${isEnableHumanoidDetectionKey ? 'On' : 'Off'}`)}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="align-top">
                            {deviceStatus === 0 && (
                              <span className="badge badge-pill badge-danger">{_('Error')}</span>
                            )}
                            {deviceStatus === 1 && (
                              <span className="badge badge-pill badge-success">{_('Normal')}</span>
                            )}
                          </td>
                          <td className={classNames('align-top', sdStatus === 0 ? '' : 'd-none')}>
                            <VolumeProgressBar
                              total={sdTotal}
                              usage={sdUsage}
                              percentageToHideText={4}
                            />
                          </td>
                          <td className={classNames('align-top', sdStatus === 0 ? 'd-none' : '')}>
                            <label>{_(SD_STATUS_LIST[sdStatus] || 'UNKNOWN STATUS')}</label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              { isAdmin && (
                <div className="col-4 pl-0">
                  <div className="card shadow">
                    <VideoSetting
                      videoSettings={videoSettings}
                      systemDateTime={systemDateTime}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
