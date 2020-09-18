const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const {Link} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const {default: SettingsLan} = require('./settings-lan');

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
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/network/settings">
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
                          {/* <Formik
                            initialValues={networkSettings}
                            onSubmit={this.onSubmit}
                          >
                            {this.networkSettingsFormRender}
                          </Formik> */}
                          <SettingsLan
                            networkSettings={networkSettings}
                            isApiProcessing={this.state.$isApiProcessing}
                          />
                        </Tab.Pane>
                      </Tab.Content>
                      <Tab.Content>
                        <Tab.Pane eventKey="tab-network-status">
                          {this.networkStatusRender()}
                        </Tab.Pane>
                      </Tab.Content>
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
