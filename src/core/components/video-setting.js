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
const _ = require('../../languages');
const utils = require('../utils');
const api = require('../apis/web-api');
const Slider = require('./fields/slider');
const Dropdown = require('./fields/dropdown');
const FormikEffect = require('./formik-effect');
const {getRouter} = require('capybara-router');
const CustomTooltip = require('../../core/components/tooltip');
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
      systemDateTime: PropTypes.shape({deviceTime: PropTypes.string.isRequired}).isRequired
    };
  }

  state = {
    // isAutoFocusProcessing: false,
    focalLengthQueue: null
  }

  constructor(props) {
    super(props);
    this.submitPromise = Promise.resolve();
    // this.state.isAutoFocusProcessing = false;
    this.state.focalLengthQueue = null;
  }

  generateOnChangeAutoFocusType = (form, autoFocusType) => event => {
    event.preventDefault();
    form.setFieldValue('focusType', autoFocusType).then(() => {
      let prevFocalLength;
      store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, true);
      // Refresh focal length until previous value matches current value
      const refreshFocalLength = () => {
        api.video.getFocalLength()
          .then(response => {
            if (prevFocalLength === response.data.focalLength) {
              store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, false);
            } else {
              prevFocalLength = response.data.focalLength;
              // Refresh focal length at 1hz
              setTimeout(refreshFocalLength, 1000);
            }

            return response.data.focalLength;
          })
          .then(focalLength => {
            form.setFieldValue('focalLength', focalLength);
          });
      };

      refreshFocalLength();
    });
  }

  generateInitialValues = videoSettings => ({
    ...videoSettings,
    dnDuty: [
      videoSettings.timePeriodStart,
      videoSettings.timePeriodEnd
    ]
  });

  varyFocus = (form, step) => {
    let newFocalLength = step + form.values.focalLength;
    if (newFocalLength < videoFocusSettingsSchema.focalLength.min) {
      newFocalLength = videoFocusSettingsSchema.focalLength.min;
    }

    if (newFocalLength > videoFocusSettingsSchema.focalLength.max) {
      newFocalLength = videoFocusSettingsSchema.focalLength.max;
    }

    form.setFieldValue('focalLength', newFocalLength);
  }

  // Queues user input during api processing
  recursiveFocusPromise = ({nextValues, prevValues, formik}) => {
    if (!nextValues) {
      return;
    }

    if ((nextValues.isAutoFocusAfterZoom || prevValues.zoom !== nextValues.zoom) && prevValues.focalLength === nextValues.focalLength) {
      store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, true);
    }

    if (this.props.isApiProcessing) {
      this.setState({focalLengthQueue: nextValues.focalLength});
    } else {
      api.video.updateFocusSettings(nextValues)
        .then(() => {
          if (this.state.focalLengthQueue) {
            this.setState(
              {focalLengthQueue: null},
              this.recursiveFocusPromise({
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
          // Trigger react update to get the latest global state
          store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, false);
          if ((nextValues.isAutoFocusAfterZoom || prevValues.zoom !== nextValues.zoom) && prevValues.focalLength === nextValues.focalLength) {
            let prevFocalLength;
            store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, true);
            // Refresh focal length until previous value matches current value
            const refreshFocalLength = () => {
              api.video.getFocalLength()
                .then(response => {
                  if (prevFocalLength === response.data.focalLength) {
                    store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, false);
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
      this.recursiveFocusPromise({
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

  generateClickResetButtonHandler = () => event => {
    event.preventDefault();
    progress.start();
    api.video.resetSettings()
      .then(getRouter().reload)
      .finally(progress.done);
  };

  generateClickAutoFocusButtonHandler = form => event => {
    event.preventDefault();
    store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, true);
    this.submitPromise = this.submitPromise
      .then(api.video.startAutoFocus)
      .then(() => {
        let prevFocalLength;
        // Refresh focal length until previous value matches current value
        const refreshFocalLength = () => {
          api.video.getFocalLength()
            .then(response => {
              if (prevFocalLength === response.data.focalLength) {
                store.set(constants.store.UPDATE_FOCAL_LENGTH_FIELD, false);
              } else {
                prevFocalLength = response.data.focalLength;
                // Refresh focal length at 1hz
                setTimeout(refreshFocalLength, 1000);
              }

              return response.data.focalLength;
            })
            .then(focalLength => {
              form.setFieldValue('focalLength', focalLength);
            });
        };

        refreshFocalLength();
      });
  };

  videoSettingsFormRender = form => {
    const {values} = form;
    const {isApiProcessing, updateFocalLengthField} = this.props;
    return (
      <Form className="card shadow">
        <FormikEffect onChange={this.onChangeVideoSettings}/>
        <div className="card-header">{_('Image Settings')}</div>
        <div className="accordion" id="accordion-video-properties">
          {/* WDR */}
          <hr className="my-0"/>
          <div className="card-body">
            <div className="form-row">
              <div className="col-12 my-1 d-flex justify-content-between align-items-center">
                <span className="text-size-20">{_('WDR')}</span>
                <div className="custom-control custom-switch d-inline-block ml-2">
                  <Field
                    name="hdrEnabled"
                    type="checkbox"
                    checked={values.hdrEnabled === 'true' ? true : undefined}
                    className="custom-control-input"
                    id="switch-hdr-enabled"
                  />
                  <label className="custom-control-label" htmlFor="switch-hdr-enabled">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Picture */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#lightness">
                <i className="fas fa-chevron-up"/>{_('Picture')}
              </button>
            </h2>

            <div id="lightness" className="collapse show" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Brightness')}</label>
                  <span className="text-primary text-size-14">{values.brightness}</span>
                </div>
                <Field
                  updateFieldOnStop
                  name="brightness"
                  component={Slider}
                  step={1}
                  min={videoSettingsSchema.brightness.min}
                  max={videoSettingsSchema.brightness.max}
                />
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Contrast')}</label>
                  <span className="text-primary text-size-14">{values.contrast}</span>
                </div>
                <Field
                  updateFieldOnStop
                  name="contrast"
                  component={Slider}
                  step={1}
                  min={videoSettingsSchema.contrast.min}
                  max={videoSettingsSchema.contrast.max}
                />
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Sharpness')}</label>
                  <span className="text-primary text-size-14">{values.sharpness}</span>
                </div>
                <Field
                  updateFieldOnStop
                  name="sharpness"
                  component={Slider}
                  step={1}
                  min={videoSettingsSchema.sharpness.min}
                  max={videoSettingsSchema.sharpness.max}
                />
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Saturation')}</label>
                  <span className="text-primary text-size-14">{values.saturation}</span>
                </div>
                <Field
                  updateFieldOnStop
                  name="saturation"
                  component={Slider}
                  step={1}
                  min={videoSettingsSchema.saturation.min}
                  max={videoSettingsSchema.saturation.max}
                />
              </div>
            </div>
          </div>

          {/* Lens Control */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2 className="d-flex justify-content-between">
              <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#color">
                <i className="fas fa-chevron-up"/>{_('Lens Control')}
              </button>
              <div className="btn-group tip">
                <button
                  disabled={isApiProcessing || updateFocalLengthField}
                  type="button"
                  className="btn btn-outline-primary text-nowrap"
                  onClick={this.generateClickAutoFocusButtonHandler(form)}
                >
                  {_(values.focusType === FocusType.fullRange ? 'Full-Range Focus' : 'Short-Range Focus')}
                </button>
                <button
                  type="button"
                  disabled={isApiProcessing || updateFocalLengthField}
                  className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only">{_('Select Focus Type')}</span>
                </button>
                <div className="dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={this.generateOnChangeAutoFocusType(form, FocusType.fullRange)}>
                    {_('Full-Range Focus')}
                  </button>
                  <button type="button" className="dropdown-item" onClick={this.generateOnChangeAutoFocusType(form, FocusType.shortRange)}>
                    {_('Short-Range Focus')}
                  </button>
                </div>
              </div>
            </h2>

            {/* Focus */}
            <div id="color" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Focus')}</label>
                  <span className="d-none text-primary text-size-14">{values.focalLength}</span>
                </div>
                <div className="mt-2 d-flex align-items-center justify-content-between focal-length">
                  <div>
                    <CustomTooltip title="-5">
                      <button
                        disabled={updateFocalLengthField || isApiProcessing}
                        className="btn text-secondary-700"
                        type="button"
                        onClick={() => this.varyFocus(form, -5)}
                      >
                        <i type="button" className="fa fa-angle-double-left text-size-16"/>
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="-1">
                      <button
                        disabled={updateFocalLengthField || isApiProcessing}
                        className="btn text-secondary-700"
                        type="button"
                        onClick={() => this.varyFocus(form, -1)}
                      >
                        <i className="fas fa-minus text-size-16"/>
                      </button>
                    </CustomTooltip>
                  </div>
                  <div className="flex-grow-1">
                    <Field
                      updateFieldOnStop
                      enableArrowKey
                      disabled={updateFocalLengthField || isApiProcessing}
                      name="focalLength"
                      component={Slider}
                      step={1}
                      min={videoFocusSettingsSchema.focalLength.min}
                      max={videoFocusSettingsSchema.focalLength.max}
                    />
                  </div>

                  <div>
                    <CustomTooltip title="+1">
                      <button
                        disabled={updateFocalLengthField || isApiProcessing}
                        className="btn text-secondary-700"
                        type="button"
                        onClick={() => this.varyFocus(form, 1)}
                      >
                        <i className="fas fa-plus text-size-16"/>
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="+5">
                      <button
                        disabled={updateFocalLengthField || isApiProcessing}
                        className="btn text-secondary-700"
                        type="button"
                        onClick={() => this.varyFocus(form, 5)}
                      >
                        <i className="fa fa-angle-double-right text-size-16"/>
                      </button>
                    </CustomTooltip>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>Zoom</label>
                  <span className="text-primary text-size-14">{values.zoom}{('X')}</span>
                </div>
                <Field
                  updateFieldOnStop
                  enableArrowKey
                  disabled={updateFocalLengthField || isApiProcessing}
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
                  disabled={updateFocalLengthField || isApiProcessing}
                  className="form-check-input"
                  name="isAutoFocusAfterZoom"
                  checked={values.isAutoFocusAfterZoom}
                />
                <label className="form-check-label" htmlFor="input-check-auto-focus-after-zoom">
                  {_('Auto Focus after Zoom')}
                </label>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Iris')}</label>
                  <Field
                    name="aperture"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.aperture.enum.map(x => ({
                      value: x,
                      label: _(`aperture-${x}`)
                    }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Shutter Speed')}</label>
                  <Field
                    name="shutterSpeed"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.shutterSpeed.enum.map(x => ({
                      value: x,
                      label: _(`shutter-speed-${x}`)
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Configuration */}
          <hr className="my-0"/>
          <div className="card-body pb-0">
            <h2>
              <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#video">
                <i className="fas fa-chevron-up"/>{_('Image Configuration')}
              </button>
            </h2>

            <div id="video" className="collapse" data-parent="#accordion-video-properties">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label>{_('Auto White Balance')}</label>
                  <Field
                    name="whiteblanceMode"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.whiteblanceMode.enum.map(x => ({
                      value: x,
                      label: _(`white-balance-${x}`)
                    }))}
                  />
                </div>
                {
                  values.whiteblanceMode === WhiteBalanceType.manual && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Color Temperature')}</label>
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
                  <label>{_('IR Control')}</label>
                  <Field
                    name="irEnabled"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={utils.capitalizeObjKeyValuePairs(IREnableType).map(
                      x => ({
                        value: x.value,
                        label: _(x.key)
                      })
                    )}
                  />
                </div>
                {
                  values.irEnabled === IREnableType.on && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Level')}</label>
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
                  <label>{_('D/N')}</label>
                  <Field
                    name="daynightMode"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.daynightMode.enum.map(x => ({
                      value: x,
                      label: _(`daynight-mode-${x}`)
                    }))}
                  />
                </div>
                {
                  values.daynightMode === DaynightType.auto && (
                    <div className="well">
                      <div className="d-flex justify-content-between align-items-center">
                        <label>{_('Sensitivity')}</label>
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
                        <label>{_('Day Mode')}</label>
                        <span className="text-primary text-size-14">
                          {utils.formatTimeRange(values.dnDuty)}
                        </span>
                      </div>
                      <Field
                        updateFieldOnStop
                        name="dnDuty"
                        component={Slider}
                        mode="range"
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
                  <label>{_('Rotation')}</label>
                  <Field
                    name="orientation"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.orientation.enum.map(x => ({
                      value: x,
                      label: _(`orientation-${x}`)
                    }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Defog')}</label>
                  <Field
                    name="defoggingEnabled"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={[{
                      value: 'true',
                      label: _('On')
                    }, {
                      value: 'false',
                      label: _('Off')
                    }]}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{_('Lighting Compensation Frequency (Hz)')}</label>
                  <Field
                    name="refreshRate"
                    component={Dropdown}
                    buttonClassName="btn-link text-primary border-0 p-0"
                    menuClassName="dropdown-menu-right"
                    items={videoSettingsSchema.refreshRate.enum.map(x => ({
                      value: x,
                      label: _(`refresh-rate-${x}`)
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
            disabled={isApiProcessing || updateFocalLengthField}
            type="button"
            className="btn btn-outline-primary btn-block rounded-pill"
            onClick={this.generateClickResetButtonHandler()}
          >
            {_('Reset to Default Settings')}
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
