import React from 'react';
import {Nav, Tab} from 'react-bootstrap';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import SettingsLan from './settings-lan';
import SettingsStatus from './settings-status';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const NetworkSettings = ({networkSettings}) => {
  const {isApiProcessing} = useContextState();

  return (
    <div className="main-content left-menu-active">
      <div className="page-notification">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('Internet & Network Settings'), i18n.t('Network')]}
              routes={['/network/settings']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('Network')}</div>
                <Tab.Container defaultActiveKey="tab-local-network">
                  <Nav>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab-local-network"
                      >
                        {i18n.t('IP Addressing')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab-network-status"
                      >
                        {i18n.t('Network Status')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className="card-body">
                    <Tab.Content>
                      <Tab.Pane eventKey="tab-local-network">

                        <SettingsLan
                          networkSettings={networkSettings}
                          isApiProcessing={isApiProcessing}
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
};

NetworkSettings.propTypes = {networkSettings: PropTypes.shape(SettingsLan.propTypes.networkSettings).isRequired};

export default withGlobalStatus(NetworkSettings);
