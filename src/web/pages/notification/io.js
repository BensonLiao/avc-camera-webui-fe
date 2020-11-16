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
              path={[i18n.t('Notification Settings'), i18n.t('Notification Method'), i18n.t('Input & Output')]}
              routes={['/notification/smtp', '/notification/smtp']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('Input & Output')}</div>
                <Tab.Container activeKey={currentTab}>
                  <Nav onSelect={setTab}>
                    {['Input', 'Output 1', 'Output 2'].map(ioType => (
                      <Nav.Item key={ioType}>
                        <Nav.Link
                          eventKey={ioType}
                        >
                          {i18n.t(ioType)}
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
