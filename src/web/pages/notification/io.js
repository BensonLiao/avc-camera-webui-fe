import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import i18n from '../../i18n';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import IoInput from './io-input';
import IoOutput from './io-output';
import withGlobalStatus from '../../withGlobalStatus';

export default withGlobalStatus(
  class IO extends Component {
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
