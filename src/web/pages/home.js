const classNames = require('classnames');
const PropTypes = require('prop-types');
const {getRouter} = require('capybara-router');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const Base = require('./shared/base');
const i18n = require('../../i18n').default;
const utils = require('../../core/utils');
const api = require('../../core/apis/web-api');
const deviceNameValidator = require('../validations/system/device-name-validator');
const {DEVICE_NAME_CHAR_MAX, SD_STATUS_LIST} = require('../../core/constants');
const SUPPORTED_LANGUAGE_CODES = i18n.options.supportedLangCodes;
const VideoSetting = require('../../core/components/video-setting');
const VolumeProgressBar = require('../../core/components/volume-progress-bar');
const LiveView = require('../../core/components/live-view');

module.exports = class Home extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(SUPPORTED_LANGUAGE_CODES).isRequired,
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
      systemDateTime: PropTypes.shape({deviceTime: PropTypes.number.isRequired}).isRequired,
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
    this.submitPromise = Promise.resolve();
    this.state.deviceName = props.systemInformation.deviceName || '';
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  generateInitialValues = videoSettings => ({
    ...videoSettings,
    dnDuty: [
      videoSettings.timePeriodStart,
      videoSettings.timePeriodEnd
    ]
  });

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
        sdStatus
      },
      authStatus: {
        isEnableFaceRecognitionKey,
        isEnableAgeGenderKey,
        isEnableHumanoidDetectionKey
      }, systemDateTime, videoSettings, faceRecognitionStatus
    } = this.props;
    const {$user, deviceName} = this.state;
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
                <LiveView/>

                {/* System information */}
                { isAdmin && (
                  <div className="card border-0 shadow">
                    <table>
                      <thead>
                        <tr>
                          <th>{i18n.t('Device Name')}</th>
                          <th>{i18n.t('Analytic')}</th>
                          <th>{i18n.t('SD Card')}</th>
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
                              <span>{i18n.t('Facial Recognition: ')}</span>
                              <span className={classTable.faceRecognitionState}>
                                {i18n.t(`${isEnableFaceRecognitionKey ? faceRecognitionStatus.isEnable ? 'On' : 'Off' : 'Unlicensed'}`)}
                              </span>
                            </div>
                            {isEnableAgeGenderKey && (
                              <div>
                                <span>{i18n.t('Age Gender: ')}</span>
                                <span className={classTable.ageGenderState}>
                                  {i18n.t(`${isEnableAgeGenderKey ? 'On' : 'Off'}`)}
                                </span>
                              </div>
                            )}
                            {isEnableHumanoidDetectionKey && (
                              <div>
                                <span>{i18n.t('Human Detection: ')}</span>
                                <span className={classTable.humanoidDetectionState}>
                                  {i18n.t(`${isEnableHumanoidDetectionKey ? 'On' : 'Off'}`)}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className={classNames('align-top', sdStatus === 0 ? '' : 'd-none')}>
                            <VolumeProgressBar
                              total={sdTotal}
                              usage={sdUsage}
                            />
                          </td>
                          <td className={classNames('align-top', sdStatus === 0 ? 'd-none' : '')}>
                            <label>{i18n.t(SD_STATUS_LIST[sdStatus] || 'UNKNOWN STATUS')}</label>
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
                      isApiProcessing={this.state.$isApiProcessing}
                      updateFocalLengthField={this.state.$updateFocalLengthField}
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
