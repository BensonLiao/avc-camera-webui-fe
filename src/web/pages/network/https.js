const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const CertificateType = require('webserver-form-schema/constants/certificate-type');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const {DEFAULT_PORTS} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;
const ProgressIndicator = require('../../../core/components/progress-indicator').default;

const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info');

module.exports = class HTTPS extends Base {
  static get propTypes() {
    return {
      httpsSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        port: PropTypes.string.isRequired,
        certificateType: PropTypes.oneOf(CertificateType.all()).isRequired
      }).isRequired,
      httpInfo: PropTypes.shape({
        port: PropTypes.string.isRequired,
        port2: PropTypes.string
      }).isRequired,
      rtspSettings: PropTypes.shape({
        tcpPort: PropTypes.string.isRequired,
        udpPort: PropTypes.string.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = false;
    this.state.modalBody = i18n.t('Please Redirect Manually to the New Address');
  }

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  checkValidatePort = values => {
    const {httpInfo, rtspSettings} = this.props;
    let defaultPorts = DEFAULT_PORTS;

    let checkDefaultPortList = Object.keys(defaultPorts)
      .filter(items => items !== 'HTTPS')
      .reduce((obj, key) => ({
        ...obj,
        [key]: defaultPorts[key]
      }), {});

    checkDefaultPortList = utils.duplicateCheck(Object.values(checkDefaultPortList), values);
    // Check if using http port
    if (
      checkDefaultPortList ||
      values === rtspSettings.udpPort ||
      values === rtspSettings.tcpPort ||
      values === httpInfo.port2 ||
      values === httpInfo.port) {
      return i18n.t('The specified port is reserved by system or in use!');
    }

    return utils.validatedPortCheck(values);
  }

  onSubmitForm = values => {
    progress.start();
    // Set delay time and wait for nodejs restart complete
    // Note. this is not a reliable solution cause the waiting time may vary from different environment
    api.system.updateHttpsSettings(values)
      .then(() => {
        const newAddress = `${values.isEnable ? 'https' : 'http'}://${location.hostname}${values.isEnable ? `:${values.port}` : ''}`;
        this.setState({
          isShowModal: true,
          modalBody: [
            `${i18n.t('Please Redirect Manually to the New Address')} :`,
            <div key="redirect" className="d-flex">
              <ProgressIndicator
                className="ml-0"
                status="start"
              />
              <span style={{color: infoColor}}>{newAddress}</span>
            </div>
          ]
        }, () => {
          setTimeout(() => {
            this.setState({
              modalBody: [
                `${i18n.t('Please Redirect Manually to the New Address')} :`,
                <div key="redirect" className="d-flex">
                  <ProgressIndicator
                    className="ml-0"
                    status="done"
                  />
                  <a href={newAddress}>{newAddress}</a>
                </div>
              ]
            });
          }, 10 * 1000);
        });
      })
      .finally(progress.done);
  };

  formRender = ({values, errors, touched}) => {
    const {$isApiProcessing, isShowModal, modalBody} = this.state;
    const {httpsSettings} = this.props;

    return (
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label>HTTPS</label>
          <div className="custom-control custom-switch">
            <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-enable"/>
            <label className="custom-control-label" htmlFor="switch-enable">
              <span>{i18n.t('ON')}</span>
              <span>{i18n.t('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{i18n.t('Port')}</label>
          <Field
            name="port"
            type="text"
            validate={this.checkValidatePort}
            className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
          />
          {
            errors.port && touched.port && (
              <div className="invalid-feedback">{errors.port}</div>
            )
          }
          <p className="text-size-14 text-muted mt-2">{i18n.t('1024 - 65535, except for 5555, 8080, 8554, 17300.')}</p>
        </div>
        <SelectField labelName={i18n.t('Certificate')} name="certificateType">
          <option value={CertificateType.selfSigned}>{i18n.t(`certificate-type-${CertificateType.selfSigned}`)}</option>
        </SelectField>
        <CustomTooltip show={(httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false} title={i18n.t('Please Enable HTTPS')}>
          <div>
            <button
              disabled={
                $isApiProcessing ||
                !utils.isObjectEmpty(errors) ||
                ((httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false)
              }
              className="btn btn-primary btn-block rounded-pill"
              type="submit"
              style={(httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false ? {pointerEvents: 'none'} : {}}
            >
              {i18n.t('Apply')}
            </button>
          </div>
        </CustomTooltip>
        <CustomNotifyModal
          isShowAllBtns={false}
          backdrop="static"
          isShowModal={isShowModal}
          modalTitle={i18n.t('Success')}
          modalBody={modalBody}
          onConfirm={this.hideModal}
          onHide={this.hideModal}
        />
      </Form>
    );
  };

  render() {
    const {httpsSettings} = this.props;
    const {validator} = this.state;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Internet/Network Settings'), 'HTTPS']}
                routes={['/network/settings']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">HTTPS</div>
                  <Formik
                    initialValues={httpsSettings}
                    validate={validator}
                    onSubmit={this.onSubmitForm}
                  >
                    {this.formRender}
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
