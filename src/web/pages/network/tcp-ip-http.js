import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import progress from 'nprogress';
import React, {useState} from 'react';
import {Tab} from 'react-bootstrap';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import i18n from '../../../i18n';
import httpSettingsValidator from '../../validations/network/http-settings-validator';
import {DEFAULT_PORTS, NODE_SERVER_RESTART_DELAY_MS} from '../../../core/constants';
import ProgressIndicator from '../../../core/components/progress-indicator';
import utils from '../../../core/utils';

const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info');

const TCPIPHTTP = ({httpInfo, rtspSettings, httpsSettings, isApiProcessing}) => {
  const [state, setState] = useState({
    isShowApiProcessModal: false,
    apiProcessModalTitle: i18n.t('network.tcpip.modal.apiProcessModalTitle'),
    modalBody: undefined
  });
  const {apiProcessModalTitle, isShowApiProcessModal, modalBody} = state;

  const hideApiProcessModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: false
    }));
  };

  const checkValidatePort = values => {
    let checkDefaultPortList = Object.keys(DEFAULT_PORTS)
      .filter(items => items !== 'HTTP')
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
      values === httpsSettings.port) {
      return i18n.t('validation.portReserved');
    }

    return utils.validatedPortCheck(values);
  };

  const onSubmitHTTPForm = values => {
    progress.start();
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: true
    }));
    api.system.updateHttpInfo(values)
      .then(() => {
        const newAddress = `http://${location.hostname}:${values.port}`;
        setState(prevState => ({
          ...prevState,
          apiProcessModalTitle: i18n.t('network.common.modal.redirectionSuccess'),
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
        }, NODE_SERVER_RESTART_DELAY_MS);
      })
      .catch(() => {
        progress.done();
        hideApiProcessModal();
      })
      .finally(progress.done);
  };

  return (
    <>
      <Formik
        initialValues={httpInfo}
        validate={httpSettingsValidator}
        onSubmit={onSubmitHTTPForm}
      >
        {({values, errors, touched}) => (
          <Tab.Content>
            <Tab.Pane eventKey="tab-http">
              <Form>
                <div className="form-group mb-5">
                  <label>{i18n.t('network.tcpip.secondaryHTTPPort')}</label>
                  <Field
                    name="port"
                    className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                    type="text"
                    validate={checkValidatePort}
                    placeholder={8080}
                    value={values.port}
                  />
                  <ErrorMessage component="div" name="port" className="invalid-feedback"/>
                  <p className="text-size-14 text-muted mt-2">{i18n.t('network.tcpip.portHelper')}</p>
                </div>
                <button type="submit" className="btn btn-primary btn-block rounded-pill">{i18n.t('common.button.apply')}</button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        )}
      </Formik>
      <CustomNotifyModal
        isShowAllBtns={false}
        backdrop="static"
        modalType={isApiProcessing ? 'process' : 'default'}
        isShowModal={isShowApiProcessModal}
        modalTitle={apiProcessModalTitle}
        modalBody={modalBody}
        onHide={hideApiProcessModal}
      />
    </>
  );
};

TCPIPHTTP.propTypes = {
  httpInfo: PropTypes.shape({
    port: PropTypes.string.isRequired,
    port2: PropTypes.string
  }).isRequired,
  httpsSettings: PropTypes.shape({port: PropTypes.string.isRequired}).isRequired,
  rtspSettings: PropTypes.shape({
    tcpPort: PropTypes.string.isRequired,
    udpPort: PropTypes.string.isRequired
  }).isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default TCPIPHTTP;
