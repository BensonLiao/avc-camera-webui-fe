import {getRouter} from '@benson.liao/capybara-router';
import {Formik, Form} from 'formik';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import SDCardOperation from './sd-card-operation';
import SDCardRecording from './sd-card-recording';
import withGlobalStatus from '../../withGlobalStatus';
import sdSettingsValidator from '../../validations/sdcard/sd-settings-validator';
import SDCardMain from './sd-card-main';
import {useConfirm} from '../../../core/components/confirm';

const SDCard = ({
  systemInformation,
  smtpSettings: {isEnableAuth},
  sdCardRecordingSettings,
  streamSettings,
  snapshotAllocation,
  sdSpaceAllocation
}) => {
  const {
    sdAlertEnabled,
    sdStatus,
    sdEnabled
  } = systemInformation;
  const confirm = useConfirm();
  const {snapshotMaxNumber} = snapshotAllocation;
  const [currentTab, setCurrentTab] = useState(localStorage.getItem('sdCurrentTab') || 'tab-sdcard-operation');
  // isWaitingApiCall: used to disable buttons during the settimeout of 1000ms, to lock user action while waiting to call recording settings api
  const [isWaitingApiCall, setIsWaitingApiCall] = useState(false);

  useEffect(() => {
    // clear current tab so when user navigates back it doesn't stay as other tab
    localStorage.removeItem('sdCurrentTab');
  }, []);

  const setTab = event => {
    setCurrentTab(event);
  };

  /**
   * Call different apis of similar functionality without repeating code
   * @param {string} apiFunction - Name of the api function
   * @param {object} value - Object containing values of api call
   * @returns {void}
   */
  const callApi = (apiFunction, value = '') => {
    // remember current tab to prevent jumping back to initial tab on reload
    localStorage.setItem('sdCurrentTab', currentTab);
    progress.start();
    api.system[apiFunction](value)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  /**
   * Formik effect onChange function
   * @param {func} setFieldValue
   * @param {object} nextValues
   * @param {object} prevValues
   * @returns {void}
   */
  const onChangeSdCardSetting = setFieldValue => ({nextValues, prevValues}) => {
    // Switching `Enable SD Card` off
    if (sdEnabled && !nextValues.sdEnabled) {
      return confirm.open({
        title: i18n.t('sdCard.modal.disableTitle'),
        body: i18n.t('sdCard.modal.disableBody')
      })
        .then(isConfirm => {
          if (isConfirm) {
            return callApi('enableSD', {sdEnabled: false});
          }

          setFieldValue('sdEnabled', true);
        });
    }

    // Switching `Enable SD Card` on
    if (!sdEnabled && nextValues.sdEnabled) {
      setIsWaitingApiCall(true);
      return api.system.enableSD({sdEnabled: nextValues.sdEnabled})
        .then(setTimeout(() => {
          onSubmitRecording(nextValues);
          setIsWaitingApiCall(false);
        }, 1000));
    }

    // Toggling `Email notification`
    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      return callApi('sdCardAlert', {sdAlertEnabled: nextValues.sdAlertEnabled});
    }
  };

  /**
   * Submit Formik form values to apis
   * @param {object} values - Object containing values of Formik form
   * @returns {void}
   */
  const onSubmitRecording = values => {
    // remember current tab to prevent jumping back to initial tab on reload
    localStorage.setItem('sdCurrentTab', currentTab);
    progress.start();
    api.system.updateSDCardRecordingSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  /**
   * Submit Formik form values to apis
   * @param {object} snapshotMaxNumber - Max number of snapshots to submit
   * @returns {void}
   */
  const onSubmitOperation = snapshotMaxNumber => {
    // remember current tab to prevent jumping back to initial tab on reload
    progress.start();
    api.system.updateSDCardSnapshotMaxNumber({snapshotMaxNumber})
      .then(getRouter().reload)
      .finally(progress.done);
  };

  /**
   * Generate initial value for Formik form
   * @returns {object} - Initial data structure for Formik form
   */
  const generateInitialValues = () => {
    return {
      ...sdCardRecordingSettings,
      sdEnabled,
      sdAlertEnabled,
      snapshotMaxNumber
    };
  };

  return (
    <div className="main-content left-menu-active">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('navigation.sidebar.sdCardSettings'), i18n.t('navigation.sidebar.basic')]}
              routes={['/sd-card/settings']}
            />
            <Formik
              initialValues={generateInitialValues()}
              validate={sdSettingsValidator}
            >
              {({setFieldValue}) => (
                <div className="col-center" style={{width: '832px'}}>
                  <div className="card shadow">
                    <div className="card-header">{i18n.t('sdCard.basic.title')}</div>
                    <Form className="d-flex">
                      <div className="col-4 p-0 border-right">
                        <FormikEffect onChange={onChangeSdCardSetting(setFieldValue)}/>
                        <SDCardMain
                          sdCardRecordingSettings={sdCardRecordingSettings}
                          sdSpaceAllocation={sdSpaceAllocation}
                          systemInformation={systemInformation}
                          isWaitingApiCall={isWaitingApiCall}
                        />
                      </div>
                      <div className="col-8 p-0">
                        <Tab.Container activeKey={currentTab}>
                          <Nav onSelect={setTab}>
                            {['operation', 'recording'].map(tab => (
                              <Nav.Item key={tab}>
                                <Nav.Link
                                  eventKey={`tab-sdcard-${tab}`}
                                >
                                  {i18n.t(`sdCard.basic.${tab}`)}
                                </Nav.Link>
                              </Nav.Item>
                            ))}
                          </Nav>
                          <div className="card-body">
                            <SDCardOperation
                              snapshotMaxNumber={snapshotMaxNumber}
                              isWaitingApiCall={isWaitingApiCall}
                              isEnableAuth={isEnableAuth}
                              sdEnabled={sdEnabled}
                              sdStatus={sdStatus}
                              callApi={callApi}
                              onSubmit={onSubmitOperation}
                            />
                            <SDCardRecording
                              isWaitingApiCall={isWaitingApiCall}
                              sdCardRecordingSettings={sdCardRecordingSettings}
                              streamSettings={streamSettings}
                              onSubmit={onSubmitRecording}
                            />
                          </div>
                        </Tab.Container>
                      </div>
                    </Form>
                  </div>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

SDCard.propTypes = {
  systemInformation: PropTypes.shape({
    sdEnabled: PropTypes.bool.isRequired,
    sdStatus: PropTypes.number.isRequired,
    sdFormat: PropTypes.string.isRequired,
    sdTotal: PropTypes.number.isRequired,
    sdUsage: PropTypes.number.isRequired,
    sdAlertEnabled: PropTypes.bool.isRequired
  }).isRequired,
  smtpSettings: PropTypes.shape({isEnableAuth: PropTypes.bool.isRequired}).isRequired,
  sdCardRecordingSettings: SDCardRecording.propTypes.sdCardRecordingSettings,
  streamSettings: SDCardRecording.propTypes.streamSettings,
  snapshotAllocation: PropTypes.object.isRequired,
  sdSpaceAllocation: PropTypes.object.isRequired
};

export default withGlobalStatus(SDCard);
