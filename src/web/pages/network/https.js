import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import progress from 'nprogress';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import CertificateType from 'webserver-form-schema/constants/certificate-type';
import i18n from '../../../i18n';
import utils from '../../../core/utils';
import api from '../../../core/apis/web-api';
import {DEFAULT_PORTS, NODE_SERVER_RESTART_DELAY_MS} from '../../../core/constants';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import httpsSettingsValidator from '../../validations/network/https-settings-validator';
import SelectField from '../../../core/components/fields/select-field';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import ProgressIndicator from '../../../core/components/progress-indicator';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info');

const HTTPS = ({httpsSettings, rtspSettings, httpInfo}) => {
  const {isApiProcessing} = useContextState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalBody, setModalBody] = useState('');
  const hideModal = () => setIsShowModal(false);

  const checkValidatePort = values => {
    let checkDefaultPortList = Object.keys(DEFAULT_PORTS)
      .filter(items => items !== 'HTTPS')
      .reduce((obj, key) => ({
        ...obj,
        [key]: DEFAULT_PORTS[key]
      }), {});

    checkDefaultPortList = utils.duplicateCheck(Object.values(checkDefaultPortList), values);
    // Check if using http port
    if (
      checkDefaultPortList ||
      values === rtspSettings.udpPort ||
      values === rtspSettings.tcpPort ||
      values === httpInfo.port2 ||
      values === httpInfo.port) {
      return i18n.t('validation.portReserved');
    }

    return utils.validatedPortCheck(values);
  };

  const onSubmitForm = values => {
    progress.start();
    // Set delay time and wait for nodejs restart complete
    // Note. this is not a reliable solution cause the waiting time may vary from different environment
    api.system.updateHttpsSettings(values)
      .then(() => {
        const newAddress = `${values.isEnable ? 'https' : 'http'}://${location.hostname}${values.isEnable ? `:${values.port}` : ''}`;
        setIsShowModal(true);
        setModalBody([
          `${i18n.t('network.common.modal.redirectionBody')} :`,
          <div key="redirect" className="d-flex">
            <ProgressIndicator
              className="ml-0"
              status="start"
            />
            <span style={{color: infoColor}}>{newAddress}</span>
          </div>
        ]);
        setTimeout(() => {
          setModalBody([
            `${i18n.t('network.common.modal.redirectionBody')} :`,
            <div key="redirect" className="d-flex">
              <ProgressIndicator
                className="ml-0"
                status="done"
              />
              <a href={newAddress}>{newAddress}</a>
            </div>
          ]);
        }, NODE_SERVER_RESTART_DELAY_MS);
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
              path={[i18n.t('navigation.sidebar.internetNetworkSettings'), i18n.t('navigation.sidebar.https')]}
              routes={['/network/settings']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('network.https.title')}</div>
                <Formik
                  initialValues={httpsSettings}
                  validate={httpsSettingsValidator}
                  onSubmit={onSubmitForm}
                >
                  {({values, errors, touched}) => (
                    <Form className="card-body">
                      <div className="form-group d-flex justify-content-between align-items-center">
                        <label>{i18n.t('network.https.enableHTTPS')}</label>
                        <div className="custom-control custom-switch">
                          <Field name="isEnable" type="checkbox" className="custom-control-input" id="switch-enable"/>
                          <label className="custom-control-label" htmlFor="switch-enable">
                            <span>{i18n.t('common.button.on')}</span>
                            <span>{i18n.t('common.button.off')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{i18n.t('network.https.port')}</label>
                        <Field
                          name="port"
                          type="text"
                          validate={checkValidatePort}
                          className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                        />
                        <ErrorMessage component="div" name="port" className="invalid-feedback"/>
                        <p className="text-size-14 text-muted mt-2">{i18n.t('network.https.portHelper')}</p>
                      </div>
                      <SelectField labelName={i18n.t('network.https.certificate')} name="certificateType">
                        <option value={CertificateType.selfSigned}>
                          {(() => {
                            const certificateI18n = window.isNoBrand ? i18n.t('network.https.constants.manufacturer') : 'AndroVideo';
                            return i18n.t('network.https.constants.certificate-type-0', {0: certificateI18n});
                          })()}
                        </option>
                      </SelectField>
                      <CustomTooltip
                        show={(httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false}
                        title={i18n.t('network.https.tooltip.disabledButton')}
                      >
                        <div>
                          <button
                            disabled={
                              isApiProcessing ||
                                !utils.isObjectEmpty(errors) ||
                                ((httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false)
                            }
                            className="btn btn-primary btn-block rounded-pill"
                            type="submit"
                            style={(httpsSettings.isEnable === values.isEnable) && httpsSettings.isEnable === false ? {pointerEvents: 'none'} : {}}
                          >
                            {i18n.t('common.button.apply')}
                          </button>
                        </div>
                      </CustomTooltip>
                      <CustomNotifyModal
                        isShowAllBtns={false}
                        backdrop="static"
                        isShowModal={isShowModal}
                        modalTitle={i18n.t('network.common.modal.redirectionSuccess')}
                        modalBody={modalBody}
                        onConfirm={hideModal}
                        onHide={hideModal}
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HTTPS.propTypes = {
  httpsSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    port: PropTypes.string.isRequired,
    certificateType: PropTypes.oneOf(CertificateType.all()).isRequired
  }).isRequired,
  httpInfo: PropTypes.shape({
    port: PropTypes.string.isRequired,
    port2: PropTypes.string
  }).isRequired,
  rtspSettings: PropTypes.shape({
    tcpPort: PropTypes.string.isRequired,
    udpPort: PropTypes.string.isRequired
  }).isRequired
};

export default withGlobalStatus(HTTPS);
