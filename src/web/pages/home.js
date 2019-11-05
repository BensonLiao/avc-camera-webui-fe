const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const Base = require('./shared/base');
const _ = require('../../languages');
const utils = require('../../core/utils');
const Slider = require('../../core/components/fields/slider');
const Dropdown = require('../../core/components/fields/dropdown');
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
        refreshRate: PropTypes.oneOf(videoSettingsSchema.refreshRate.enum).isRequired // 刷新頻率
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.deviceName = props.systemInformation.deviceName || '';
    this.state.videoSettings = {
      ...props.videoSettings,
      dnDuty: [
        props.videoSettings.timePeriodStart,
        props.videoSettings.timePeriodEnd
      ]
    };

    this.onSubmitVideoPropertiesForm = this.onSubmitVideoPropertiesForm.bind(this);
    this.onSubmitDeviceNameForm = this.onSubmitDeviceNameForm.bind(this);
  }

  onSubmitVideoPropertiesForm(values) {
    // Todo: not implementation
    console.log(values);
  }

  onSubmitDeviceNameForm(values) {
    // Todo: not implementation
    console.log(values);
  }

  videoPropertiesFormRender = ({values}) => {
    return (
      <Form className="card shadow">
        <div className="card-header">{_('Video properties')}</div>
        <div className="card-body">
          <div className="form-row">
            <div className="col-12 col-lg-6 my-1 d-flex align-items-center">
              <span>{_('Defog')}</span>
              <div className="custom-control custom-switch d-inline-block ml-2">
                <Field name="defoggingEnabled" type="checkbox" className="custom-control-input" id="switch-defogging"/>
                <label className="custom-control-label" htmlFor="switch-defogging">
                  <span>{_('Auto')}</span>
                  <span>{_('Off')}</span>
                </label>
              </div>
            </div>
            <div className="col-12 col-lg-6 my-1 d-flex align-items-center justify-content-xl-end">
              <span>{_('IR light')}</span>
              <div className="custom-control custom-switch d-inline-block ml-2">
                <Field name="irEnabled" type="checkbox" className="custom-control-input" id="switch-ir"/>
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
                <Field name="saturation" component={Slider} step={10}
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
                      <Field name="whiteblanceManual" component={Slider} step={10}
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
                <Field name="sharpness" component={Slider} step={10}
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
        </div>

        <hr className="my-0"/>
        <div className="card-body actions">
          <div className="form-group">
            <button disabled={this.state.$isApiProcessing} className="btn btn-primary btn-block rounded-pill" type="submit">
              {_('Apply')}
            </button>
          </div>
          <button disabled={this.state.$isApiProcessing} className="btn btn-outline-primary btn-block rounded-pill" type="button">
            {_('Reset to defaults')}
          </button>
        </div>
      </Form>
    );
  };

  deviceNameFormRender = ({errors, touched}) => {
    const classTable = {
      deviceName: classNames(
        'form-control',
        {'is-invalid': errors.deviceName && touched.deviceName}
      )
    };

    return (
      <Form className="form-group">
        <Field name="deviceName" type="text" className={classTable.deviceName}/>
        <small className="form-text text-muted">
          {_('Please enter letters between 1 and 32.')}
        </small>
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
                <div className="video-wrapper mb-5">
                  <video width="100%">
                    <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4"/>
                  </video>
                  <div className="cover d-flex justify-content-center align-items-center">
                    <button className="btn-play" type="button"><i className="fas fa-play fa-fw"/></button>
                  </div>
                  <div className="controls d-flex justify-content-between align-items-center">
                    <div>
                      <button className="btn-stream active" type="button">{_('Stream {0}', ['01'])}</button>
                      <button className="btn-stream" type="button">{_('Stream {0}', ['02'])}</button>
                    </div>
                    <div>
                      <button className="btn-action" type="button"><i className="fas fa-camera"/></button>
                      <button className="btn-action" type="button"><i className="fas fa-expand-arrows-alt"/></button>
                    </div>
                  </div>
                </div>

                {/* System information */}
                <div className="card border-0 shadow">
                  <table>
                    <thead>
                      <tr>
                        <th>{_('Device name')}</th>
                        <th>{_('Smart functions')}</th>
                        <th>{_('Device status')}</th>
                        <th>{_('SD card')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="align-top">
                          <Formik
                            initialValues={{deviceName: this.state.deviceName}}
                            validate={utils.makeFormikValidator(deviceNameValidator)}
                            render={this.deviceNameFormRender}
                            onSubmit={this.onSubmitDeviceNameForm}/>
                        </td>
                        <td className="align-top">
                          <span>{_('Face recognition: ')}</span>
                          <span className={classTable.faceRecognitionState}>
                            {_(`${systemInformation.isEnableFaceRecognition ? 'ON' : 'OFF'}`)}
                          </span>
                          <br/>
                          <span>{_('Age gender: ')}</span>
                          <span className={classTable.ageGenderState}>
                            {_(`${systemInformation.isEnableAgeGender ? 'ON' : 'OFF'}`)}
                          </span>
                          <br/>
                          <span>{_('Humanoid detection: ')}</span>
                          <span className={classTable.humanoidDetectionState}>
                            {_(`${systemInformation.isEnableHumanoidDetection ? 'ON' : 'OFF'}`)}
                          </span>
                        </td>
                        <td className="align-top">
                          <span className="badge badge-pill badge-success">{_('Green')}</span>
                        </td>
                        <td className="align-top">
                          <div className="progress">
                            <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                              {`${usedDiskPercentage}%`}
                            </div>
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

              <div className="col-4 pl-24">
                <Formik
                  initialValues={this.state.videoSettings}
                  render={this.videoPropertiesFormRender}
                  onSubmit={this.onSubmitVideoPropertiesForm}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
