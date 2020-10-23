import {Formik, Form, Field} from 'formik';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import NetworkIPType from 'webserver-form-schema/constants/system-network-ip-type';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import utils from '../../../core/utils';

class SettingsLan extends React.PureComponent {
  static propTypes = {
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

  showModal = selectedModal => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: true
      }
    }));
  };

  hideModal = selectedModal => () => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  state={
    isShowSelectModal: {
      info: false,
      applyConfirm: false
    },
    dhcpTestResult: false,
    dhcpTestIp: null,
    modalTitle: '',
    modalBody: '',
    isConfirmDisable: false,
    onConfirm: this.hideModal('info'),
    isUpdating: false
  }

  onClickTestDHCPButton = setFieldValue => event => {
    event.preventDefault();
    progress.start();
    api.system.testDHCP()
      .then(response => {
        if (response.data) {
          this.setState(prevState => ({
            ...prevState,
            isShowSelectModal: {
              ...prevState.isShowSelectModal,
              info: true
            },
            dhcpTestResult: response.data.success,
            dhcpTestIp: response.data.resultIP,
            modalTitle: i18n.t('DHCP TEST'),
            modalBody: response.data.success ?
              [i18n.t('DHCP Testing Success'), `${i18n.t('IP Address')}: ${response.data.resultIP}`] :
              i18n.t('DHCP Testing Failed')
          }), () => {
            if (!this.state.dhcpTestResult) {
              setFieldValue('ipAddress', '192.168.1.168');
            }
          });
        }
      })
      .finally(progress.done);
  };

  onSubmit = values => {
    progress.start();
    this.setState({isUpdating: true},
      () => {
        api.system.updateNetworkSettings(values)
          .then(response => {
            const resultIP = values.ipType === NetworkIPType.dynamic ? response.data.ipAddress : values.ipAddress;
            this.setState(prevState => ({
              isShowSelectModal: {
                ...prevState.isShowSelectModal,
                info: true
              },
              isUpdating: false,
              modalTitle: i18n.t('Success'),
              modalBody: [i18n.t('Click confirm to redirect to the new address:'), `${i18n.t('IP Address')}: ${resultIP}`],
              onConfirm: () => {
                this.setState({isConfirmDisable: true});
                utils.pingAndRedirectPage(`${location.protocol}//${resultIP}:${location.port}`);
              }
            }));
          })
          .finally(progress.done);
      }
    );
  };

  render() {
    const {networkSettings, isApiProcessing} = this.props;
    const {isShowSelectModal, isUpdating, modalBody, modalTitle, isConfirmDisable, onConfirm} = this.state;

    return (
      <>
        <Formik
          initialValues={networkSettings}
          onSubmit={this.onSubmit}
        >
          {({setFieldValue, values}) => {
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
                      {i18n.t('DHCP')}
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-3"
                    id="dhcpTestButton"
                    disabled={isApiProcessing}
                    onClick={this.onClickTestDHCPButton(setFieldValue)}
                  >
                    {i18n.t('Test DHCP')}
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
                      {i18n.t('Fixed IP Address')}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>{i18n.t('IP Address')}</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="ipAddress"
                    placeholder={i18n.t('Enter IP Address')}
                    value={values.ipAddress}
                    disabled={values.ipType === NetworkIPType.dynamic}
                  />
                </div>
                <div className="form-group">
                  <label>{i18n.t('Subnet Mask')}</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="subnetMask"
                    placeholder={i18n.t('Enter Subnet Mask')}
                    value={values.subnetMask}
                    disabled={values.ipType === NetworkIPType.dynamic}
                  />
                </div>
                <div className="form-group">
                  <label>{i18n.t('Router/Gateway')}</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="gateway"
                    placeholder={i18n.t('Enter Router/Gateway')}
                    value={values.gateway}
                    disabled={values.ipType === NetworkIPType.dynamic}
                  />
                </div>
                <div className="form-group">
                  <label>{i18n.t('Primary DNS')}</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="primaryDNS"
                    placeholder={i18n.t('Enter Primary DNS')}
                    value={values.primaryDNS}
                    disabled={values.ipType === NetworkIPType.dynamic}
                  />
                </div>
                <div className="form-group">
                  <label>{i18n.t('Secondary DNS (Optional)')}</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="secondaryDNS"
                    placeholder={i18n.t('Enter Secondary DNS')}
                    value={values.secondaryDNS || i18n.t('None')}
                    disabled={values.ipType === NetworkIPType.dynamic}
                  />
                </div>
                <CustomTooltip show={JSON.stringify(this.props.networkSettings) === JSON.stringify(values)} title={i18n.t('No changes were made.')}>

                  <div>
                    <button
                      type="button"
                      className="btn btn-primary btn-block rounded-pill"
                      disabled={isApiProcessing || isUpdating || JSON.stringify(this.props.networkSettings) === JSON.stringify(values)}
                      style={(JSON.stringify(this.props.networkSettings) === JSON.stringify(values)) ? {pointerEvents: 'none'} : {}}
                      onClick={() => {
                        this.showModal('applyConfirm');
                      }}
                    >
                      {i18n.t('Apply')}
                    </button>
                  </div>
                </CustomTooltip>

                <CustomNotifyModal
                  backdrop="static"
                  isShowModal={isShowSelectModal.applyConfirm}
                  modalTitle={i18n.t('Network')}
                  modalBody={i18n.t('Are you sure you want to update network settings?')}
                  isConfirmDisable={isApiProcessing || isUpdating}
                  onHide={this.hideModal('applyConfirm')}
                  onConfirm={() => {
                    this.onSubmit(values);
                  }}
                />
              </Form>
            );
          }}
        </Formik>
        <CustomNotifyModal
          modalType="info"
          isShowModal={isShowSelectModal.info}
          modalTitle={modalTitle}
          modalBody={modalBody}
          isConfirmDisable={isConfirmDisable}
          onConfirm={onConfirm}
          onHide={this.hideModal('info')}
        />
      </>
    );
  }
}

export default SettingsLan;
