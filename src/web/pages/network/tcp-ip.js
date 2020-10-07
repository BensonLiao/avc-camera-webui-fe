const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const notify = require('../../../core/notify');
const i18n = require('../../i18n').default;
const {DEFAULT_PORTS} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class TCPIP extends Base {
  static get propTypes() {
    return {
      ddnsInfo: PropTypes.shape({
        isEnableDDNS: PropTypes.bool.isRequired,
        ddnsProvider: PropTypes.string.isRequired,
        ddnsHost: PropTypes.string.isRequired,
        ddnsAccount: PropTypes.string.isRequired,
        ddnsPassword: PropTypes.string.isRequired,
        ddnsRefreshStatus: PropTypes.bool.isRequired,
        ddnsHostStatus: PropTypes.bool.isRequired
      }).isRequired,
      httpInfo: PropTypes.shape({
        port: PropTypes.string.isRequired,
        port2: PropTypes.string
      }).isRequired,
      httpsSettings: PropTypes.shape({port: PropTypes.string.isRequired}).isRequired,
      rtspSettings: PropTypes.shape({
        tcpPort: PropTypes.string.isRequired,
        udpPort: PropTypes.string.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Device Processing');
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  checkValidatePort = values => {
    const {httpInfo, httpsSettings, rtspSettings} = this.props;
    let defaultPorts = DEFAULT_PORTS;

    let checkDefaultPortList = Object.keys(defaultPorts)
      .filter(items => items !== 'HTTP')
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
      values === httpsSettings.port) {
      return i18n.t('The specified port is reserved by system or in use!');
    }

    return utils.validatedPortCheck(values);
  }

  onSubmitDDNSForm = values => {
    progress.start();
    api.system.updateDDNSInfo(values)
      .then(response => {
        if (response.data.ddnsHostStatus) {
          notify.showSuccessNotification({
            title: i18n.t('Setting Success'),
            message: i18n.t('DDNS Setting Success!')
          });
        } else {
          notify.showErrorNotification({
            title: i18n.t('Setting Failed'),
            message: i18n.t('DDNS Setting Failed!')
          });
        }

        getRouter().reload();
      })
      .finally(progress.done);
  }

  onSubmitHTTPForm = values => {
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Updating Http Settings'),
      modalBody: i18n.t('Please wait')
    },
    () => {
      api.system.updateHttpInfo(values)
        .then(() => {
          const newAddress = `http://${location.hostname}:${values.port}`;
          this.setState({
            apiProcessModalTitle: i18n.t('Success'),
            modalBody: [`${i18n.t('Please Redirect Manually to the New Address')} :`, <a key="redirect" href={newAddress}>{newAddress}</a>]
          });
        })
        .catch(() => {
          progress.done();
          this.hideApiProcessModal();
        })
        .finally(progress.done);
    });
  }

  ddnsFormRender = ({values}) => {
    const {$isApiProcessing, isShowApiProcessModal} = this.state;
    return (
      <Tab.Content>
        <Tab.Pane eventKey="tab-ddns">
          <Form>

            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{i18n.t('DDNS Server')}</label>
              <div className="custom-control custom-switch">
                <Field name="isEnableDDNS" checked={values.isEnableDDNS} type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
                <label className="custom-control-label" htmlFor="switch-ddns-enable">
                  <span>{i18n.t('ON')}</span>
                  <span>{i18n.t('OFF')}</span>
                </label>
              </div>
            </div>
            <SelectField labelName={i18n.t('Server Provider')} name="ddnsProvider">
              <option value="dyn-dns">DynDNS.org</option>
            </SelectField>
            <div className="form-group">
              <label>{i18n.t('Host Name')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsHost"
                placeholder={i18n.t('Enter DDNS Host')}
                value={values.ddnsHost}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{i18n.t('Account')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsAccount"
                placeholder={i18n.t('Enter DDNS Account')}
                value={values.ddnsAccount}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{i18n.t('Password')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsPassword"
                placeholder={i18n.t('Enter DDNS Password')}
                value={values.ddnsPassword}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block rounded-pill"
              disabled={$isApiProcessing || isShowApiProcessModal}
            >{i18n.t('Apply')}
            </button>
          </Form>
        </Tab.Pane>
      </Tab.Content>
    );
  }

  httpFormRender = ({values, errors, touched}) => {
    return (
      <Tab.Content>
        <Tab.Pane eventKey="tab-http">
          <Form>
            <div className="form-group mb-5">
              <label>{i18n.t('Secondary Web Server Port')}</label>
              <Field
                name="port"
                className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                type="text"
                validate={this.checkValidatePort}
                placeholder={i18n.t('Enter Your Secondary Server Port')}
                value={values.port}
              />
              {errors.port && touched.port && (<div className="invalid-feedback">{errors.port}</div>)}
              <p className="text-size-14 text-muted mt-2">{i18n.t('1024 - 65535, except for 5555, 8443, 8554, 17300. Default primary port is 80.')}</p>
            </div>
            <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onClick}>{i18n.t('Apply')}</button>
          </Form>
        </Tab.Pane>
      </Tab.Content>
    );
  }

  render() {
    const {ddnsInfo, httpInfo} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Internet/Network Settings'), i18n.t('TCP/IP')]}
                routes={['/network/settings']}
              />
              <CustomNotifyModal
                isShowAllBtns={false}
                backdrop="static"
                modalType={this.state.$isApiProcessing ? 'process' : 'default'}
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                modalBody={this.state.modalBody}
                onHide={this.hideApiProcessModal}
              />

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {i18n.t('TCP/IP')}
                  </div>
                  <Tab.Container defaultActiveKey="tab-ddns">
                    <Nav>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-ddns">
                          {i18n.t('DDNS')}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-http">
                          {i18n.t('HTTP')}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <div className="card-body">
                      <Formik
                        initialValues={ddnsInfo}
                        onSubmit={this.onSubmitDDNSForm}
                      >
                        {this.ddnsFormRender}
                      </Formik>
                      <Formik
                        initialValues={httpInfo}
                        onSubmit={this.onSubmitHTTPForm}
                      >
                        {this.httpFormRender}
                      </Formik>
                    </div>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
