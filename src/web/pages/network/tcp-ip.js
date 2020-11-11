/* eslint-disable react/jsx-pascal-case */
import React, {useState} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import i18n from '../../../i18n';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';
import TCPIPHTTP from './tcp-ip-http';
import TCPIPDDNS from './tcp-ip-ddns';
import ProgressIndicator from '../../../core/components/progress-indicator';
import api from '../../../core/apis/web-api';
import progress from 'nprogress';
import {NODE_SERVER_RESTART_DELAY_MS} from '../../../core/constants';

const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info');

const TCPIP = ({ddnsInfo, httpInfo, httpsSettings, rtspSettings}) => {
  const {isApiProcessing} = useContextState();

  const [state, setState] = useState({
    isShowApiProcessModal: false,
    apiProcessModalTitle: i18n.t('Updating HTTP Settings'),
    modalBody: i18n.t('Please wait')
  });
  const {apiProcessModalTitle, isShowApiProcessModal, modalBody} = state;

  const hideApiProcessModal = () => {
    setState({
      ...state,
      isShowApiProcessModal: false
    });
  };

  const onSubmitHTTPForm = values => {
    progress.start();
    setState({
      ...state,
      isShowApiProcessModal: true
    });
    api.system.updateHttpInfo(values)
      .then(() => {
        const newAddress = `http://${location.hostname}:${values.port}`;
        setState({
          ...state,
          apiProcessModalTitle: i18n.t('Redirection Success'),
          modalBody: [
            `${i18n.t('The website has been redirected to the new address')} :`,
            <div key="redirect" className="d-flex">
              <ProgressIndicator
                className="ml-0"
                status="start"
              />
              <span style={{color: infoColor}}>{newAddress}</span>
            </div>
          ]
        });
        setTimeout(() => {
          setState({
            ...state,
            modalBody: [
              `${i18n.t('The website has been redirected to the new address')} :`,
              <div key="redirect" className="d-flex">
                <ProgressIndicator
                  className="ml-0"
                  status="done"
                />
                <a href={newAddress}>{newAddress}</a>
              </div>
            ]
          });
        }, NODE_SERVER_RESTART_DELAY_MS);
      })
      .catch(() => {
        progress.done();
        hideApiProcessModal();
      })
      .finally(progress.done);
  };

  return (
    <div className="main-content left-menu-active">
      <div className="page-notification">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('Internet & Network Settings'), i18n.t('TCP/IP')]}
              routes={['/network/settings']}
            />
            <CustomNotifyModal
              isShowAllBtns={false}
              backdrop="static"
              modalType={isApiProcessing ? 'process' : 'default'}
              isShowModal={isShowApiProcessModal}
              modalTitle={apiProcessModalTitle}
              modalBody={modalBody}
              onHide={hideApiProcessModal}
            />

            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">
                  {i18n.t('TCP/IP')}
                </div>
                <Tab.Container defaultActiveKey="tab-ddns">
                  <Nav>
                    <Nav.Item>
                      <Nav.Link eventKey="tab-ddns">
                        {i18n.t('DDNS')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab-http">
                        {i18n.t('HTTP')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className="card-body">
                    <TCPIPDDNS
                      isShowApiProcessModal={isShowApiProcessModal}
                      isApiProcessing={isApiProcessing}
                      ddnsInfo={ddnsInfo}
                    />
                    <TCPIPHTTP
                      httpInfo={httpInfo}
                      rtspSettings={rtspSettings}
                      httpsSettings={httpsSettings}
                      hideApiProcessModal={hideApiProcessModal}
                      onSubmitHTTPForm={onSubmitHTTPForm}
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
