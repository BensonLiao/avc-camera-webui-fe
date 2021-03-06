const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('@benson.liao/capybara-router');
const Base = require('../shared/base');
const rtspSettingsValidator = require('../../validations/media/rtsp-settings-validator');
const {DEFAULT_PORTS} = require('../../../core/constants');
const utils = require('../../../core/utils');
const i18n = require('../../../i18n').default;
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
      return i18n.t('validation.portReserved');
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
          <label className="mb-0">{i18n.t('video.rtsp.enableAudio')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="isEnableAudioToStream"
              checked={values.isEnableAudioToStream}
              type="checkbox"
              className="custom-control-input"
              id="switch-voice-to-stream"
            />
            <label className="custom-control-label" htmlFor="switch-voice-to-stream">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('video.rtsp.requireAuthentication')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnablePassword" checked={values.isEnablePassword} type="checkbox" className="custom-control-input" id="switch-auth"/>
            <label className="custom-control-label" htmlFor="switch-auth">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <div className="form-group ">
          <label>{i18n.t('video.rtsp.rtspTcpPort')}</label>
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
          <span className="form-text text-muted">{i18n.t('video.rtsp.tcpRange')}</span>
        </div>
        <div className="form-group">
          <label>{i18n.t('video.rtsp.rtspUdpPort')}</label>
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
          <span className="form-text text-muted">{i18n.t('video.rtsp.udpRange')}</span>
        </div>
        <div className="form-group">
          <label>{i18n.t('video.rtsp.maxConnections')}</label>
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
          {i18n.t('common.button.apply')}
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
                path={[i18n.t('navigation.sidebar.videoSettings'), i18n.t('navigation.sidebar.rtsp')]}
                routes={['/media/stream']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {i18n.t('video.rtsp.title')}
                  </div>
                  <Formik
                    initialValues={rtspSettings}
                    validate={rtspSettingsValidator}
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
