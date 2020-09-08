const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const NetworkIPType = require('webserver-form-schema/constants/system-network-ip-type');

module.exports = class NetworkSettings extends Base {
  static get propTypes() {
    return {
      networkSettings: PropTypes.shape({
        networkInterface: PropTypes.string.isRequired,
        ipType: PropTypes.string.isRequired,
        ipAddress: PropTypes.string.isRequired,
        primaryDNS: PropTypes.string.isRequired,
        secondaryDNS: PropTypes.string.isRequired,
        gateway: PropTypes.string.isRequired,
        subnetMask: PropTypes.string.isRequired,
        mac: PropTypes.string.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowSelectModal = {
      info: false,
      applyConfirm: false
    };
    this.state.dhcpTestResult = false;
    this.state.dhcpTestIp = null;
    this.state.modalTitle = '';
    this.state.modalBody = '';
    this.state.isConfirmDisable = false;
    this.state.onConfirm = this.hideModal('info');
    this.state.isUpdating = false;
  }

  showModal = selectedModal => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: true
      }
    }));
  };

  hideModal = selectedModal => () => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  onClickTestDHCPButton = setFieldValue => event => {
    event.preventDefault();
    progress.start();
    api.system.testDHCP()
      .then(response => {
        if (response.data) {
          this.setState(prevState => ({
            ...prevState,
            isShowSelectModal: {
              ...prevState.isShowSelectModal,
              info: true
            },
            dhcpTestResult: response.data.success,
            dhcpTestIp: response.data.resultIP,
            modalTitle: _('DHCP TEST'),
            modalBody: response.data.success ?
              [_('DHCP Testing Success!'), `${_('IP Address')}: ${response.data.resultIP}`] :
              _('DHCP Testing Failed!')
          }), () => {
            if (!this.state.dhcpTestResult) {
              setFieldValue('ipAddress', '192.168.1.168');
            }
          });
        }
      })
      .finally(progress.done);
  };

  onSubmit = values => {
    progress.start();
    this.setState({isUpdating: true},
      () => {
        api.system.updateNetworkSettings(values)
          .then(response => {
            const resultIP = values.ipType === NetworkIPType.dynamic ? response.data.ipAddress : values.ipAddress;
            this.setState(prevState => ({
              isShowSelectModal: {
                ...prevState.isShowSelectModal,
                info: true
              },
              isUpdating: false,
              modalTitle: _('Success'),
              modalBody: [_('Click Confirm to Redirect to the New Address.'), `${_('IP Address')}: ${resultIP}`],
              onConfirm: () => {
                this.setState({isConfirmDisable: true});
                utils.pingAndRedirectPage(`${location.protocol}//${resultIP}:${location.port}`);
              }
            }));
          })
          .finally(progress.done);
      }
    );
  };

  networkSettingsFormRender = ({setFieldValue, values}) => {
    const {$isApiProcessing, isShowSelectModal, isUpdating} = this.state;
    return (
      <Form>
        <div className="form-group d-flex justify-content-between align-items-center">
          <div className="form-check">
            <Field
              className="form-check-input"
              type="radio"
              name="ipType"
              id={`network-ip-type-${NetworkIPType.dynamic}`}
              value={NetworkIPType.dynamic}
            />
            <label
              className="form-check-label"
              htmlFor={`network-ip-type-${NetworkIPType.dynamic}`}
            >
              {_('Enable DHCP')}
            </label>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary rounded-pill px-3"
            id="dhcpTestButton"
            disabled={$isApiProcessing}
            onClick={this.onClickTestDHCPButton(setFieldValue)}
          >
            {_('Test DHCP')}
          </button>
        </div>
        <div className="form-group">
          <div className="form-check">
            <Field
              className="form-check-input"
              type="radio"
              name="ipType"
              id={`network-ip-type-${NetworkIPType.fixed}`}
              value={NetworkIPType.fixed}
            />
            <label
              className="form-check-label"
              htmlFor={`network-ip-type-${NetworkIPType.fixed}`}
            >
              {_('Fixed IP Address')}
            </label>
            <span className="border rounded text-muted text-size-14 ml-3 p-1">
              {_('Enter a Fixed IP Address')}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>{_('IP Address')}</label>
          <Field
            className="form-control"
            type="text"
            name="ipAddress"
            placeholder={_('Enter IP Address')}
            value={values.ipAddress}
            disabled={values.ipType === NetworkIPType.dynamic}
          />
        </div>
        <div className="form-group">
          <label>{_('Subnet Mask')}</label>
          <Field
            className="form-control"
            type="text"
            name="subnetMask"
            placeholder={_('Enter Subnet Mask')}
            value={values.subnetMask}
            disabled={values.ipType === NetworkIPType.dynamic}
          />
        </div>
        <div className="form-group">
          <label>{_('Router/Gateway')}</label>
          <Field
            className="form-control"
            type="text"
            name="gateway"
            placeholder={_('Enter Router/Gateway')}
            value={values.gateway}
            disabled={values.ipType === NetworkIPType.dynamic}
          />
        </div>
        <div className="form-group">
          <label>{_('Primary DNS')}</label>
          <Field
            className="form-control"
            type="text"
            name="primaryDNS"
            placeholder={_('Enter Primary DNS')}
            value={values.primaryDNS}
            disabled={values.ipType === NetworkIPType.dynamic}
          />
        </div>
        <div className="form-group">
          <label>{_('Secondary DNS (Optional)')}</label>
          <Field
            className="form-control"
            type="text"
            name="secondaryDNS"
            placeholder={_('Enter Secondary DNS')}
            value={values.secondaryDNS || _('None')}
            disabled={values.ipType === NetworkIPType.dynamic}
          />
        </div>
        <CustomTooltip show={JSON.stringify(this.props.networkSettings) === JSON.stringify(values)} title={_('No Values Have Changed')}>

          <div>
            <button
              type="button"
              className="btn btn-primary btn-block rounded-pill"
              disabled={$isApiProcessing || isUpdating || JSON.stringify(this.props.networkSettings) === JSON.stringify(values)}
              style={(JSON.stringify(this.props.networkSettings) === JSON.stringify(values)) ? {pointerEvents: 'none'} : {}}
              onClick={() => {
                this.showModal('applyConfirm');
              }}
            >
              {_('Apply')}
            </button>
          </div>
        </CustomTooltip>

        <CustomNotifyModal
          backdrop="static"
          isShowModal={isShowSelectModal.applyConfirm}
          modalTitle={_('Network Settings')}
          modalBody={_('Are you sure you want to update network settings?')}
          isConfirmDisable={$isApiProcessing || isUpdating}
          onHide={this.hideModal('applyConfirm')}
          onConfirm={() => {
            this.onSubmit(values);
          }}
        />
      </Form>
    );
  };

  networkStatusRender = () => {
    const {
      networkInterface,
      ipType,
      mac,
      ipAddress,
      primaryDNS,
      secondaryDNS,
      subnetMask,
      gateway
    } = this.props.networkSettings;
    return (
      <table className="w-100">
        <tbody>
          <tr className="border-bottom">
            <th className="text-size-20 pb-3 pl-4 text-muted">{_('Interface')}</th>
            <th className="text-size-20 pb-3 pr-4 text-primary text-right">
              {_(networkInterface === '0' ? 'Wired' : 'Wifi')}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('IP Status')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {_(ipType === '0' ? 'Static' : 'Dynamic')}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">
              {_('MAC Address')}
            </th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {mac}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('IP Address')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {ipAddress}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('Subnet Mask')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {subnetMask}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('Router/Gateway')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {gateway}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('Primary DNS')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {primaryDNS}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">{_('Secondary DNS')}</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {secondaryDNS}
            </th>
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    const {networkSettings} = this.props;
    const {isShowSelectModal, modalBody, modalTitle, isConfirmDisable, onConfirm} = this.state;
    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/network/setting">
                        {_('Internet/Network Settings')}
                      </Link>
                    </li>

                    <li className="breadcrumb-item">{_('Network Settings')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Network Settings')}</div>
                  <Tab.Container defaultActiveKey="tab-local-network">
                    <Nav>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-local-network"
                        >
                          {_('LAN Configuration')}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-network-status"
                        >
                          {_('Network Status')}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <div className="card-body">
                      <Tab.Content>
                        <Tab.Pane eventKey="tab-local-network">
                          <Formik
                            initialValues={networkSettings}
                            onSubmit={this.onSubmit}
                          >
                            {this.networkSettingsFormRender}
                          </Formik>
                        </Tab.Pane>
                      </Tab.Content>
                      <Tab.Content>
                        <Tab.Pane eventKey="tab-network-status">
                          {this.networkStatusRender()}
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Tab.Container>
                  <CustomNotifyModal
                    modalType="info"
                    isShowModal={isShowSelectModal.info}
                    modalTitle={modalTitle}
                    modalBody={modalBody}
                    isConfirmDisable={isConfirmDisable}
                    onConfirm={onConfirm}
                    onHide={this.hideModal('info')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
