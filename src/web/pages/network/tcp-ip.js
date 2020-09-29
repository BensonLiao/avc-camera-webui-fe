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
const _ = require('../../../languages');
const {DEFAULT_PORTS} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const SelectField = require('../../../core/components/fields/select-field');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

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
    this.state.apiProcessModalTitle = _('Device Processing');
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
      return _('The specified port is reserved by system or in use!');
    }

    return utils.validatedPortCheck(values);
  }

  onSubmitDDNSForm = values => {
    progress.start();
    api.system.updateDDNSInfo(values)
      .then(response => {
        if (response.data.ddnsHostStatus) {
          notify.showSuccessNotification({
            title: _('Setting Success'),
            message: _('DDNS Setting Success!')
          });
        } else {
          notify.showErrorNotification({
            title: _('Setting Failed'),
            message: _('DDNS Setting Failed!')
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
      apiProcessModalTitle: _('Updating Http Settings'),
      modalBody: _('Please wait')
    },
    () => {
      api.system.updateHttpInfo(values)
        .then(() => {
          const newAddress = `http://${location.hostname}:${values.port}`;
          this.setState({
            apiProcessModalTitle: _('Success'),
            modalBody: [`${_('Please Redirect Manually to the New Address')} :`, <a key="redirect" href={newAddress}>{newAddress}</a>]
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
              <label className="mb-0">{_('DDNS Server')}</label>
              <div className="custom-control custom-switch">
                <Field name="isEnableDDNS" checked={values.isEnableDDNS} type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
                <label className="custom-control-label" htmlFor="switch-ddns-enable">
                  <span>{_('ON')}</span>
                  <span>{_('OFF')}</span>
                </label>
              </div>
            </div>
            <SelectField labelName={_('Server Provider')} name="ddnsProvider">
              <option value="dyn-dns">DynDNS.org</option>
            </SelectField>
            <div className="form-group">
              <label>{_('Host Name')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsHost"
                placeholder={_('Enter DDNS Host')}
                value={values.ddnsHost}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{_('Account')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsAccount"
                placeholder={_('Enter DDNS Account')}
                value={values.ddnsAccount}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{_('Password')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsPassword"
                placeholder={_('Enter DDNS Password')}
                value={values.ddnsPassword}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block rounded-pill"
              disabled={$isApiProcessing || isShowApiProcessModal}
            >{_('Apply')}
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
              <label>{_('Secondary Web Server Port')}</label>
              <Field
                name="port"
                className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                type="text"
                validate={this.checkValidatePort}
                placeholder={_('Enter Your Secondary Server Port')}
                value={values.port}
              />
              {errors.port && touched.port && (<div className="invalid-feedback">{errors.port}</div>)}
              <p className="text-size-14 text-muted mt-2">{_('1024 - 65535, except for 5555, 8443, 8554, 17300. Default primary port is 80.')}</p>
            </div>
            <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onClick}>{_('Apply')}</button>
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
                path={[_('Internet/Network Settings'), _('TCP/IP')]}
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
                    {_('TCP/IP')}
                  </div>
                  <Tab.Container defaultActiveKey="tab-ddns">
                    <Nav>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-ddns">
                          {_('DDNS')}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-http">
                          {_('HTTP')}
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
