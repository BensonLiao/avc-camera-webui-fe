const PropTypes = require('prop-types');
const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const {Link} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const IoInput = require('./io-input').default;
const IoOutput = require('./io-output').default;

module.exports = class IO extends Base {
  static get propTypes() {
    return {
      ioInSettings: PropTypes.shape(IoInput.propTypes.ioInSettings).isRequired,
      ioOutASettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired,
      ioOutBSettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.currentTab = localStorage.getItem('currentTab') || 'tab-input';
  }

  componentDidMount() {
    localStorage.removeItem('currentTab');
  }

  setCurrentTab = event => {
    this.setState({currentTab: event});
  };

  render() {
    const {ioInSettings, ioOutASettings, ioOutBSettings} = this.props;
    const {currentTab, $isApiProcessing} = this.state;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/notification/smtp">{_('Notification Setting')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/notification/smtp">{_('Basic Setting')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Input and Output Setting')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Input and Output Setting')}</div>
                  <Tab.Container activeKey={currentTab}>
                    <Nav onSelect={this.setCurrentTab}>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-input"
                        >
                          {_('Input')}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-output-1"
                        >
                          {_('Output {0}', [1])}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="tab-output-2"
                        >
                          {_('Output {0}', [2])}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <div className="card-body tab-content">
                      <IoInput
                        ioInSettings={ioInSettings}
                        isEnableIoIn={ioInSettings.isEnable}
                        currentTab={currentTab}
                        isApiProcessing={$isApiProcessing}
                      />
                      <IoOutput
                        ioOutSettings={ioOutASettings}
                        isEnableIoOutput={ioOutASettings.isEnable}
                        index={0}
                        currentTab={currentTab}
                        isApiProcessing={$isApiProcessing}
                      />
                      <IoOutput
                        ioOutSettings={ioOutBSettings}
                        isEnableIoOutput={ioOutBSettings.isEnable}
                        index={1}
                        currentTab={currentTab}
                        isApiProcessing={$isApiProcessing}
                      />
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
