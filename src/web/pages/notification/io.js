const PropTypes = require('prop-types');
const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const i18n = require('../../i18n').default;
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;
const IoInput = require('./io-input').default;
const IoOutput = require('./io-output').default;
const baseHOC = require('../../base').default;

const IO = baseHOC(
  class extends React.Component {
    static get propTypes() {
      return {
        ioInSettings: PropTypes.shape(IoInput.propTypes.ioInSettings).isRequired,
        ioOutASettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired,
        ioOutBSettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired,
        $isApiProcessing: PropTypes.bool.isRequired
      };
    }

    state= {currentTab: localStorage.getItem('currentTab') || 'tab-input'}

    componentDidMount() {
      localStorage.removeItem('currentTab');
    }

    setCurrentTab = event => {
      this.setState({currentTab: event});
    };

    render() {
      const {ioInSettings, ioOutASettings, ioOutBSettings, $isApiProcessing} = this.props;
      const {currentTab} = this.state;

      return (
        <div className="main-content left-menu-active">
          <div className="page-notification">
            <div className="container-fluid">
              <div className="row">
                <BreadCrumb
                  className="px-0"
                  path={[i18n.t('Notification Settings'), i18n.t('Notification Method'), i18n.t('Input & Output')]}
                  routes={['/notification/smtp', '/notification/smtp']}
                />
                <div className="col-center">
                  <div className="card shadow">
                    <div className="card-header">{i18n.t('Input & Output')}</div>
                    <Tab.Container activeKey={currentTab}>
                      <Nav onSelect={this.setCurrentTab}>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab-input"
                          >
                            {i18n.t('Input')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab-output-1"
                          >
                            {i18n.t('Output {{0}}', {0: 1})}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab-output-2"
                          >
                            {i18n.t('Output {{0}}', {0: 2})}
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
  }
);

export default IO;
