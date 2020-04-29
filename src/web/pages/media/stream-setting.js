const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const {renderError} = require('../../../core/utils');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');
const StreamCodec = require('webserver-form-schema/constants/stream-codec');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const _ = require('../../../languages');
const Dropdown = require('../../../core/components/fields/dropdown');
const utils = require('../../../core/utils');

module.exports = class StreamSetting extends Base {
  static get propTypes() {
    return {
      homePage: PropTypes.bool // Make form ui for home page or not
    };
  }

  static get defaultProps() {
    return {
      homePage: false
    };
  }

  onSubmit = values => {
    progress.start();
    api.multimedia.updateStreamSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
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
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  fieldsRender = (fieldNamePrefix, options, values) => {
    const {homePage} = this.props;

    return (
      <>
        <div className="form-group">
          <label>{_('Codec')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field
              readOnly={homePage}
              name={`${fieldNamePrefix}.codec`}
              component="select"
              className={classNames('form-control border-0', (homePage && 'select-readonly'))}
            >
              {
                options.codec.map(option => (
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
              readOnly={homePage}
              name={`${fieldNamePrefix}.resolution`}
              component="select"
              className={classNames('form-control border-0', (homePage && 'select-readonly'))}
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
                  items={options.bandwidthManagement.map(x => ({value: x.value, label: x.label}))}
                />
              </div>
              <Field
                type="text"
                name={`${fieldNamePrefix}.bitRate`}
                validate={utils.validateStreamBitRate()}
                className={
                  classNames('form-control dynamic',
                    {show: values.bandwidthManagement === StreamBandwidthManagement.mbr}
                  )
                }
              />
              <input readOnly type="text" className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.vbr})} placeholder="Auto"/>
              <Field type="text" name={`${fieldNamePrefix}.bitRate`} className={classNames('form-control dynamic', {show: values.bandwidthManagement === StreamBandwidthManagement.cbr})}/>
              <div className="input-group-append">
                <span className="input-group-text">Kbps</span>
              </div>
            </div>
            <small className="text-info mb-3">
              {_('{0} - {1} Kbps', [StreamSettingsSchema.channelA.props.bitRate.min, StreamSettingsSchema.channelA.props.bitRate.max])}
            </small>
            <div style={{display: 'block'}} className="invalid-feedback">
              <ErrorMessage name={`${fieldNamePrefix}.bitRate`}/>
            </div>
          </div>
        )}
        {values.codec !== StreamCodec.mjpeg && (
          <div className="form-group">
            {/* GOP is same as GOV */}
            <label>{_('GOP')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden">
              <Field
                readOnly={homePage}
                name={`${fieldNamePrefix}.gov`}
                component="select"
                className={classNames('form-control border-0', (homePage && 'select-readonly'))}
              >
                {
                  options.gov.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))
                }
              </Field>
            </div>
          </div>
        )}
      </>
    );
  };

  formRender = ({values}) => {
    const channelAOptions = {
      codec: StreamCodec.all().filter(x => x !== StreamCodec.mjpeg).map(x => ({label: x, value: x})),
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
      codec: StreamCodec.all().filter(x => x !== StreamCodec.h265).map(x => ({label: x, value: x})),
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
                {_('Reset to Default')}
              </button>
            )
          }
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
      </>
    );
  }
};
