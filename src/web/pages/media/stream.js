const React = require('react');
const PropTypes = require('prop-types');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const {renderError} = require('../../../core/utils');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamFormat = require('webserver-form-schema/constants/stream-format');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamVBRBitRateLevel = require('webserver-form-schema/constants/stream-vbr-bit-rate-level');
const StreamVBRMaxBitRate = require('webserver-form-schema/constants/stream-vbr-max-bit-rate');
const StreamCBRBitRate = require('webserver-form-schema/constants/stream-cbr-bit-rate');
const StreamGOP = require('webserver-form-schema/constants/stream-gop');
const _ = require('../../../languages');
const {channelA: {props: {frameRate}}} = StreamSettingsSchema;
// 解析度對照
// 'stream-resolution-0': '3840*2160(16:9)',
// 'stream-resolution-1': '1920*1080(16:9)',
// 'stream-resolution-2': '1280*720(16:9)',
// 'stream-resolution-3': '2048*1536(4:3)',
// 'stream-resolution-4': '1600*1200(4:3)',
// 'stream-resolution-5': '1280*960(4:3)',
const StreamResolutionMapping = {
  0: [],
  1: [StreamResolution['2'], StreamResolution['5']],
  2: [StreamResolution['2']],
  3: [StreamResolution['5']],
  4: [StreamResolution['5']],
  5: [StreamResolution['5']]
};

