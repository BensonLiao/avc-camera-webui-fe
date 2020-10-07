const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Base = require('../shared/base');
const rtspSettingsValidator = require('../../validations/media/rtsp-settings-validator');
const {DEFAULT_PORTS} = require('../../../core/constants');
const utils = require('../../../core/utils');
const {default: i18n} = require('../../i18n');
const api = require('../../../core/apis/web-api');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

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
      httpsSettings: PropTypes.shape({port: PropTypes.string.isRequired}).isRequired
    };
  }

  checkValidatePort = (values, portType) => {
    const {httpInfo, httpsSettings, rtspSettings} = this.props;
    let defaultPorts = DEFAULT_PORTS;

    let checkDefaultPortList = Object.keys(defaultPorts)
      .filter(items => items !== portType)
      .reduce((obj, key) => ({
        ...obj,
        [key]: defaultPorts[key]
      }), {});

    checkDefaultPortList = utils.duplicateCheck(Object.values(checkDefaultPortList), values);
    // Check if using http port
    if (
      ((portType === 'RTSP_TCP') && (values === rtspSettings.udpPort)) ||
      ((portType === 'RTSP_UDP') && (values === rtspSettings.tcpPort)) ||
      checkDefaultPortList ||
      values === httpInfo.port ||
      values === httpInfo.port2 ||
      values === httpsSettings.port) {
      return i18n.t('The specified port is reserved by system or in use!');
    }

    return utils.validatedPortCheck(values);
  }

  onSubmitRTSPSettingsForm = values => {
    progress.start();
    api.multimedia.updateRTSPSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  rtspSettingsFormRender = ({values, errors, touched}) => {
    return (
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('Enable Audio over RTSP')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="isEnableAudioToStream"
              checked={values.isEnableAudioToStream}
              type="checkbox"
              className="custom-control-input"
              id="switch-voice-to-stream"
            />
            <label className="custom-control-label" htmlFor="switch-voice-to-stream">
              <span>{i18n.t('ON')}</span>
              <span>{i18n.t('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('Require Authentication')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnablePassword" checked={values.isEnablePassword} type="checkbox" className="custom-control-input" id="switch-auth"/>
            <label className="custom-control-label" htmlFor="switch-auth">
              <span>{i18n.t('ON')}</span>
              <span>{i18n.t('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{i18n.t('RTSP/TCP Port')}</label>
          <Field
            autoFocus
            name="tcpPort"
            type="text"
            placeholder="8554"
            validate={values => (this.checkValidatePort(values, 'RTSP_TCP'))}
            className={classNames('form-control', {'is-invalid': errors.tcpPort && touched.tcpPort})}
          />
          {
            errors.tcpPort && touched.tcpPort && (
              <div className="invalid-feedback">{errors.tcpPort}</div>
            )
          }
          <span className="form-text text-muted">{i18n.t('1024 - 65535, except for 5555, 8080, 8443, 17300.')}</span>
        </div>
        <div className="form-group">
          <label>{i18n.t('RTSP/UDP Port')}</label>
          <Field
            name="udpPort"
            type="text"
            className={classNames('form-control', {'is-invalid': errors.udpPort && touched.udpPort})}
            validate={values => (this.checkValidatePort(values, 'RTSP_UDP'))}
            placeholder="17300"
          />
          {
            errors.udpPort && touched.udpPort && (
              <div className="invalid-feedback">{errors.udpPort}</div>
            )
          }
          <span className="form-text text-muted">{i18n.t('1024 - 65535, except for 5555, 8080, 8443, 8554.')}</span>
        </div>
        <div className="form-group">
          <label>{i18n.t('Maximum Number of Connection')}</label>
          <Field
            name="connectionLimit"
            type="text"
            className={classNames('form-control', {'is-invalid': errors.connectionLimit && touched.connectionLimit})}
            placeholder="8"
          />
          {
            errors.connectionLimit && touched.connectionLimit && (
              <div className="invalid-feedback">{errors.connectionLimit}</div>
            )
          }
          <span className="form-text text-muted">1 - 8</span>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
          {i18n.t('Apply')}
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
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Video'), i18n.t('RTSP')]}
                routes={['/media/stream']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {i18n.t('RTSP')}
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
