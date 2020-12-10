import {Formik, Form, Field} from 'formik';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import NetworkIPType from 'webserver-form-schema/constants/system-network-ip-type';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import ProgressIndicator from '../../../core/components/progress-indicator';
import {NODE_SERVER_RESTART_DELAY_MS} from '../../../core/constants';

const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info');

const SettingsLan = ({networkSettings, isApiProcessing}) => {
  const [state, setState] = useState({
    isShowSelectModal: {
      info: false,
      applyConfirm: false
    },
    dhcpTestResult: false,
    dhcpTestIp: null,
    modalTitle: '',
    modalBody: '',
    modalBackdrop: true,
    isConfirmDisable: false,
    isUpdating: false,
    redirectIP: false
  });

  const {isShowSelectModal, isUpdating, modalBody, modalTitle, isConfirmDisable, redirectIP, modalBackdrop} = state;

  const showModal = selectedModal => {
    return setState(prevState => ({
      ...prevState,
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: true
      }
    }));
  };

  const hideModal = selectedModal => () => {
    return setState(prevState => ({
      ...prevState,
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  const onClickTestDHCPButton = setFieldValue => event => {
    event.preventDefault();
    progress.start();
    api.system.testDHCP()
      .then(response => {
        if (response.data) {
          setState(prevState => ({
            ...prevState,
            isShowSelectModal: {
              ...prevState.isShowSelectModal,
              info: true
            },
            dhcpTestResult: response.data.success,
            dhcpTestIp: response.data.resultIP,
            modalTitle: i18n.t('network.network.testDHCP'),
            modalBody: response.data.success ?
              [i18n.t('network.network.modal.testingSuccess'), `${i18n.t('network.network.ipAddress')}: ${response.data.resultIP}`] :
              i18n.t('network.network.modal.testingFailed')
          }));
          if (!response.data.success) {
            setFieldValue('ipAddress', '192.168.1.168');
          }
        }
      })
      .finally(progress.done);
  };

  const onSubmit = values => {
    progress.start();
    setState(prevState => ({
      ...prevState,
      isUpdating: true
    }));
    api.system.updateNetworkSettings(values)
      .then(response => {
        const resultIP = values.ipType === NetworkIPType.dynamic ? response.data.ipAddress : values.ipAddress;
        const newAddress = `${location.protocol}//${resultIP}${location.port ? `:${location.port}` : ''}`;
        setState(prevState => ({
          ...prevState,
          isShowSelectModal: {
            applyConfirm: false,
            info: true
          },
          modalBackdrop: 'static',
          modalTitle: i18n.t('network.common.modal.redirectionSuccess'),
          redirectIP: true,
          modalBody: [
            `${i18n.t('network.common.modal.redirectionBody')} :`,
            <div key="redirect" className="d-flex">
              <ProgressIndicator
                className="ml-0"
                status="start"
              />
              <span style={{color: infoColor}}>{newAddress}</span>
            </div>
          ]
        }));
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            isUpdating: false,
            modalBody: [
              `${i18n.t('network.common.modal.redirectionBody')} :`,
              <div key="redirect" className="d-flex">
                <ProgressIndicator
                  className="ml-0"
                  status="done"
                />
                <a href={newAddress}>{newAddress}</a>
              </div>
            ]
          }));
        }, NODE_SERVER_RESTART_DELAY_MS / 2);
      })
      .finally(progress.done);
  };

  return (
    <>
      <Formik
        initialValues={networkSettings}
        onSubmit={onSubmit}
      >
        {({setFieldValue, values}) => {
          const isDisable = values.ipType === NetworkIPType.dynamic;
          const renderField = (label, name, placeholder) => (
            <div className="form-group">
              <label>{label}</label>
              <Field
                className="form-control"
                type="text"
                name={name}
                placeholder={placeholder}
                disabled={isDisable}
              />
            </div>
          );
          return (
            <Form>
              <div className="form-group d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="radio"
                    name="ipType"
                    id={`network-ip-type-${NetworkIPType.dynamic}`}
                    value={NetworkIPType.dynamic}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`network-ip-type-${NetworkIPType.dynamic}`}
                  >
                    {i18n.t('network.network.dhcp')}
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-3"
                  id="dhcpTestButton"
                  disabled={isApiProcessing}
                  onClick={onClickTestDHCPButton(setFieldValue)}
                >
                  {i18n.t('network.network.testDHCP')}
                </button>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="radio"
                    name="ipType"
                    id={`network-ip-type-${NetworkIPType.fixed}`}
                    value={NetworkIPType.fixed}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`network-ip-type-${NetworkIPType.fixed}`}
                  >
                    {i18n.t('network.network.fixedIPAddress')}
                  </label>
                </div>
              </div>
              {renderField(i18n.t('network.network.ipAddress'), 'ipAddress', i18n.t('network.network.ipAddressPlaceholder'))}
              {renderField(i18n.t('network.network.subnetMask'), 'subnetMask', i18n.t('network.network.subnetMaskPlaceholder'))}
              {renderField(i18n.t('network.network.routerGateway'), 'gateway', i18n.t('network.network.routerGatewayPlaceholder'))}
              {renderField(i18n.t('network.network.primaryDNS'), 'primaryDNS', i18n.t('network.network.primaryDNSPlaceholder'))}
              {renderField(i18n.t('network.network.secondaryDNSOptional'), 'secondaryDNS', i18n.t('network.network.secondaryDNSPlaceholder'))}
              <CustomTooltip show={JSON.stringify(networkSettings) === JSON.stringify(values)} title={i18n.t('network.network.tooltips.noChanges')}>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block rounded-pill"
                    disabled={isApiProcessing || isUpdating || JSON.stringify(networkSettings) === JSON.stringify(values)}
                    style={(JSON.stringify(networkSettings) === JSON.stringify(values)) ? {pointerEvents: 'none'} : {}}
                    onClick={() => {
                      showModal('applyConfirm');
                    }}
                  >
                    {i18n.t('common.button.apply')}
                  </button>
                </div>
              </CustomTooltip>
              <CustomNotifyModal
                backdrop="static"
                isShowModal={isShowSelectModal.applyConfirm}
                modalTitle={i18n.t('network.network.title')}
                modalBody={i18n.t('network.network.modal.confirmUpdateBody')}
                isConfirmDisable={isApiProcessing || isUpdating}
                onHide={hideModal('applyConfirm')}
                onConfirm={() => {
                  onSubmit(values);
                }}
              />
            </Form>
          );
        }}
      </Formik>
      <CustomNotifyModal
        isShowAllBtns={!redirectIP}
        modalType="info"
        isShowModal={isShowSelectModal.info}
        modalTitle={modalTitle}
        modalBody={modalBody}
        backdrop={modalBackdrop}
        isConfirmDisable={isConfirmDisable}
        onConfirm={hideModal('info')}
        onHide={hideModal('info')}
      />
    </>
  );
};

SettingsLan.propTypes = {
  networkSettings: PropTypes.shape({
    networkInterface: PropTypes.string.isRequired,
    ipType: PropTypes.string.isRequired,
    ipAddress: PropTypes.string.isRequired,
    primaryDNS: PropTypes.string.isRequired,
    secondaryDNS: PropTypes.string.isRequired,
    gateway: PropTypes.string.isRequired,
    subnetMask: PropTypes.string.isRequired,
    mac: PropTypes.string.isRequired
  }).isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default SettingsLan;
