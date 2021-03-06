import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import i18n from '../../../i18n';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import IoInput from './io-input';
import IoOutput from './io-output';
import withGlobalStatus from '../../withGlobalStatus';

const IO = ({ioInSettings, ioOutASettings, ioOutBSettings}) => {
  const [currentTab, setCurrentTab] = useState(localStorage.getItem('currentTab') || 'Input');

  useEffect(() => {
    localStorage.removeItem('currentTab');
  }, []);

  const setTab = event => {
    setCurrentTab(event);
  };

  return (
    <div className="main-content left-menu-active">
      <div className="page-notification">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('navigation.sidebar.notificationSettings'), i18n.t('navigation.sidebar.notificationMethod'), i18n.t('navigation.sidebar.inputAndOutput')]}
              routes={['/notification/smtp', '/notification/smtp']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('notification.io.title')}</div>
                <Tab.Container activeKey={currentTab}>
                  <Nav onSelect={setTab}>
                    {[{
                      name: 'Input',
                      i18nMessage: i18n.t('notification.io.tabInput')
                    }, {
                      name: 'Output1',
                      i18nMessage: i18n.t('notification.io.tabOutput1')
                    }, {
                      name: 'Output2',
                      i18nMessage: i18n.t('notification.io.tabOutput2')
                    }].map(ioType => (
                      <Nav.Item key={ioType.name}>
                        <Nav.Link
                          eventKey={ioType.name}
                        >
                          {ioType.i18nMessage}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                  <div className="card-body tab-content">
                    <IoInput
                      ioInSettings={ioInSettings}
                      currentTab={currentTab}
                    />
                    <IoOutput
                      ioOutSettings={ioOutASettings}
                      index={1}
                      currentTab={currentTab}
                    />
                    <IoOutput
                      ioOutSettings={ioOutBSettings}
                      index={2}
                      currentTab={currentTab}
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
};

IO.propTypes = {
  ioInSettings: PropTypes.shape(IoInput.propTypes.ioInSettings).isRequired,
  ioOutASettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired,
  ioOutBSettings: PropTypes.shape(IoOutput.propTypes.ioOutSettings).isRequired
};

export default withGlobalStatus(IO);
