const React = require('react');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const {Link} = require('capybara-router');
const {Formik, Form} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

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
        <Formik
          initialValues={{}}
          onSubmit={this.onSubmit}
        >
          <Form>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">DHCP TEST</h4>
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
                    type="submit"
                    className="btn btn-primary btn-block rounded-pill"
                  >
                    Confirm
                  </button>
                  <button type="button" className="btn btn-info btn-block rounded-pill" onClick={this.hideModal}>Cancel</button>

                </div>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal>
    );
  };

  onClickTestDHCPButton = event => {
    event.preventDefault();
    progress.start();

    progress.start();
    api.system.testDHCP()
      .then(response => {
        // Check the server was shut down.
        if (response.data) {
          this.state.dhcpTestResult = response.data.success;
        }

        this.setState({isShowModal: true});
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  networkSettingsFormRender = () => {
    return (
      <Form>
        <div className="form-group d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="input-local-network-ip"
              id="input-local-network-dynamic-ip"
              value="dynamic-ip"
              onChange={this.handleChange}

            />
            <label
              className="form-check-label"
              htmlFor="input-local-network-dynamic-ip"
            >
              浮動 IP 位址
            </label>
            <span className="border rounded text-muted text-size-14 ml-3 p-1">
              選擇此選項以從 DHCP 伺服器得到 IP 位址
            </span>
          </div>
          <div>
            <i className="fas fa-check-circle fa-lg text-success mr-2"/>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-3"
              id="dhcpTestButton"
              onClick={this.onClickTestDHCPButton}
            >
              測試 DHCP
            </button>
            {this.testDHCPModalRender()}
          </div>
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="input-local-network-ip"
              id="input-local-network-static-ip"
              value="static-ip"
              onChange={this.handleChange}

            />
            <label
              className="form-check-label"
              htmlFor="input-local-network-static-ip"
            >
              固定 IP 位址
            </label>
            <span className="border rounded text-muted text-size-14 ml-3 p-1">
              選擇此選項以手動輸入固定 IP 位址
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>IP 位址</label>
          <input
            className="form-control"
            type="text"
            placeholder="請輸入 IP 位址"
            id="ip_address"
            disabled={this.state.input_enable}
          />
        </div>
        <div className="form-group">
          <label>子網路遮罩</label>
          <input
            className="form-control"
            type="text"
            placeholder="請輸入子網路遮罩"
            id="ip_mask"
            disabled={this.state.input_enable}
          />
        </div>
        <div className="form-group">
          <label>路由器/閘道</label>
          <input
            className="form-control"
            type="text"
            placeholder="請輸入您的路由器/閘道"
            id="gate_address"
            disabled={this.state.input_enable}
          />
        </div>
        <div className="form-group">
          <label>慣用 DNS</label>
          <input
            className="form-control"
            type="text"
            placeholder="請輸入慣用DNS"
            id="dns_address"
            disabled={this.state.input_enable}
          />
        </div>
        <div className="form-group">
          <label>其他 DNS (選填)</label>
          <input className="form-control" type="text" id="other_dns_address" disabled={this.state.input_enable}/>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block rounded-pill"
          onClick={this.onSubmit}
        >
          套用
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
            <th className="text-size-20 pb-3 pl-4 text-muted">介面</th>
            <th className="text-size-20 pb-3 pr-4 text-primary text-right">
              {networkInterface}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">IP 取得方式</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {_(ipType === '0' ? 'Static' : 'Dynamic')}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">
                網路卡硬體位址
            </th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {mac}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">IP 位址</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {ipAddress}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">子網路遮罩</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {subnetMask}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">路由器/閘道</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {gateway}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">慣用 DNS</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {primaryDNS}
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="text-size-20 py-3 pl-4 text-muted">其他 DNS</th>
            <th className="text-size-20 py-3 pr-4 text-primary text-right">
              {secondaryDNS}
            </th>
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    const {appSettings} = this.props;
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
                        initialValues={appSettings}
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
