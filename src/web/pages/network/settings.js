const React = require('react');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
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
    this.state.isShowModal = false;
    this.state.dhcpTestResult = false;
  }

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  onClickTestDHCPButton = event => {
    event.preventDefault();
    progress.start();
    api.system.testDHCP()
      .then(response => {
        if (response.data) {
          this.state.dhcpTestResult = response.data.success;
          this.setState({isShowModal: true});
        }

        progress.done();
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onSubmit = values => {
    progress.start();
    api.system.updateNetworkSettings(values)
      .then(() => new Promise(resolve => {
        // Check the server was shut down.
        const test = () => {
          api.ping()
            .then(() => {
              setTimeout(test, 500);
            })
            .catch(() => {
              resolve();
            });
        };

        test();
      }))
      .then(() => {
        // Redirect to the home page with off-line access.
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  testDHCPModalRender = () => {
    const {$isApiProcessing} = this.state;
    return (
      <Modal
        show={this.state.isShowModal}
        autoFocus={false}
        onHide={this.hideModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{_('DHCP TEST')}</h4>
          </div>
          <div className="modal-body">
            <p>
              {_(this.state.dhcpTestResult ? 'DHCP Testing Succeed!' : 'DHCP Testing Failed!')}
            </p>
          </div>
          <div className="modal-footer flex-column">
            <div className="form-group w-100 mx-0">
              <button
                disabled={$isApiProcessing}
                type="button"
                className="btn btn-primary btn-block rounded-pill"
                onClick={this.hideModal}
              >
                {_('Confirm')}
              </button>

            </div>
          </div>
        </div>
      </Modal>
    );
  };

  networkSettingsFormRender = ({values}) => {
    const {$isApiProcessing} = this.state;
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
          <div>
            <i className="fas fa-check-circle fa-lg text-success mr-2"/>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-3"
              id="dhcpTestButton"
              onClick={this.onClickTestDHCPButton}
            >
              {_('Test DHCP')}
            </button>
            {this.testDHCPModalRender()}
          </div>
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

        <button
          type="submit"
          className="btn btn-primary btn-block rounded-pill"
          disabled={$isApiProcessing}
        >
          {_('Apply')}
        </button>
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
    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
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
                  <nav>
                    <div className="nav nav-tabs">
                      <a
                        className="nav-item nav-link active"
                        data-toggle="tab"
                        href="#tab-local-network"
                      >
                        {_('LAN Configuration')}
                      </a>
                      <a
                        className="nav-item nav-link"
                        data-toggle="tab"
                        href="#tab-network-status"
                      >
                        {_('Network Status')}
                      </a>
                    </div>
                  </nav>
                  <div className="card-body tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="tab-local-network"
                    >
                      <Formik
                        initialValues={networkSettings}
                        onSubmit={this.onSubmit}
                      >
                        {this.networkSettingsFormRender}
                      </Formik>
                    </div>

                    <div className="tab-pane fad" id="tab-network-status">
                      {this.networkStatusRender()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
