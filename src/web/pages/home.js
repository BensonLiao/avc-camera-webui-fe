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
const download = require('downloadjs');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const {getRouter} = require('capybara-router');
const React = require('react');
const progress = require('nprogress');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
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
const CustomTooltip = require('../../core/components/tooltip');

module.exports = class Home extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(AVAILABLE_LANGUAGE_CODES).isRequired,
        deviceName: PropTypes.string.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired,
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
      systemDateTime: PropTypes.shape({
        deviceTime: PropTypes.string.isRequired
      }).isRequired
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

  onChangeVideoSettings = ({nextValues, prevValues}) => {
    if (prevValues.focalLength !== nextValues.focalLength || prevValues.zoom !== nextValues.zoom) {
      // Change focus settings.
      this.submitPromise = this.submitPromise
        .then(() => {
          api.video.updateFocusSettings(nextValues)
            .catch(error => {
              throw error;
            });
        })
        .catch(error => {
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    } else {
      // Change other settings.
      const values = {
        ...nextValues,
        hdrEnabled: `${nextValues.hdrEnabled}`,
        timePeriodStart: nextValues.dnDuty[0],
        timePeriodEnd: nextValues.dnDuty[1]
      };

      this.submitPromise = this.submitPromise
        .then(() => {
          api.video.updateSettings(values)
            .catch(error => {
              throw error;
            });
        })
        .catch(error => {
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    }
  };

  fetchSnapshot = () => {
    axios.get('/api/snapshot', {timeout: 1500, responseType: 'blob'})
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
    api.system.getSystemDateTime().then(({data}) => {
      const dateTime = data.deviceTime.replace(/:|-/g, '').replace(/\s+/g, '-');
      axios.get('/api/snapshot', {timeout: 1500, responseType: 'blob'})
        .then(response => {
          download(response.data, `${dateTime}`);
        })
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
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
      .then(response => {
        resetForm({values: this.generateInitialValues(response.data)});
      })
      .catch(error => {
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
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
      .catch(error => {
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
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
      .catch(error => {
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      })
      .finally(progress.done);
  };

  onBlurDeviceNameForm = event => {
    progress.start();
    api.system.updateDeviceName(event.target.value)
      .then(getRouter().reload)
      .catch(error => {
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      })
      .finally(progress.done);
  };

  deviceNameFormRender = ({errors, touched}) => {
    return (
      <Form className="form-group">
        <Field name="deviceName" type="text"
          maxLength={DEVICE_NAME_CHAR_MAX}
          className={classNames('form-control', {'is-invalid': errors.deviceName && touched.deviceName})}
          onBlur={this.onBlurDeviceNameForm}/>
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
    const {systemInformation, videoSettings, systemDateTime} = this.props;
    const {$user} = this.state;
    const usedDiskPercentage = Math.ceil((systemInformation.sdUsage / systemInformation.sdTotal) * 100);
    const freeDiskPercentage = 100 - usedDiskPercentage;
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
      <div className={classNames('main-content', $user.permission === '0' ? '' : 'pl-0')}>
        <div className="page-home">
          <div className="container-fluid">
            <div className={classNames($user.permission === '0' ? 'row' : 'd-flex justify-content-center')}>
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-4">
                  <div ref={this.streamPlayerRef}>
                    <img
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
                  </div>
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
                { $user.permission === '0' && (
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
                          <td className={classNames('align-top', systemInformation.sdStatus === SD_STATUS_LIST.indexOf('MEDIA_MOUNTED') ? '' : 'd-none')}>
                            <div className="progress">
                              {
                                isNaN(usedDiskPercentage) ?
                                  <div className="progress-bar"/> :
                                  <>
                                    <CustomTooltip title={_('Used: {0}', [filesize(systemInformation.sdUsage)])}>
                                      <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                                        {`${usedDiskPercentage}%`}
                                      </div>
                                    </CustomTooltip>
                                    {usedDiskPercentage && (
                                      <CustomTooltip title={_('Free: {0}', [filesize(systemInformation.sdTotal - systemInformation.sdUsage)])}>

                                        <div className="progress-bar" style={{width: `${freeDiskPercentage}%`, backgroundColor: '#e9ecef', color: 'var(--gray-dark)'}}>
                                          {`${freeDiskPercentage}%`}
                                        </div>
                                      </CustomTooltip>)}
                                  </>
                              }
                            </div>
                            <p>
                              {
                                _('Free: {0}, Total: {1}', [
                                  filesize(systemInformation.sdTotal - systemInformation.sdUsage),
                                  filesize(systemInformation.sdTotal)
                                ])
                              }
                            </p>
                          </td>
                          <td className={classNames('align-top', systemInformation.sdStatus === SD_STATUS_LIST.indexOf('MEDIA_MOUNTED') ? 'd-none' : '')}>
                            <label>{_(SD_STATUS_LIST[systemInformation.sdStatus] || 'UNKNOWN STATUS')}</label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              { $user.permission === '0' && (
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
