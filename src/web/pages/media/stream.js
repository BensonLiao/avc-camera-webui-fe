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
const StreamBandwidthManagement =
  require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamVBRBitRateLevel =
  require('webserver-form-schema/constants/stream-vbr-bit-rate-level');
const StreamVBRMaxBitRate =
  require('webserver-form-schema/constants/stream-vbr-max-bit-rate');
const StreamCBRBitRate = require('webserver-form-schema/constants/stream-cbr-bit-rate');
const StreamGOP = require('webserver-form-schema/constants/stream-gop');
const _ = require('../../../languages');
const {channelA: {props: {frameRate}}} = StreamSettingsSchema;

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

  generateInitialValue = streamSettings => {
    if (streamSettings) {
      return {
        channelA: streamSettings,
        channelB: streamSettings
      };
    }

    return {
      channelA: {
        format: 'H264',
        resolution: '2',
        frameRate: '30',
        bandwidthManagement: 'VBR',
        vbrBitRateLevel: '1',
        vbrMaxBitRate: '12',
        cbrBitRate: '2',
        gop: '2'
      },
      channelB: {
        format: 'H264',
        resolution: '2',
        frameRate: '30',
        bandwidthManagement: 'VBR',
        vbrBitRateLevel: '1',
        vbrMaxBitRate: '12',
        cbrBitRate: '2',
        gop: '2'
      }
    };
  };

  renderFrameRateOption = () => {
    const options = [];
    for (let i = frameRate.min; i < frameRate.max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  formRender = (parentFieldName = '') => {
    return (
      <>
        <div className="form-group">
          <label>{_('Format')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}format`} component="select" className="form-control border-0">
              {
                StreamFormat.all().map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Resolution')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}resolution`} component="select" className="form-control border-0">
              {
                StreamResolution.all().map(resolution => (
                  <option key={resolution} value={resolution}>
                    {_(`stream-resolution-${resolution}`)}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Frame rate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}frameRate`} component="select" className="form-control border-0">
              {this.renderFrameRateOption()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Bandwidth management')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}bandwidthManagement`} component="select" className="form-control border-0">
              {
                StreamBandwidthManagement.all().map(bandwidthManagement => (
                  <option key={bandwidthManagement} value={bandwidthManagement}>
                    {bandwidthManagement}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('VBR bitrate level')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}vbrBitRateLevel`} component="select" className="form-control border-0">
              {
                StreamVBRBitRateLevel.all().map(vbrBitRateLevel => (
                  <option key={vbrBitRateLevel} value={vbrBitRateLevel}>
                    {_(`stream-vbr-bit-rate-level-${vbrBitRateLevel}`)}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('VBR max bitrate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}vbrMaxBitRate`} component="select" className="form-control border-0">
              {
                StreamVBRMaxBitRate.all().map(vbrMaxBitRate => (
                  <option key={vbrMaxBitRate} value={vbrMaxBitRate}>
                    {vbrMaxBitRate}Mb
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('CBR bitrate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}cbrBitRate`} component="select" className="form-control border-0">
              {
                StreamCBRBitRate.all().map(cbrBitRate => (
                  <option key={cbrBitRate} value={cbrBitRate}>
                    {cbrBitRate}MB
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('GOP')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name={`${parentFieldName}gop`} component="select" className="form-control border-0">
              {
                StreamGOP.all().map(gop => (
                  <option key={gop} value={gop}>
                    {_(`stream-gop-${gop}`)}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block btn-primary rounded-pill">
            {_('Apply')}
          </button>
        </div>
        <button type="button" className="btn btn-block btn-outline-primary rounded-pill">
          {_('Reset to defaults')}
        </button>
      </>
    );
  };

  onSubmit = ({channelA}) => {
    progress.start();
    api.multimedia.updateStreamSettings({channelA, channelB: channelA})
      .then(() => {
        getRouter().reload();
      })
      .catch(error => {
        progress.done();
        renderError(error);
      });
  };

  render() {
    const {streamSettings: {channelA}} = this.props;
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
                      <a className="nav-item nav-link active" data-toggle="tab" href="#tab-channel-a">
                        {_('Stream {0}', '01')}
                      </a>
                      <a className="nav-item nav-link" data-toggle="tab" href="#tab-channel-b">
                        {_('Stream {0}', '02')}
                      </a>
                    </div>
                  </nav>
                  <Formik
                    initialValues={this.generateInitialValue(channelA)}
                    onSubmit={this.onSubmit}
                  >
                    <Form>
                      <div className="card-body tab-content">
                        <div className="tab-pane fade show active" id="tab-channel-a">
                          {this.formRender('channelA.')}
                        </div>
                        <div className="tab-pane fade" id="tab-channel-b">
                          {this.formRender('channelA.')}
                        </div>
                      </div>
                    </Form>
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
