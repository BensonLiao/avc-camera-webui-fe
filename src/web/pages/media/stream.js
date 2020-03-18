const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const {renderError} = require('../../../core/utils');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamFormat = require('webserver-form-schema/constants/stream-format');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const _ = require('../../../languages');
const Dropdown = require('../../../core/components/fields/dropdown');

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    };
  }

  onSubmit = values => {
    progress.start();
    api.multimedia.updateStreamSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        renderError(error);
      });
  };

  onClickResetButton = event => {
    event.preventDefault();
    progress.start();
    api.multimedia.resetStreamSettings()
      .then(getRouter().reload)
      .catch(renderError)
      .catch(error => {
        progress.done();
        renderError(error);
      });
  };

  fieldsRender = (fieldNamePrefix, options, values) => {
    return (
      <>
        <div className="form-group">
          <label>{_('Format')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}.format`}
              component="select"
              className="form-control border-0"
            >
              {
                options.format.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Resolution')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}.resolution`}
              component="select"
              className="form-control border-0"
            >
              {
                options.resolution.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Frame Rate (FPS)')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}.frameRate`}
              component="select"
              className="form-control border-0"
            >
              {
                options.frameRate.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Bandwidth Management')}</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <Field
                name={`${fieldNamePrefix}.bandwidthManagement`}
                component={Dropdown}
                buttonClassName="btn btn-outline-primary rounded-left"
                menuClassName="dropdown-menu-right"
                items={options.bandwidthManagement.map(x => ({value: x.value, label: x.label}))}
              />
            </div>
            <Field type="text" name={`${fieldNamePrefix}.bitRate`} className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.mbr})}/>
            <input readOnly type="text" className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.vbr})} placeholder="Auto"/>
            <Field type="text" name={`${fieldNamePrefix}.bitRate`} className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.cbr})}/>
            <div className="input-group-append">
              <span className="input-group-text">Kbps</span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{_('GOV')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              name={`${fieldNamePrefix}.gov`}
              component="select"
              className="form-control border-0"
            >
              {
                options.gov.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              }
            </Field>
          </div>
        </div>
      </>
    );
  };

  formRender = ({values}) => {
    const channelAOptions = {
      format: StreamFormat.all().filter(x => x !== StreamFormat.mjpeg).map(x => ({label: x, value: x})),
      resolution: StreamResolution.all().filter(x => Number(x) <= 8 && Number(x) !== 4).map(x => ({label: _(`stream-resolution-${x}`), value: x})),
      frameRate: (() => {
        const result = [];
        for (let index = StreamSettingsSchema.channelA.props.frameRate.min; index <= StreamSettingsSchema.channelA.props.frameRate.max; index += 1) {
          result.push({label: `${index}`, value: `${index}`});
        }

        return result;
      })(),
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({label: _(`stream-bandwidth-management-${x}`), value: x})),
      gov: StreamGOV.all().map(x => ({label: x, value: x}))
    };
    const channelBOptions = {
      format: StreamFormat.all().filter(x => x !== StreamFormat.h265).map(x => ({label: x, value: x})),
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

        if (values.channelB.format === StreamFormat.mjpeg) {
          options = [
            StreamResolution['2'],
            StreamResolution['3'],
            StreamResolution['7'],
            StreamResolution['8']
          ];
        }

        return options.map(x => ({label: _(`stream-resolution-${x}`), value: x}));
      })(),
      frameRate: (() => {
        const result = [];
        for (let index = StreamSettingsSchema.channelB.props.frameRate.min; index <= StreamSettingsSchema.channelB.props.frameRate.max; index += 1) {
          result.push({label: `${index}`, value: `${index}`});
        }

        return result;
      })(),
      bandwidthManagement: StreamBandwidthManagement.all().map(x => ({label: _(`stream-bandwidth-management-${x}`), value: x})),
      gov: StreamGOV.all().map(x => ({label: x, value: x}))
    };

    return (
      <Form className="card-body">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="tab-channel-a">
            {this.fieldsRender('channelA', channelAOptions, values.channelA)}
          </div>
          <div className="tab-pane fade" id="tab-channel-b">
            {this.fieldsRender('channelB', channelBOptions, values.channelB)}
          </div>
        </div>

        <div className="form-group mt-5">
          <button
            type="submit"
            className="btn btn-block btn-primary rounded-pill"
            disabled={this.state.$isApiProcessing}
          >
            {_('Apply')}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-block btn-outline-primary rounded-pill"
          disabled={this.state.$isApiProcessing}
          onClick={this.onClickResetButton}
        >
          {_('Reset to Default')}
        </button>
      </Form>
    );
  };

  render() {
    const {streamSettings} = this.props;

    return (
      <div className="main-content left-menu-active">
        <section className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/media/stream">{_('Video')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Stream Settings')}</li>
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
                    initialValues={streamSettings}
                    onSubmit={this.onSubmit}
                  >
                    {this.formRender}
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
