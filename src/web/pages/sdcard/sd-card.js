import classNames from 'classnames';
import {getRouter} from '@benson.liao/capybara-router';
import {Formik, Form, Field} from 'formik';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import SDCardRecordingStatus from 'webserver-form-schema/constants/sdcard-recording-status';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import {SD_STATUS_LIST} from '../../../core/constants';
import SDCardOperation from './sd-card-operation';
import SDCardRecording from './sd-card-recording';
import {useContextState} from '../../stateProvider';
import VolumeProgressBar from '../../../core/components/volume-progress-bar';
import withGlobalStatus from '../../withGlobalStatus';

const SDCard = ({
  systemInformation,
  systemInformation: {
    sdUsage,
    sdTotal,
    sdStatus,
    sdEnabled,
    sdFormat
  }, smtpSettings: {isEnableAuth},
  sdCardRecordingSettings,
  streamSettings
}) => {
  const {isApiProcessing} = useContextState();
  const [isShowDisableModal, setIsShowDisableModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(localStorage.getItem('sdCurrentTab') || 'tab-sdcard-operation');

  useEffect(() => {
    // clear current tab so when user navigates back it doesn't stay as other tab
    localStorage.removeItem('sdCurrentTab');
  }, []);

  const setTab = event => {
    setCurrentTab(event);
  };

  const callApi = (apiFunction, value = '') => {
    // remember current tab to prevent jumping back to initial tab on reload
    localStorage.setItem('sdCurrentTab', currentTab);
    progress.start();
    api.system[apiFunction](value)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const onChangeSdCardSetting = ({nextValues, prevValues}) => {
    if (prevValues.sdEnabled && !nextValues.sdEnabled) {
      return setIsShowDisableModal(true);
    }

    if (!prevValues.sdEnabled && nextValues.sdEnabled) {
      return callApi('enableSD', {sdEnabled: nextValues.sdEnabled});
    }

    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      return callApi('sdCardAlert', {sdAlertEnabled: nextValues.sdAlertEnabled});
    }
  };

  const onSubmit = values => {
    // remember current tab to prevent jumping back to initial tab on reload
    localStorage.setItem('sdCurrentTab', currentTab);

    // values contains more than we need, thus we have to map it out one by one
    const formValues = {
      sdRecordingStatus: values.sdRecordingStatus,
      sdRecordingDuration: values.sdRecordingDuration,
      sdRecordingEnabled: values.sdRecordingEnabled,
      sdRecordingLimit: values.sdRecordingLimit,
      sdRecordingStream: values.sdRecordingStream,
      sdRecordingType: values.sdRecordingType
    };
    progress.start();
    api.system.updateSDCardRecordingSettings(formValues)
      .then(getRouter().reload)
      .finally(progress.done);
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
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('sdCard.basic.title')}</div>
                <Formik
                  initialValues={{
                    frameRate: streamSettings[sdCardRecordingSettings.sdRecordingStream === 1 ? 'channelA' : 'channelB'].frameRate,
                    codec: streamSettings[sdCardRecordingSettings.sdRecordingStream === 1 ? 'channelA' : 'channelB'].codec,
                    ...systemInformation,
                    ...sdCardRecordingSettings
                  }}
                  onSubmit={onSubmit}
                >
                  {({values, setFieldValue}) => (
                    <Form>
                      <div className="card-body sdcard row">
                        <FormikEffect onChange={onChangeSdCardSetting}/>
                        <VolumeProgressBar
                          isRoundProgressBar
                          total={sdTotal}
                          usage={sdUsage}
                          percentageToHideText={4}
                        />
                        <div className="d-flex justify-content-center flex-column col-8">
                          <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="mb-0">{i18n.t('sdCard.basic.enable')}</label>
                            <div className="custom-control custom-switch">
                              <Field
                                name="sdEnabled"
                                type="checkbox"
                                className="custom-control-input"
                                id="switch-sound"
                                disabled={sdStatus}
                              />
                              <label className={classNames('custom-control-label', {'custom-control-label-disabled': sdStatus})} htmlFor="switch-sound">
                                <span>{i18n.t('common.button.on')}</span>
                                <span>{i18n.t('common.button.off')}</span>
                              </label>
                            </div>
                          </div>
                          <hr/>
                          <div className="form-group">
                            <div className="d-flex mb-0">
                              <label className="mb-o pl-0 col-sm-5">{i18n.t('sdCard.basic.status')}</label>
                              {sdCardRecordingSettings.sdRecordingStatus === Number(SDCardRecordingStatus.on) ? (
                                <div className="d-flex col-sm-7 align-items-center">
                                  <div className="dot-sd"/>
                                  <label className="text-danger">{i18n.t('sdCard.basic.recording')}</label>
                                </div>
                              ) : <label className="mb-o col-sm-7 text-primary">{SD_STATUS_LIST[sdStatus] || i18n.t('sdCard.basic.constants.unknownStatus')}</label>}
                            </div>
                            <div className="mb-0">
                              <label className="mb-o pl-0 col-sm-5">{i18n.t('sdCard.basic.filesystem')}</label>
                              <label className="mb-o col-sm-7 text-primary">{sdFormat === 'Unrecognized' ? i18n.t('sdCard.basic.unrecognized') : sdFormat}</label>
                            </div>
                          </div>
                          <CustomNotifyModal
                            isShowModal={isShowDisableModal}
                            modalTitle={i18n.t('sdCard.modal.disableTitle')}
                            modalBody={i18n.t('sdCard.modal.disableBody')}
                            isConfirmDisable={isApiProcessing}
                            onHide={() => {
                              localStorage.setItem('sdCurrentTab', currentTab);
                              getRouter().reload();
                            }} // Reload to reset SD card switch button state
                            onConfirm={() => callApi('enableSD', {sdEnabled: false})}
                          />
                        </div>
                      </div>
                      <Tab.Container activeKey={currentTab}>
                        <Nav onSelect={setTab}>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="tab-sdcard-operation"
                            >
                              {i18n.t('sdCard.basic.operation')}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="tab-sdcard-recording"
                            >
                              {i18n.t('sdCard.basic.recording')}
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                        <div className="card-body">
                          <SDCardOperation
                            isEnableAuth={isEnableAuth}
                            sdEnabled={sdEnabled}
                            sdStatus={sdStatus}
                            callApi={callApi}
                          />
                          <SDCardRecording
                            streamSettings={streamSettings}
                            formValues={values}
                            setFieldValue={setFieldValue}
                          />
                        </div>
                      </Tab.Container>
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
  sdCardRecordingSettings: PropTypes.shape({
    sdRecordingDuration: PropTypes.number.isRequired,
    sdRecordingEnabled: PropTypes.bool.isRequired,
    sdRecordingLimit: PropTypes.number.isRequired,
    sdRecordingStatus: PropTypes.number.isRequired,
    sdRecordingStream: PropTypes.number.isRequired,
    sdRecordingType: PropTypes.number.isRequired,
    sdPrerecordingDuration: PropTypes.number.isRequired
  }).isRequired,
  streamSettings: SDCardRecording.propTypes.streamSettings
};

export default withGlobalStatus(SDCard);
