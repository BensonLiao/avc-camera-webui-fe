/* eslint-disable react/jsx-pascal-case */
import {Nav, Tab} from 'react-bootstrap';
import React from 'react';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import TCPIPDDNS from './tcp-ip-ddns';
import TCPIPHTTP from './tcp-ip-http';
import {useContextState} from '../../stateProvider';
import withGlobalStatus from '../../withGlobalStatus';

const TCPIP = ({ddnsInfo, httpInfo, httpsSettings, rtspSettings}) => {
  const {isApiProcessing} = useContextState();

  return (
    <div className="main-content left-menu-active">
      <div className="page-notification">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('network.breadcrumb.internetNetworkSettings'), i18n.t('network.breadcrumb.tcpip')]}
              routes={['/network/settings']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">
                  {i18n.t('network.tcpip.title')}
                </div>
                <Tab.Container defaultActiveKey="tab-ddns">
                  <Nav>
                    <Nav.Item>
                      <Nav.Link eventKey="tab-ddns">
                        {i18n.t('network.tcpip.ddns')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab-http">
                        {i18n.t('network.tcpip.http')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className="card-body">
                    <TCPIPDDNS
                      isApiProcessing={isApiProcessing}
                      ddnsInfo={ddnsInfo}
                    />
                    <TCPIPHTTP
                      isApiProcessing={isApiProcessing}
                      httpInfo={httpInfo}
                      rtspSettings={rtspSettings}
                      httpsSettings={httpsSettings}
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

TCPIP.propTypes = {
  ddnsInfo: TCPIPDDNS.propTypes.ddnsInfo,
  httpInfo: TCPIPHTTP.propTypes.httpInfo,
  httpsSettings: TCPIPHTTP.propTypes.httpsSettings,
  rtspSettings: TCPIPHTTP.propTypes.rtspSettings
};

export default withGlobalStatus(TCPIP);