const StreamCBRBitRateMapping = {
  channelA: {
    0: [StreamCBRBitRate['8'], StreamCBRBitRate['6']],
    1: [StreamCBRBitRate['8'], StreamCBRBitRate['6'], StreamCBRBitRate['4'], StreamCBRBitRate['2']],
    2: [StreamCBRBitRate['6'], StreamCBRBitRate['4'], StreamCBRBitRate['2']],
    3: [StreamCBRBitRate['8'], StreamCBRBitRate['6'], StreamCBRBitRate['4'], StreamCBRBitRate['2']],
    4: [StreamCBRBitRate['8'], StreamCBRBitRate['6'], StreamCBRBitRate['4'], StreamCBRBitRate['2']],
    5: [StreamCBRBitRate['6'], StreamCBRBitRate['4'], StreamCBRBitRate['2']]
  },
  channelB: {
    2: [StreamCBRBitRate['4'], StreamCBRBitRate['2']],
    5: [StreamCBRBitRate['4'], StreamCBRBitRate['2']]
  }
};

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          vbrBitRateLevel: PropTypes.string.isRequired,
          vbrMaxBitRate: PropTypes.string.isRequired,
          cbrBitRate: PropTypes.string.isRequired,
          gop: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          vbrBitRateLevel: PropTypes.string.isRequired,
          vbrMaxBitRate: PropTypes.string.isRequired,
          cbrBitRate: PropTypes.string.isRequired,
          gop: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.channelA = {
      cbrBitRateOptions: undefined
    };
    this.state.channelB = {
      resolutionOptions: undefined,
      bandwidthManagementOptions: undefined,
      cbrBitRateOptions: undefined,
      vbrMaxBitRateOptions: [StreamVBRMaxBitRate['4'], StreamVBRMaxBitRate['2']]
    };
  }

  generateInitialValues = streamSettings => {
    if (streamSettings) {
      return streamSettings;
    }

    return {
      channelA: {
        format: StreamFormat.h264,
        resolution: StreamResolution['0'],
        frameRate: '30',
        bandwidthManagement: StreamBandwidthManagement.vbr,
        vbrBitRateLevel: StreamVBRBitRateLevel.complete,
        vbrMaxBitRate: StreamVBRMaxBitRate['12'],
        cbrBitRate: StreamCBRBitRate['6'],
        gop: StreamGOP['1']
      },
      channelB: {
        format: StreamFormat.mJpeg,
        resolution: StreamResolution['0'],
        frameRate: '30',
        bandwidthManagement: StreamBandwidthManagement.vbr,
        vbrBitRateLevel: StreamVBRBitRateLevel.complete,
        vbrMaxBitRate: StreamVBRMaxBitRate['1'],
        cbrBitRate: StreamCBRBitRate['1'],
        gop: StreamGOP['1']
      }
    };
  };

  getParentFieldName = fieldName => {
    if (typeof fieldName !== 'string') {
      return '';
    }

    return fieldName.substring(0, fieldName.indexOf('.'));
  }

  filterByMaps = (targetValue, maps) => {
    return maps[targetValue];
  }

  onResolutionChange = onChange => {
    return event => {
      const parentFieldName = this.getParentFieldName(event.target.name);
      if (parentFieldName === 'channelA') {
        const filterBandwidthManagementOptions = event.target.value === '0' ? [StreamBandwidthManagement.cbr] :
          StreamBandwidthManagement.all();
        const filterResolutions = this.filterByMaps(
          event.target.value,
          StreamResolutionMapping
        );
        this.setState(prevState => {
          return {
            channelB: {
              ...prevState.channelB,
              resolutionOptions: filterResolutions,
              bandwidthManagementOptions: filterBandwidthManagementOptions
            }
          };
        });
      }

      const filterCBRBitRateOptions = this.filterByMaps(
        event.target.value,
        StreamCBRBitRateMapping[parentFieldName]
      );
      this.setState(prevState => {
        return {
          [parentFieldName]: {
            ...prevState[parentFieldName],
            cbrBitRateOptions: filterCBRBitRateOptions
          }
        };
      });

      if (typeof onChange === 'function') {
        onChange(event);
      }
    };
  };

  renderFrameRateOption = () => {
    const options = [];
    for (let i = frameRate.min; i <= frameRate.max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  formRender = (props, fieldNamePrefix = '') => {
    const parentFieldName = this.getParentFieldName(fieldNamePrefix);
    const {[parentFieldName]: channel} = this.state;
    const resolutionOptions = channel.resolutionOptions || StreamResolution.all();
    const bandwidthManagementOptions = channel.bandwidthManagementOptions || StreamBandwidthManagement.all();
    const cbrBitRateOptions = channel.cbrBitRateOptions || StreamCBRBitRate.all();
    const vbrMaxBitRateOptions = channel.vbrMaxBitRateOptions || StreamVBRMaxBitRate.all();
    return (
      <Form>
        <div className="form-group">
          <label>{_('Format')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}format`}
              component="select"
              className="form-control border-0"
            >
              {StreamFormat.all().map(format => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Resolution')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}resolution`}
              component="select"
              className="form-control border-0"
              onChange={this.onResolutionChange(props.handleChange)}
            >
              {resolutionOptions.map(resolution => (
                <option key={resolution} value={resolution}>
                  {_(`stream-resolution-${resolution}`)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Frame rate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}frameRate`}
              component="select"
              className="form-control border-0"
            >
              {this.renderFrameRateOption()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Bandwidth management')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}bandwidthManagement`}
              component="select"
              className="form-control border-0"
            >
              {bandwidthManagementOptions.map(bandwidthManagement => (
                <option key={bandwidthManagement} value={bandwidthManagement}>
                  {bandwidthManagement}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('VBR bitrate level')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}vbrBitRateLevel`}
              component="select"
              className="form-control border-0"
            >
              {StreamVBRBitRateLevel.all().map(vbrBitRateLevel => (
                <option key={vbrBitRateLevel} value={vbrBitRateLevel}>
                  {_(`stream-vbr-bit-rate-level-${vbrBitRateLevel}`)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('VBR max bitrate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}vbrMaxBitRate`}
              component="select"
              className="form-control border-0"
            >
              {vbrMaxBitRateOptions.map(vbrMaxBitRate => (
                <option key={vbrMaxBitRate} value={vbrMaxBitRate}>
                  {vbrMaxBitRate}Mb
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('CBR bitrate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}cbrBitRate`}
              component="select"
              className="form-control border-0"
            >
              {cbrBitRateOptions.map(cbrBitRate => (
                <option key={cbrBitRate} value={cbrBitRate}>
                  {cbrBitRate}MB
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('GOP')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}gop`}
              component="select"
              className="form-control border-0"
            >
              {StreamGOP.all().map(gop => (
                <option key={gop} value={gop}>
                  {_(`stream-gop-${gop}`)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block btn-primary rounded-pill">
            {_('Apply')}
          </button>
        </div>
        <button type="button" className="btn btn-block btn-outline-primary rounded-pill" onClick={this.generateClickResetButtonHandler(props)}>
          {_('Reset to defaults')}
        </button>
      </Form>
    );
  };

  onSubmit = ({channelA, channelB}) => {
    progress.start();
    api.multimedia.updateStreamSettings({channelA, channelB})
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        renderError(error);
      });
  };

  generateClickResetButtonHandler = ({resetForm}) => event => {
    event.preventDefault();
    progress.start();
    api.multimedia.resetStreamSettings()
      .then(() => api.multimedia.getStreamSettings())
      .then(response => resetForm({values: this.generateInitialValues(response.data)}))
      .catch(renderError)
      .finally(progress.done);
  }

  render() {
    const {streamSettings} = this.props;
    return (
      <div className="main-content left-menu-active">
        <section className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <a href="/media/stream">{_('Multimedia settings')}</a>
                    </li>
                    <li className="breadcrumb-item">{_('Stream settings')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {_('Settings')}
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
                  <Formik
                    initialValues={this.generateInitialValues(streamSettings)}
                    onSubmit={this.onSubmit}
                  >
                    {props => (
                      <div className="card-body tab-content">
                        <div className="tab-pane fade show active" id="tab-channel-a">
                          {this.formRender(props, 'channelA.')}
                        </div>
                        <div className="tab-pane fade" id="tab-channel-b">
                          {this.formRender(props, 'channelB.')}
                        </div>
                      </div>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};
