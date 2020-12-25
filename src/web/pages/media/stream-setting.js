const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const {getRouter} = require('@benson.liao/capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const SensorResolution = require('webserver-form-schema/constants/sensor-resolution');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamCodec = require('webserver-form-schema/constants/stream-codec');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const StreamQuality = require('webserver-form-schema/constants/stream-quality');
const i18n = require('../../../i18n').default;
const utils = require('../../../core/utils');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const Dropdown = require('../../../core/components/fields/dropdown');
const SelectField = require('../../../core/components/fields/select-field');

const getBandwidthManagementOption = x => {
  switch (x) {
    default: return {};
    case StreamBandwidthManagement.mbr:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-bandwidth-management-0')
      };
    case StreamBandwidthManagement.vbr:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-bandwidth-management-1')
      };
    case StreamBandwidthManagement.cbr:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-bandwidth-management-2')
      };
  }
};

module.exports = class StreamSetting extends Base {
  static get propTypes() {
    // Make form ui for home page or not
    return {homePage: PropTypes.bool};
  }

  static get defaultProps() {
    return {homePage: false};
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = false;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('video.stream.modal.apiProcessingModalTitle');
    this.state.hasResolutionRatioChanged = false;
    this.state.channelOptions = this.processRenderOptions(props.streamSettings);
    // Enum to test for changing resolution aspect ratio
    this.fourByThree = [
      Number(StreamResolution['5']),
      Number(StreamResolution['6']),
      Number(StreamResolution['7']),
      Number(StreamResolution['8'])
    ];
    this.sixteenByNine = [
      Number(StreamResolution['0']),
      Number(StreamResolution['1']),
      Number(StreamResolution['2']),
      Number(StreamResolution['3'])
    ];
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  // Generate options based on selected value for channelA and channelB,
  // function is called when a value in Ch. A depends on Ch. B or vice versa has changed
  processRenderOptions = values => {
    return {
      chA: {
        codec: StreamCodec.all().filter(x => x !== StreamCodec.mjpeg && x !== StreamCodec.off).map(x => ({
          label: x,
          value: x
        })),
        resolution: StreamResolution.all()
          .filter(x => Number(x) <= 8 &&
                       Number(x) !== 4 &&
                       // Remove 4K option if detected sensor is 2K
                       !(`${this.props.systemInformation.sensorResolution}` === SensorResolution['2K'] &&
                        (Number(x) === 0 || Number(x) === 5 || Number(x) === 6)
                       )
          )
          .map(x => utils.getStreamResolutionOption(x)),
        frameRate: (() => {
          const result = [];
          for (let index = StreamSettingsSchema.channelA.props.frameRate.min;
            index <= StreamSettingsSchema.channelA.props.frameRate.max;
            index += 1) {
            result.push({
              label: `${index}`,
              value: `${index}`
            });
          }

          return result;
        })(),
        bandwidthManagement: StreamBandwidthManagement.all().map(x => getBandwidthManagementOption(x)),
        gov: StreamGOV.all().map(x => ({
          label: x,
          value: x
        }))
      },
      chB: {
        codec: StreamCodec.all().filter(x => x !== StreamCodec.h265).map(x => ({
          label: x,
          value: x
        })),
        resolution: (() => {
          let options;
          if (Number(values.channelA.resolution) <= Number(StreamResolution['4'])) {
            options = [
              StreamResolution['3'],
              StreamResolution['4']
            ];
          } else {
            options = [
              StreamResolution['9'],
              StreamResolution['10'],
              StreamResolution['11']
            ];
          }

          if (values.channelB.codec === StreamCodec.mjpeg) {
            if (Number(values.channelA.resolution) <= Number(StreamResolution['4'])) {
              options = [
                StreamResolution['2'],
                StreamResolution['3']
              ];
            } else {
              options = [
                StreamResolution['7'],
                StreamResolution['8']
              ];
            }
          }

          return options.map(x => utils.getStreamResolutionOption(x));
        })(),
        frameRate: (() => {
          const result = [];
          let min;
          let max;
          if (values.channelB.codec === StreamCodec.mjpeg) {
            if (
              Number(values.channelB.resolution) === Number(StreamResolution['2']) ||
                  Number(values.channelB.resolution) === Number(StreamResolution['7'])
            ) {
              min = 5;
              max = 10;
            } else {
              min = 5;
              max = 15;
            }
          } else {
            min = StreamSettingsSchema.channelB.props.frameRate.min;
            max = StreamSettingsSchema.channelB.props.frameRate.max;
          }

          for (let index = min; index <= max; index += 1) {
            result.push({
              label: `${index}`,
              value: `${index}`
            });
          }

          return result;
        })(),
        bandwidthManagement: StreamBandwidthManagement.all().map(x => getBandwidthManagementOption(x)),
        gov: StreamGOV.all().map(x => ({
          label: x,
          value: x
        })),
        quality: StreamQuality.all().map(x => {
          switch (x) {
            default: return {};
            case StreamQuality[0]:
              return {
                value: x,
                label: i18n.t('video.stream.constants.quality-80')
              };
            case StreamQuality[1]:
              return {
                value: x,
                label: i18n.t('video.stream.constants.quality-50')
              };
            case StreamQuality[2]:
              return {
                value: x,
                label: i18n.t('video.stream.constants.quality-30')
              };
          }
        })
      }
    };
  }

  onSubmit = values => {
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      isShowModal: false
    },
    () => {
      api.multimedia.updateStreamSettings(values)
        .then(getRouter().reload)
        .finally(() => {
          progress.done();
          this.hideApiProcessModal();
        });
    });
  };

  onClickResetButton = event => {
    event.preventDefault();
    progress.start();
    api.multimedia.resetStreamSettings()
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        this.hideApiProcessModal();
      });
  };

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  // Test if switching resolution aspect ratio
  hasResolutionChanged = (prev, current) => {
    if (this.fourByThree.includes(prev) && this.fourByThree.includes(current)) {
      return false;
    }

    if (this.sixteenByNine.includes(prev) && this.sixteenByNine.includes(current)) {
      return false;
    }

    return true;
  };

  // Logic for Codec field change
  onUpdateCodecField = (event, fieldNamePrefix, allValues, setFieldValue) => {
    event.persist();
    // formValues is values of channel A and channel B in Formik
    const formValues = JSON.parse(JSON.stringify(allValues));
    // newCodecValue is the new codec value
    const newCodecValue = event.target.value;
    // Logic for channel A CODEC change
    if (fieldNamePrefix === 'channelA') {
      // set channelA codec value for UI
      setFieldValue(`${fieldNamePrefix}.codec`, newCodecValue);
      // set formValues channel A codec value
      // must set this codec value because Formik does not get newest value right after setting field value.
      formValues.channelA.codec = newCodecValue;
      // setState with processRenderOptions to get new FPS/resolution options for channel A
      this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
        const {frameRate: frameRateA, resolution} = this.state.channelOptions.chA;
        setFieldValue(`${fieldNamePrefix}.frameRate`, this.lastIndexValue(frameRateA));
        setFieldValue(`${fieldNamePrefix}.resolution`, resolution[0].value);
      });
      // prev value of resolution comes from Formik's values
      const prev = Number(allValues.channelA.resolution);
      // current value of resolution comes from state, after using processRenderOptions to generate up to date values
      const current = Number(this.state.channelOptions.chA.resolution[0].value);
      // hasResolutionChanged uses prev and current resolution to check if resolution ratio has changed from 16:9 to 4:3 or vice versa
      if (this.hasResolutionChanged(prev, current)) {
        // if resolution ratio has changed, set state to true for updated modal warning
        this.setState({hasResolutionRatioChanged: true});
        // set Formik codec value for channel A to new value
        formValues.channelA.codec = newCodecValue;
        // set Formik channel A resolution to current values generated options
        formValues.channelA.resolution = this.state.channelOptions.chA.resolution[0].value;
        // set Formik channel B resolution to current values generated options
        formValues.channelB.resolution = this.state.channelOptions.chB.resolution[0].value;
        // set state with processRenderOptions with newly set values, to generate updated options for framerate and resolution
        this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
          // set channelB to updated options
          const {frameRate: frameRateB, resolution} = this.state.channelOptions.chB;
          // set channel B resolution to highest resolution
          setFieldValue('channelB.resolution', resolution[0].value);
          // set channel B frameRate to highest FPS in option
          setFieldValue('channelB.frameRate', this.lastIndexValue(frameRateB));
        });
      }
    }

    // Logic for channel B CODEC change
    if (fieldNamePrefix === 'channelB') {
      formValues.channelB.codec = newCodecValue;
      this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
        formValues.channelB.resolution = this.state.channelOptions.chB.resolution[0].value;
        this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
          const {frameRate: frameRateB} = this.state.channelOptions.chB;
          setFieldValue(`${fieldNamePrefix}.codec`, newCodecValue);
          setFieldValue(`${fieldNamePrefix}.resolution`, this.state.channelOptions.chB.resolution[0].value);
          setFieldValue(`${fieldNamePrefix}.frameRate`, this.lastIndexValue(frameRateB));
        });
      });
    }
  };

    // Logic for Resolution field change, updates field value to first option if options are updated
    // Solves dependent field values are not updated when provider has changed
    onUpdateResField = (event, fieldNamePrefix, allValues, setFieldValue) => {
      event.persist();
      const formValues = JSON.parse(JSON.stringify(allValues));
      const newResValue = event.target.value;
      setFieldValue(`${fieldNamePrefix}.resolution`, newResValue);
      const prev = Number(allValues.channelA.resolution);
      const current = Number(newResValue);
      if (fieldNamePrefix === 'channelA' && this.hasResolutionChanged(prev, current)) {
        this.setState({hasResolutionRatioChanged: true});
        formValues.channelA.resolution = newResValue;
        formValues.channelB.resolution = this.state.channelOptions.chB.resolution[0].value;
        this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
          const {frameRate: frameRateA} = this.state.channelOptions.chA;
          const {frameRate: frameRateB, resolution: resolutionB} = this.state.channelOptions.chB;
          setFieldValue('channelA.frameRate', this.lastIndexValue(frameRateA));
          setFieldValue('channelB.frameRate', this.lastIndexValue(frameRateB));
          setFieldValue('channelB.resolution', resolutionB[0].value);
        });
      }

      if (fieldNamePrefix === 'channelA' && !this.hasResolutionChanged(prev, current)) {
        formValues.channelA.resolution = newResValue;
        this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
          const {frameRate: frameRateA} = this.state.channelOptions.chA;
          setFieldValue(`${fieldNamePrefix}.frameRate`, this.lastIndexValue(frameRateA));
        });
      }

      // Update FPS field
      if (fieldNamePrefix === 'channelB') {
        formValues.channelB.resolution = newResValue;
        this.setState({channelOptions: this.processRenderOptions(formValues)}, () => {
          const {frameRate: frameRateB} = this.state.channelOptions.chB;
          setFieldValue(`${fieldNamePrefix}.frameRate`, this.lastIndexValue(frameRateB));
        });
      }
    };

    lastIndexValue = array => {
      return array[array.length - 1].value;
    };

  fieldsRender = (fieldNamePrefix, options, values, setFieldValue, allValues) => {
    const {homePage} = this.props;

    return (
      <>
        <SelectField
          labelName={i18n.t('video.stream.codec')}
          readOnly={homePage}
          name={`${fieldNamePrefix}.codec`}
          onChange={event => this.onUpdateCodecField(event, fieldNamePrefix, allValues, setFieldValue)}
        >
          {options.codec.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        <SelectField
          labelName={i18n.t('video.stream.resolution')}
          readOnly={homePage}
          name={`${fieldNamePrefix}.resolution`}
          onChange={event => this.onUpdateResField(event, fieldNamePrefix, allValues, setFieldValue)}
        >
          {options.resolution.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        <SelectField labelName={i18n.t('video.stream.fps')} name={`${fieldNamePrefix}.frameRate`}>
          {options.frameRate.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        {values.codec === StreamCodec.mjpeg && (
          <SelectField labelName={i18n.t('video.stream.quality')} name={`${fieldNamePrefix}.quality`}>
            {options.quality.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
        )}
        {values.codec !== StreamCodec.mjpeg && (
          <div className="form-group">
            <label>{i18n.t('video.stream.bandwidth')}</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <Field
                  name={`${fieldNamePrefix}.bandwidthManagement`}
                  component={Dropdown}
                  buttonClassName="btn btn-outline-primary rounded-left"
                  menuClassName="dropdown-menu-right"
                  items={options.bandwidthManagement.map(x => ({
                    value: x.value,
                    label: x.label
                  }))}
                />
              </div>
              <Field
                type="text"
                name={`${fieldNamePrefix}.bitRate`}
                validate={!(values.bandwidthManagement === StreamBandwidthManagement.vbr) && utils.validateStreamBitRate()}
                className={
                  classNames('form-control dynamic',
                    {show: values.bandwidthManagement === StreamBandwidthManagement.mbr}
                  )
                }
              />
              <input
                readOnly
                type="text"
                className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.vbr})}
                placeholder={i18n.t('video.stream.auto')}
              />
              <Field
                type="text"
                name={`${fieldNamePrefix}.bitRate`}
                className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.cbr})}
              />
              <div className="input-group-append">
                <span className="input-group-text">Kbps</span>
              </div>
            </div>
            <small className="text-info mb-3">
              {i18n.t('video.stream.constants.bitRateRange', {
                0: StreamSettingsSchema.channelA.props.bitRate.min,
                1: StreamSettingsSchema.channelA.props.bitRate.max
              })}
            </small>
            {!(values.bandwidthManagement === StreamBandwidthManagement.vbr) && (
              <div style={{display: 'block'}} className="invalid-feedback">
                <ErrorMessage name={`${fieldNamePrefix}.bitRate`}/>
              </div>
            )}
          </div>
        )}
        {values.codec !== StreamCodec.mjpeg && (
        /* GOP is same as GOV */
          <SelectField hide={homePage} readOnly={homePage} labelName={i18n.t('video.stream.gop')} name={`${fieldNamePrefix}.gov`}>
            {options.gov.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
        )}
      </>
    );
  };

  formRender = ({values, setFieldValue, errors}) => {
    const {isShowModal, $isApiProcessing} = this.state;
    const {chA, chB} = this.state.channelOptions;

    return (
      <Form className="card-body">
        <Tab.Content>
          <Tab.Pane eventKey="tab-channel-a">
            {this.fieldsRender('channelA', chA, values.channelA, setFieldValue, values)}
          </Tab.Pane>
        </Tab.Content>

        <Tab.Content>
          <Tab.Pane eventKey="tab-channel-b">
            {this.fieldsRender('channelB', chB, values.channelB, setFieldValue, values)}
          </Tab.Pane>
        </Tab.Content>

        <div className="form-group mt-5 mb-0">
          <button
            type="button"
            className="btn btn-block btn-primary rounded-pill"
            disabled={this.state.$isApiProcessing ||
              (errors.channelA && !(values.channelA.bandwidthManagement === StreamBandwidthManagement.vbr)) ||
              (errors.channelB && !(values.channelB.bandwidthManagement === StreamBandwidthManagement.vbr))}
            onClick={this.showModal}
          >
            {i18n.t('common.button.apply')}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-block btn-outline-primary rounded-pill d-none"
          disabled={this.state.$isApiProcessing}
          onClick={this.onClickResetButton}
        >
          {i18n.t('common.button.resetDefault')}
        </button>
        <CustomNotifyModal
          isShowModal={isShowModal}
          modalTitle={i18n.t('video.stream.streams')}
          modalBody={i18n.t(this.state.hasResolutionRatioChanged ?
            'video.stream.modal.confirmRatioChangeBody' :
            'video.stream.modal.confirmUpdateBody')}
          isConfirmDisable={$isApiProcessing}
          onHide={this.hideModal}
          onConfirm={() => {
            this.onSubmit(values);
          }}
        />
      </Form>
    );
  };

  render() {
    const {streamSettings, homePage} = this.props;
    return (
      <>
        <div className={classNames('card-header', (homePage && 'd-flex align-items-center justify-content-between rounded-0'))}>
          {i18n.t('video.stream.title')}
          {
            homePage && (
              <button
                type="button"
                className="btn btn-outline-light rounded-pill"
                disabled={this.state.$isApiProcessing}
                onClick={this.onClickResetButton}
              >
                {i18n.t('common.button.resetDefault')}
              </button>
            )
          }
        </div>
        <Tab.Container defaultActiveKey="tab-channel-a">
          <Nav>
            <Nav.Item>
              <Nav.Link eventKey="tab-channel-a">
                {i18n.t('video.stream.stream1')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab-channel-b">
                {i18n.t('video.stream.stream2')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Formik
            initialValues={streamSettings}
            onSubmit={this.onSubmit}
          >
            {this.formRender}
          </Formik>
        </Tab.Container>
        <CustomNotifyModal
          modalType="process"
          backdrop="static"
          isShowModal={this.state.isShowApiProcessModal}
          modalTitle={this.state.apiProcessModalTitle}
          onHide={this.hideApiProcessModal}
        />
      </>
    );
  }
};
