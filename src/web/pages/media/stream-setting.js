const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamCodec = require('webserver-form-schema/constants/stream-codec');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const StreamQuality = require('webserver-form-schema/constants/stream-quality');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const Dropdown = require('../../../core/components/fields/dropdown');
const SelectField = require('../../../core/components/fields/select-field');

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
    this.state.apiProcessModalTitle = _('Updating Stream Settings');
    this.state.hasResolutionRatioChanged = false;
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
    this.channelAOptions = null;
    this.channelBOptions = null;
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  // call this function to update options for channelA and channelB,
  // this function should be called when a value in a depends on b or vice versa
  processRenderOptions = values => {
    this.channelAOptions = {
      codec: StreamCodec.all().filter(x => x !== StreamCodec.mjpeg && x !== StreamCodec.off).map(x => ({
        label: x,
        value: x
      })),
      resolution: StreamResolution.all().filter(x => Number(x) <= 8 && Number(x) !== 4).map(x => ({
        label: _(`stream-resolution-${x}`),
        value: x
      })),
      frameRate: (() => {
        const result = [];
        for (let index = StreamSettingsSchema.channelA.props.frameRate.min; index <= StreamSettingsSchema.channelA.props.frameRate.max; index += 1) {
          result.push({
            label: `${index}`,
            value: `${index}`
          });
        }

        return result;
      })(),
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({
        label: _(`stream-bandwidth-management-${x}`),
        value: x
      })),
      gov: StreamGOV.all().map(x => ({
        label: x,
        value: x
      }))
    };
    this.channelBOptions = {
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

        return options.map(x => ({
          label: _(`stream-resolution-${x}`),
          value: x
        }));
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
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({
        label: _(`stream-bandwidth-management-${x}`),
        value: x
      })),
      gov: StreamGOV.all().map(x => ({
        label: x,
        value: x
      })),
      quality: StreamQuality.all().map(x => ({
        label: _(`quality-${x}`),
        value: x
      }))
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

  fieldsRender = (fieldNamePrefix, options, values, setFieldValue, allValues) => {
    const {homePage} = this.props;

    // Logic for Resolution field change, updates field value to first option if options are updated
    // Solves dependent field values are not updated when provider has changed
    const onUpdateResField = event => {
      event.persist();
      const newResValue = event.target.value;
      setFieldValue(`${fieldNamePrefix}.resolution`, newResValue);
      const prev = Number(allValues.channelA.resolution);
      const current = Number(newResValue);
      if (fieldNamePrefix === 'channelA' && this.hasResolutionChanged(prev, current)) {
        this.setState({hasResolutionRatioChanged: true});
        this.processRenderOptions({
          ...allValues,
          channelA: {
            ...allValues.channelA,
            resolution: newResValue
          },
          channelB: {
            ...allValues.channelB,
            resolution: this.channelBOptions.resolution[0].value
          }
        });
        const maxFrameRateOptionA = this.channelAOptions.frameRate.length - 1;
        setFieldValue('channelA.frameRate', this.channelAOptions.frameRate[maxFrameRateOptionA].value);
        setFieldValue('channelB.resolution', this.channelBOptions.resolution[0].value);
        const maxFrameRateOptionB = this.channelBOptions.frameRate.length - 1;
        setFieldValue('channelB.frameRate', this.channelBOptions.frameRate[maxFrameRateOptionB].value);
      }

      if (fieldNamePrefix === 'channelA' && !this.hasResolutionChanged(prev, current)) {
        this.processRenderOptions({
          ...allValues,
          channelA: {
            ...allValues.channelA,
            resolution: newResValue
          }
        });
        const maxFrameRateOptionA = this.channelAOptions.frameRate.length - 1;
        setFieldValue(`${fieldNamePrefix}.frameRate`, this.channelAOptions.frameRate[maxFrameRateOptionA].value);
      }

      // Update FPS field
      if (fieldNamePrefix === 'channelB') {
        this.processRenderOptions({
          ...allValues,
          channelB: {
            ...allValues.channelB,
            resolution: newResValue
          }
        });

        const maxFrameRateOptionB = this.channelBOptions.frameRate.length - 1;
        setFieldValue(`${fieldNamePrefix}.frameRate`, this.channelBOptions.frameRate[maxFrameRateOptionB].value);
      }

      console.log('this.channelBOptions :>> ', this.channelBOptions);
      console.log('this.channelAOptions :>> ', this.channelAOptions);
    };

    // Logic for Codec field change
    const onUpdateCodecField = event => {
      event.persist();
      const newCodecValue = event.target.value;
      if (fieldNamePrefix === 'channelA') {
        setFieldValue(`${fieldNamePrefix}.codec`, newCodecValue);
        this.processRenderOptions({
          ...allValues,
          channelA: {
            ...allValues.channelA,
            codec: newCodecValue
          }
        });
        const maxFrameRateOptionA = this.channelAOptions.frameRate.length - 1;
        setFieldValue(`${fieldNamePrefix}.frameRate`, this.channelAOptions.frameRate[maxFrameRateOptionA].value);
        setFieldValue(`${fieldNamePrefix}.resolution`, this.channelAOptions.resolution[0].value);
        const prev = Number(allValues.channelA.resolution);
        const current = Number(this.channelAOptions.resolution[0].value);
        if (this.hasResolutionChanged(prev, current)) {
          this.setState({hasResolutionRatioChanged: true});
          this.processRenderOptions({
            ...allValues,
            channelA: {
              ...allValues.channelA,
              codec: newCodecValue,
              resolution: this.channelAOptions.resolution[0].value
            },
            channelB: {
              ...allValues.channelB,
              resolution: this.channelBOptions.resolution[0].value
            }
          });
          setFieldValue('channelB.resolution', this.channelBOptions.resolution[0].value);
          const maxFrameRateOptionB = this.channelBOptions.frameRate.length - 1;
          setFieldValue('channelB.frameRate', this.channelBOptions.frameRate[maxFrameRateOptionB].value);
        }
      }

      if (fieldNamePrefix === 'channelB') {
        setFieldValue(`${fieldNamePrefix}.codec`, newCodecValue);
        this.processRenderOptions({
          ...allValues,
          channelB: {
            ...allValues.channelB,
            codec: newCodecValue,
            resolution: this.channelBOptions.resolution[0].value
          }
        });
        setFieldValue(`${fieldNamePrefix}.resolution`, this.channelBOptions.resolution[0].value);
        this.processRenderOptions({
          ...allValues,
          channelB: {
            ...allValues.channelB,
            codec: newCodecValue,
            resolution: this.channelBOptions.resolution[0].value
          }
        });
        const maxFrameRateOptionB = this.channelBOptions.frameRate.length - 1;
        setFieldValue(`${fieldNamePrefix}.frameRate`, this.channelBOptions.frameRate[maxFrameRateOptionB].value);
      }
    };

    return (
      <>
        <SelectField
          labelName={_('Codec')}
          readOnly={homePage}
          name={`${fieldNamePrefix}.codec`}
          onChange={event => onUpdateCodecField(event)}
        >
          {options.codec.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        <SelectField
          labelName={_('Resolution')}
          readOnly={homePage}
          name={`${fieldNamePrefix}.resolution`}
          onChange={event => onUpdateResField(event)}
        >
          {options.resolution.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        <SelectField labelName={_('Frame Rate (FPS)')} name={`${fieldNamePrefix}.frameRate`}>
          {options.frameRate.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        {values.codec === StreamCodec.mjpeg && (
          <SelectField labelName={_('Quality')} name={`${fieldNamePrefix}.quality`}>
            {options.quality.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
        )}
        {values.codec !== StreamCodec.mjpeg && (
          <div className="form-group">
            <label>{_('Bandwidth Management')}</label>
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
                placeholder="Auto"
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
              {_('{0} - {1} Kbps', [StreamSettingsSchema.channelA.props.bitRate.min, StreamSettingsSchema.channelA.props.bitRate.max])}
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
          <SelectField hide={homePage} readOnly={homePage} labelName={_('GOP')} name={`${fieldNamePrefix}.gov`}>
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
    this.processRenderOptions(values);

    return (
      <Form className="card-body">

        <Tab.Content>
          <Tab.Pane eventKey="tab-channel-a">
            {this.fieldsRender('channelA', this.channelAOptions, values.channelA, setFieldValue, values)}
          </Tab.Pane>
        </Tab.Content>

        <Tab.Content>
          <Tab.Pane eventKey="tab-channel-b">
            {this.fieldsRender('channelB', this.channelBOptions, values.channelB, setFieldValue, values)}
          </Tab.Pane>
        </Tab.Content>

        <div className="form-group mt-5">
          <button
            type="button"
            className="btn btn-block btn-primary rounded-pill"
            disabled={this.state.$isApiProcessing ||
              (errors.channelA && !(values.channelA.bandwidthManagement === StreamBandwidthManagement.vbr)) ||
              (errors.channelB && !(values.channelB.bandwidthManagement === StreamBandwidthManagement.vbr))}
            onClick={this.showModal}
          >
            {_('Apply')}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-block btn-outline-primary rounded-pill d-none"
          disabled={this.state.$isApiProcessing}
          onClick={this.onClickResetButton}
        >
          {_('Reset to Default Settings')}
        </button>
        <CustomNotifyModal
          isShowModal={isShowModal}
          modalTitle={_('Stream Settings')}
          modalBody={this.state.hasResolutionRatioChanged ?
            _('Changing stream 1 resolution ratio will also update stream 2 resolution settings.') :
            _('Are you sure you want to update stream settings?')}
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
          {homePage ? (_('Stream Settings')) : (_('Settings'))}
          {
            homePage && (
              <button
                type="button"
                className="btn btn-outline-light rounded-pill"
                disabled={this.state.$isApiProcessing}
                onClick={this.onClickResetButton}
              >
                {_('Reset to Default Settings')}
              </button>
            )
          }
        </div>
        <Tab.Container defaultActiveKey="tab-channel-a">
          <Nav>
            <Nav.Item>
              <Nav.Link eventKey="tab-channel-a">
                {_('Stream {0}', '01')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab-channel-b">
                {_('Stream {0}', '02')}
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
