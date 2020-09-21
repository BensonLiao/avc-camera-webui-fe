const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const _ = require('../../../languages');
const {default: SettingsLan} = require('./settings-lan');
const {default: SettingsStatus} = require('./settings-status');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

module.exports = class NetworkSettings extends Base {
  static get propTypes() {
    return {networkSettings: PropTypes.shape(SettingsLan.propTypes.networkSettings).isRequired};
  }

  render() {
    const {networkSettings} = this.props;
    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[_('Internet/Network Settings'), _('Network Settings')]}
                routes={['/network/settings']}
              />
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

                          <SettingsLan
                            networkSettings={networkSettings}
                            isApiProcessing={this.state.$isApiProcessing}
                          />

                        </Tab.Pane>
                      </Tab.Content>
                      <Tab.Content>
                        <Tab.Pane eventKey="tab-network-status">

                          <SettingsStatus
                            networkSettings={networkSettings}
                          />

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
