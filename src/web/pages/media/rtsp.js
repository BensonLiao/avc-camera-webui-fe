const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const rtspSettingsValidator = require('../../validations/media/rtsp-settings-validator');
const {DEFAULT_PORTS} = require('../../../core/constants');
const utils = require('../../../core/utils');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');

module.exports = class RTSP extends Base {
  static get propTypes() {
    return {
      rtspSettings: PropTypes.shape({
        isEnableAudioToStream: PropTypes.bool.isRequired,
        isEnablePassword: PropTypes.bool.isRequired,
        tcpPort: PropTypes.string.isRequired,
        udpPort: PropTypes.string.isRequired,
        connectionLimit: PropTypes.string.isRequired
      }).isRequired,
      httpInfo: PropTypes.shape({
        port: PropTypes.string.isRequired,
        port2: PropTypes.string
      }).isRequired,
      httpsSettings: PropTypes.shape({
        port: PropTypes.string.isRequired
      }).isRequired
    };
  }

  checkValidatePort = (values, portType) => {
    const {httpInfo, httpsSettings, rtspSettings} = this.props;
    let defaultPorts = DEFAULT_PORTS;

    let checkDefaultPortList = Object.keys(defaultPorts)
      .filter(items => items !== portType)
      .reduce((obj, key) => ({...obj, [key]: defaultPorts[key]}), {});

    checkDefaultPortList = utils.duplicateCheck(Object.values(checkDefaultPortList), values);
    // Check if using http port
    if (
      ((portType === 'RTSP_TCP') && (values === rtspSettings.udpPort)) ||
      ((portType === 'RTSP_UDP') && (values === rtspSettings.tcpPort)) ||
      checkDefaultPortList ||
      values === httpInfo.port ||
      values === httpInfo.port2 ||
      values === httpsSettings.port) {
      return _('This is a reserved port or is in use, please try another port.');
    }

    return utils.validatedPortCheck(values);
  }

  onSubmitRTSPSettingsForm = values => {
    progress.start();
    api.multimedia.updateRTSPSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  rtspSettingsFormRender = ({values, errors, touched}) => {
    return (
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Enable Audio over RTSP')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableAudioToStream" checked={values.isEnableAudioToStream} type="checkbox" className="custom-control-input" id="switch-voice-to-stream"/>
            <label className="custom-control-label" htmlFor="switch-voice-to-stream">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Require Authentication')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnablePassword" checked={values.isEnablePassword} type="checkbox" className="custom-control-input" id="switch-auth"/>
            <label className="custom-control-label" htmlFor="switch-auth">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('RTSP/TCP Port')}</label>
          <Field
            autoFocus
            name="tcpPort"
            type="text"
            placeholder="8554"
            validate={values => (this.checkValidatePort(values, 'RTSP_TCP'))}
            className={classNames('form-control', {'is-invalid': errors.tcpPort && touched.tcpPort})}/>
          {
            errors.tcpPort && touched.tcpPort && (
              <div className="invalid-feedback">{errors.tcpPort}</div>
            )
          }
          <span className="form-text text-muted">{_('1024 - 65535, except for 5555, 8080, 8443, 17300.')}</span>
        </div>
        <div className="form-group">
          <label>{_('RTSP/UDP Port')}</label>
          <Field
            name="udpPort"
            type="text"
            className={classNames('form-control', {'is-invalid': errors.udpPort && touched.udpPort})}
            validate={values => (this.checkValidatePort(values, 'RTSP_UDP'))}
            placeholder="17300"/>
          {
            errors.udpPort && touched.udpPort && (
              <div className="invalid-feedback">{errors.udpPort}</div>
            )
          }
          <span className="form-text text-muted">{_('1024 - 65535, except for 5555, 8080, 8443, 8554.')}</span>
        </div>
        <div className="form-group">
          <label>{_('Maximum Number of Connection')}</label>
          <Field name="connectionLimit" type="text"
            className={classNames('form-control', {'is-invalid': errors.connectionLimit && touched.connectionLimit})} placeholder="8"/>
          {
            errors.connectionLimit && touched.connectionLimit && (
              <div className="invalid-feedback">{errors.connectionLimit}</div>
            )
          }
          <span className="form-text text-muted">1 - 8</span>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {rtspSettings} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/media/stream">{_('Video')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('RTSP')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {_('RTSP')}
                  </div>
                  <Formik
                    initialValues={rtspSettings}
                    validate={utils.makeFormikValidator(rtspSettingsValidator)}
                    onSubmit={this.onSubmitRTSPSettingsForm}
                  >
                    {this.rtspSettingsFormRender}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
