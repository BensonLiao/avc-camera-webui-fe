const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const IREnableType = require('webserver-form-schema/constants/ir-enable-type');
const FocusType = require('webserver-form-schema/constants/focus-type');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const videoSettingsSchema = require('webserver-form-schema/video-settings-schema');
const videoFocusSettingsSchema = require('webserver-form-schema/video-focus-settings-schema');
const i18n = require('../../i18n').default;
const utils = require('../utils');
const api = require('../apis/web-api');
const Slider = require('./fields/slider');
const Dropdown = require('./fields/dropdown');
const FormikEffect = require('./formik-effect');
const {getRouter} = require('@benson.liao/capybara-router');
const constants = require('../constants');
const store = require('../store');
module.exports = class VideoSetting extends React.PureComponent {
  static get propTypes() {
    return {
      updateFocalLengthField: PropTypes.bool.isRequired,
      isApiProcessing: PropTypes.bool.isRequired,
      videoSettings: PropTypes.shape({
        defoggingEnabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired, // 除霧
        irEnabled: PropTypes.string.isRequired, // 紅外線燈
        irBrightness: PropTypes.number, // 紅外線燈功率
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
        zoom: PropTypes.number.isRequired,
        focusType: PropTypes.oneOf(FocusType.all()).isRequired,
        isAutoFocusAfterZoom: PropTypes.bool.isRequired
      }).isRequired,
      systemDateTime: PropTypes.shape({deviceTime: PropTypes.number.isRequired}).isRequired
    };
  }

  state = {focalLengthQueue: null}

  constructor(props) {
    super(props);
    this.submitPromise = Promise.resolve();
    this.state.focalLengthQueue = null;
  }

  updateFocalLengthStore = bool => {
    store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, bool);
  }

  matchFocalLength = formik => {
    let prevFocalLength;
    this.updateFocalLengthStore(true);
    // Refresh focal length until previous value matches current value
    const refreshFocalLength = () => {
      api.video.getFocalLength()
        .then(response => {
          if (prevFocalLength === response.data.focalLength) {
            this.updateFocalLengthStore(false);
          } else {
            prevFocalLength = response.data.focalLength;
            // Refresh focal length at 1hz
            setTimeout(refreshFocalLength, 1000);
          }

          return response.data.focalLength;
        })
        .then(focalLength => {
          formik.setFieldValue('focalLength', focalLength);
        });
    };

    refreshFocalLength();
  }

  // Queues user input during api processing
  focusQueue = ({nextValues, prevValues, formik}) => {
    if (!nextValues) {
      return;
    }

    const hasChanged = (nextValues.isAutoFocusAfterZoom || prevValues.zoom !== nextValues.zoom) && prevValues.focalLength === nextValues.focalLength;

    if (hasChanged) {
      this.updateFocalLengthStore(true);
    }

    if (this.props.isApiProcessing) {
      this.setState({focalLengthQueue: nextValues.focalLength});
    } else {
      api.video.updateFocusSettings(nextValues)
        .then(() => {
          if (this.state.focalLengthQueue) {
            this.setState(
              {focalLengthQueue: null},
              this.focusQueue({
                nextValues: {
                  ...nextValues,
                  focalLength: this.state.focalLengthQueue
                },
                prevValues,
                formik
              })
            );
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          if (hasChanged) {
            this.matchFocalLength(formik);
          }
        });
    }
  }

  onChangeVideoSettings = ({nextValues, prevValues, formik}) => {
    if (!nextValues || this.props.updateFocalLengthField) {
      return;
    }

    if (
      prevValues.focalLength !== nextValues.focalLength ||
      prevValues.zoom !== nextValues.zoom ||
      prevValues.focusType !== nextValues.focusType ||
      prevValues.isAutoFocusAfterZoom !== nextValues.isAutoFocusAfterZoom
    ) {
      // Change focus settings with user input queue.
      this.focusQueue({
        nextValues,
        prevValues,
        formik
      });
    } else {
      // Change other settings.
      const values = {
        ...nextValues,
        hdrEnabled: `${nextValues.hdrEnabled}`,
        defoggingEnabled: nextValues.defoggingEnabled,
        timePeriodStart: nextValues.dnDuty[0],
        timePeriodEnd: nextValues.dnDuty[1]
      };

      this.submitPromise = this.submitPromise
        .then(() => api.video.updateSettings(values));
    }
  };

  generateInitialValues = videoSettings => ({
    ...videoSettings,
    dnDuty: [
      videoSettings.timePeriodStart,
      videoSettings.timePeriodEnd
    ]
  });

  generateClickResetButtonHandler = () => event => {
    event.preventDefault();
    progress.start();
    api.video.resetSettings()
      .then(getRouter().reload)
      .finally(progress.done);
  };

  generateClickAutoFocusButtonHandler = form => event => {
    event.preventDefault();
    this.updateFocalLengthStore(true);
    this.submitPromise = this.submitPromise
      .then(api.video.startAutoFocus)
      .then(() => {
        this.matchFocalLength(form);
      });
  };

  generateOnChangeAutoFocusType = (form, autoFocusType) => event => {
    event.preventDefault();
    form.setFieldValue('focusType', autoFocusType).then(() => {
      this.matchFocalLength(form);
    });
  }

  videoSettingsFormRender = form => {
    const {values} = form;
    const {isApiProcessing, updateFocalLengthField} = this.props;
    const disableInput = isApiProcessing || updateFocalLengthField;
    return (
      <Form className="card shadow">
        <FormikEffect onChange={this.onChangeVideoSettings}/>
        <div className="card-header">{i18n.t('videoSetting.image')}</div>
        <div className="accordion" id="accordion-video-properties">
          {/* HDR */}
          <hr className="my-0"/>
          <div className="card-body">
            <div className="form-row">
              <div className="col-12 my-1 d-flex justify-content-between align-items-center">
                <span className="text-size-20">{i18n.t('videoSetting.enableHDR')}</span>
                <div className="custom-control custom-switch d-inline-block ml-2">
                  <Field
                    name="hdrEnabled"
                    type="checkbox"
                    checked={values.hdrEnabled === 'true' ? true : undefined}
                    className="custom-control-input"
                    id="switch-hdr-enabled"
                    disabled={disableInput}
                  />
                  <label className="custom-control-label" htmlFor="switch-hdr-enabled">
                    <span>{i18n.t('common.button.on')}</span>
                    <span>{i18n.t('common.button.off')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Adjustments */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left" type="button" disabled={disableInput} data-toggle="collapse" data-target="#lightness">
                <i className="fas fa-chevron-up"/>{i18n.t('videoSetting.adjustments')}
              </button>
            </h2>

            <div id="lightness" className="collapse show" data-parent="#accordion-video-properties">
              {
                ['brightness', 'contrast', 'sharpness', 'saturation'].map(imageControls => (
                  <div key={imageControls} className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label>{i18n.t(`videoSetting.${imageControls}`)}</label>
                      <span className="text-primary text-size-14">{values[imageControls]}</span>
                    </div>
                    <Field
                      updateFieldOnStop
                      name={imageControls}
                      component={Slider}
                      step={1}
                      min={videoSettingsSchema[imageControls].min}
                      max={videoSettingsSchema[imageControls].max}
                    />
                  </div>
                ))
              }
            </div>
          </div>

          {/* Lens Control */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2 className="d-flex justify-content-between">
              <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#color">
                <i className="fas fa-chevron-up"/>{i18n.t('videoSetting.lensControl')}
              </button>
              <div className="btn-group tip">
                <button
                  disabled={disableInput}
                  type="button"
                  className="btn btn-outline-primary text-nowrap"
                  onClick={this.generateClickAutoFocusButtonHandler(form)}
                >
                  {i18n.t(`videoSetting.${values.focusType === FocusType.fullRange ? 'fullRangeFocus' : 'shortRangeFocus'}`)}
                </button>
                <button
                  type="button"
                  disabled={disableInput}
                  className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only">{i18n.t('videoSetting.selectFocusType')}</span>
                </button>
                <div className="dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={this.generateOnChangeAutoFocusType(form, FocusType.fullRange)}>
                    {i18n.t('videoSetting.fullRangeFocus')}
                  </button>
                  <button type="button" className="dropdown-item" onClick={this.generateOnChangeAutoFocusType(form, FocusType.shortRange)}>
                    {i18n.t('videoSetting.shortRangeFocus')}
                  </button>
                </div>
              </div>
            </h2>

            {/* Focus */}
            <div id="color" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.focus')}</label>
                  <span className="text-primary text-size-14">{values.focalLength}</span>
                </div>
                <Field
                  updateFieldOnStop
                  enableArrowKey
                  disabled={disableInput}
                  name="focalLength"
                  component={Slider}
                  step={1}
                  min={videoFocusSettingsSchema.focalLength.min}
                  max={videoFocusSettingsSchema.focalLength.max}
                />
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.zoom')}</label>
                  <span className="text-primary text-size-14">{values.zoom}{('X')}</span>
                </div>
                <Field
                  updateFieldOnStop
                  enableArrowKey
                  disabled={disableInput}
                  name="zoom"
                  component={Slider}
                  step={0.1}
                  min={videoFocusSettingsSchema.zoom.min}
                  max={videoFocusSettingsSchema.zoom.max}
                />
              </div>
              <div className="form-group form-check">
                <Field
                  id="input-check-auto-focus-after-zoom"
                  type="checkbox"
                  disabled={disableInput}
                  className="form-check-input"
                  name="isAutoFocusAfterZoom"
                  checked={values.isAutoFocusAfterZoom}
                />
                <label className="form-check-label" htmlFor="input-check-auto-focus-after-zoom">
                  {i18n.t('videoSetting.autoFocusAfterZoom')}
                </label>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.iris')}</label>
                  <Field
                    name="aperture"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.aperture.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.aperture-${x}`)
                    }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.shutterSpeed')}</label>
                  <Field
                    name="shutterSpeed"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.shutterSpeed.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.shutter-speed-${x}`)
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left collapsed" type="button" disabled={disableInput} data-toggle="collapse" data-target="#video">
                <i className="fas fa-chevron-up"/>{i18n.t('videoSetting.advanced')}
              </button>
            </h2>

            <div id="video" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{i18n.t('videoSetting.whiteBalance')}</label>
                  <Field
                    name="whiteblanceMode"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.whiteblanceMode.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.white-balance-${x}`)
                    }))}
                  />
                </div>
                {
                  values.whiteblanceMode === WhiteBalanceType.manual && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{i18n.t('videoSetting.colorTemperature')}</label>
                        <span className="text-primary text-size-14">{values.whiteblanceManual}</span>
                      </div>
                      <Field
                        updateFieldOnStop
                        name="whiteblanceManual"
                        component={Slider}
                        step={1000}
                        min={videoSettingsSchema.whiteblanceManual.min}
                        max={videoSettingsSchema.whiteblanceManual.max}
                      />
                    </div>
                  )
                }
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{i18n.t('videoSetting.iRControl')}</label>
                  <Field
                    name="irEnabled"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={IREnableType.all().map(
                      x => ({
                        value: x,
                        label: i18n.t(`videoSetting.constants.ir-control-${x}`)
                      })
                    )}
                  />
                </div>
                {
                  values.irEnabled === IREnableType.on && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{i18n.t('videoSetting.level')}</label>
                        <span className="text-primary text-size-14">{values.irBrightness}</span>
                      </div>
                      {/* Slider step are still under review */}
                      <Field
                        updateFieldOnStop
                        name="irBrightness"
                        component={Slider}
                        step={15}
                        min={videoSettingsSchema.irBrightness.min}
                        max={videoSettingsSchema.irBrightness.max}
                      />
                    </div>
                  )
                }
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{i18n.t('videoSetting.dayNight')}</label>
                  <Field
                    name="daynightMode"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.daynightMode.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.daynight-mode-${x}`)
                    }))}
                  />
                </div>
                {
                  values.daynightMode === DaynightType.auto && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{i18n.t('videoSetting.sensitivity')}</label>
                        <span className="text-primary text-size-14">{values.sensitivity}</span>
                      </div>
                      <Field
                        updateFieldOnStop
                        name="sensitivity"
                        component={Slider}
                        step={1}
                        min={videoSettingsSchema.sensitivity.min}
                        max={videoSettingsSchema.sensitivity.max}
                      />
                    </div>
                  )
                }
                {
                  values.daynightMode === DaynightType.manual && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{i18n.t('videoSetting.dayMode')}</label>
                        <span className="text-primary text-size-14">
                          {utils.formatTimeRange(values.dnDuty)}
                        </span>
                      </div>
                      <Field
                        updateFieldOnStop
                        name="dnDuty"
                        component={Slider}
                        step={0.5}
                        min={videoSettingsSchema.timePeriodStart.min}
                        max={videoSettingsSchema.timePeriodEnd.max}
                      />
                    </div>
                  )
                }
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.rotation')}</label>
                  <Field
                    name="orientation"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.orientation.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.orientation-${x}`)
                    }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.defog')}</label>
                  <Field
                    name="defoggingEnabled"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={[{
                      value: 'true',
                      label: i18n.t('videoSetting.constants.on')
                    }, {
                      value: 'false',
                      label: i18n.t('videoSetting.constants.off')
                    }]}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{i18n.t('videoSetting.lightingCompensation')}</label>
                  <Field
                    name="refreshRate"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.refreshRate.enum.map(x => ({
                      value: x,
                      label: i18n.t(`videoSetting.constants.refresh-rate-${x}`)
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-0"/>
        <div className="card-body pt-0 mt-5">
          <button
            disabled={disableInput}
            type="button"
            className="btn btn-outline-primary btn-block rounded-pill"
            onClick={this.generateClickResetButtonHandler()}
          >
            {i18n.t('common.button.resetDefault')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    return (
      <Formik initialValues={this.generateInitialValues(this.props.videoSettings)}>
        {this.videoSettingsFormRender}
      </Formik>
    );
  }
};
