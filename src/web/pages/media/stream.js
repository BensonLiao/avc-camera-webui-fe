const React = require('react');
const PropTypes = require('prop-types');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
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
      return streamSettings;
    }

    return {
      format: 'H264',
      resolution: '2',
      frameRate: '30',
      bandwidthManagement: 'VBR',
      vbrBitRateLevel: '1',
      vbrMaxBitRate: '12',
      cbrBitRate: '2',
      gop: '2'
    };
  };

  renderFrameRateOption = () => {
    const {channelA: {props: {frameRate}}} = StreamSettingsSchema;
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

  formRender = () => {
    return (
      <Form>
        <div className="form-group">
          <label>影像格式</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="format" component="select" className="form-control border-0">
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
          <label>解新度</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="resolution" component="select" className="form-control border-0">
              {
                StreamResolution.all().map(resolution => (
                  <option key={resolution} value={resolution}>
                    {resolution}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>每秒傳送張數</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="frameRate" component="select" className="form-control border-0">
              {this.renderFrameRateOption()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>頻寬管理</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="bandwidthManagement" component="select" className="form-control border-0">
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
          <label>可變比特率(VBR)</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="vbrBitRateLevel" component="select" className="form-control border-0">
              {
                StreamVBRBitRateLevel.all().map(vbrBitRateLevel => (
                  <option key={vbrBitRateLevel} value={vbrBitRateLevel}>
                    {vbrBitRateLevel}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>最佳可變比特率(VBR Max Bitrate)</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="vbrMaxBitRate" component="select" className="form-control border-0">
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
          <label>固定比特率(CBR)</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="cbrBitRate" component="select" className="form-control border-0">
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
          <label>圖像群組(GOP)</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="gop" component="select" className="form-control border-0">
              {
                StreamGOP.all().map(gop => (
                  <option key={gop} value={gop}>
                    {gop}
                  </option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block btn-primary rounded-pill">套用</button>
        </div>
        <button type="button" className="btn btn-block btn-outline-primary rounded-pill">恢復預設</button>
      </Form>
    );
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

              <div className="col-6 col-xl-4">
                <div className="card shadow">
                  <div className="card-header">
                    串流01
                  </div>
                  <div className="card-body">
                    <Formik
                      initialValues={this.generateInitialValue(channelA)}
                      onSubmit={this.onSubmitForm}
                    >
                      {this.formRender}
                    </Formik>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4">
                <div className="card shadow">
                  <div className="card-header">
                    串流02
                  </div>
                  <div className="card-body">
                    <Formik
                      initialValues={this.generateInitialValue(channelA)}
                      onSubmit={this.onSubmitForm}
                    >
                      {this.formRender}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};
