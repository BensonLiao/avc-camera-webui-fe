import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {Link} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Nav, Tab} from 'react-bootstrap';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import FormikEffect from '../../../core/components/formik-effect';
import {getRouter} from '@benson.liao/capybara-router';
import i18n from '../../../i18n';
import {SD_STATUS_LIST} from '../../../core/constants';
import SDCardOperation from './sd-card-operation';
import {useContextState} from '../../stateProvider';
import VolumeProgressBar from '../../../core/components/volume-progress-bar';
import withGlobalStatus from '../../withGlobalStatus';
import SelectField from '../../../core/components/fields/select-field';
import SDCardRecordingDuration from 'webserver-form-schema/constants/sdcard-recording-duration';
import SDCardRecordingType from 'webserver-form-schema/constants/sdcard-recording-type';
import SDCardRecordingStream from 'webserver-form-schema/constants/sdcard-recording-stream';
import SDCardRecordingLimit from 'webserver-form-schema/constants/sdcard-recording-limit';
import SDCardRecordingStatus from 'webserver-form-schema/constants/sdcard-recording-status';
import utils from '../../../core/utils';

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
    localStorage.removeItem('sdCurrentTab');
  }, []);

  const setTab = event => {
    setCurrentTab(event);
  };

  const callApi = (apiFunction, value = '') => {
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

  const processOptions = () => {
    return {
      type: SDCardRecordingType.all().filter(x => x !== '1').map(x => utils.getSDCardRecordingType(x)),
      stream: SDCardRecordingStream.all().filter(x => x !== '2').map(x => {
        const {value, label} = utils.getSDCardRecordingStream(x);
        let channel = x === '1' ? 'channelA' : 'channelB';
        return {
          value,
          label: label + ' ' + utils.getStreamResolutionOption(streamSettings[channel].resolution).label
        };
      }),
      limit: SDCardRecordingLimit.all().map(x => utils.getSDCardRecordingLimit(x))
    };
  };

  const options = processOptions();

  const currentStreamSettings = (setFieldValue, event) => {
    setFieldValue('sdRecordingStream', event.target.value);
    if (event.target.value === SDCardRecordingStream[1]) {
      setFieldValue('frameRate', streamSettings.channelA.frameRate);
      setFieldValue('codec', streamSettings.channelA.codec);
    }

    if (event.target.value === SDCardRecordingStream[2]) {
      setFieldValue('frameRate', streamSettings.channelB.frameRate);
      setFieldValue('codec', streamSettings.channelB.codec);
    }
  };

  const onSubmit = values => {
    localStorage.setItem('sdCurrentTab', currentTab);
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
                        <div className="d-flex justify-content-end flex-column col-9">
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
                            <div className="d-flex justify-content-between align-items-center mb-0">
                              <label className="mb-o">{i18n.t('sdCard.basic.status')}</label>
                              {sdCardRecordingSettings.sdRecordingStatus === Number(SDCardRecordingStatus.on) ? (
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="dot-sd"/>
                                  <label className="mb-o text-danger">{i18n.t('sdCard.basic.recording')}</label>
                                </div>
                              ) : <label className="mb-o text-primary">{SD_STATUS_LIST[sdStatus] || i18n.t('sdCard.basic.constants.unknownStatus')}</label>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-0">
                              <label className="mb-o">{i18n.t('sdCard.basic.filesystem')}</label>
                              <label className="mb-o text-primary">{sdFormat === 'Unrecognized' ? i18n.t('sdCard.basic.unrecognized') : sdFormat}</label>
                            </div>
                          </div>
                          <CustomNotifyModal
                            isShowModal={isShowDisableModal}
                            modalTitle={i18n.t('sdCard.modal.disableTitle')}
                            modalBody={i18n.t('sdCard.modal.disableBody')}
                            isConfirmDisable={isApiProcessing}
                            onHide={getRouter().reload} // Reload to reset SD card switch button state
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
                          <Tab.Content>
                            <Tab.Pane eventKey="tab-sdcard-operation">
                              <SDCardOperation
                                sdEnabled={sdEnabled}
                                sdStatus={sdStatus}
                                callApi={callApi}
                              />
                              <div className="form-group">
                                <div className="row d-flex justify-content-between ml-0 mr-0 mb-1">
                                  <label>{i18n.t('sdCard.basic.errorNotification')}</label>
                                  <span>
                                    {
                                      isEnableAuth ?
                                        <a className="text-success">{i18n.t('sdCard.basic.notificationSet')}</a> :
                                        <Link className="text-danger" to="/notification/smtp">{i18n.t('sdCard.basic.enableOutgoingEmail')}</Link>
                                    }
                                  </span>
                                </div>
                                <div className="card">
                                  <div className="card-body">
                                    <div className="form-group align-items-center mb-0">
                                      <label className="mb-0 mr-3">{i18n.t('sdCard.basic.emailNotification')}</label>
                                      <CustomTooltip show={!isEnableAuth} title={i18n.t('sdCard.tooltip.disabledNotificationButton')}>
                                        <div className="custom-control custom-switch float-right">
                                          <Field
                                            disabled={!isEnableAuth}
                                            name="sdAlertEnabled"
                                            type="checkbox"
                                            style={isEnableAuth ? {} : {pointerEvents: 'none'}}
                                            className="custom-control-input"
                                            id="switch-output"
                                          />
                                          <label className="custom-control-label" htmlFor="switch-output">
                                            <span>{i18n.t('common.button.on')}</span>
                                            <span>{i18n.t('common.button.off')}</span>
                                          </label>
                                        </div>
                                      </CustomTooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                          <Tab.Content>
                            <Tab.Pane eventKey="tab-sdcard-recording">
                              <div className="form-group d-flex justify-content-between align-items-center">
                                <label className="mb-0">{i18n.t('sdCard.basic.enableRecording')}</label>
                                <div className="custom-control custom-switch">
                                  <Field
                                    name="sdRecordingEnabled"
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="switch-recording"
                                  />
                                  <label className={classNames('custom-control-label', {'custom-control-label-disabled': false})} htmlFor="switch-recording">
                                    <span>{i18n.t('common.button.on')}</span>
                                    <span>{i18n.t('common.button.off')}</span>
                                  </label>
                                </div>
                              </div>
                              <div className="card mb-4">
                                <div className="card-body">
                                  <div className="form-group px-3">
                                    <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.basic.recordingType')} name="sdRecordingType">
                                      {options.type.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                      ))}
                                    </SelectField>
                                    <SelectField
                                      row
                                      wrapperClassName="col-sm-8 mb-0"
                                      labelClassName="col-form-label col-sm-4"
                                      labelName={i18n.t('sdCard.basic.recordingResolution')}
                                      name="sdRecordingStream"
                                      onChange={event => currentStreamSettings(setFieldValue, event)}
                                    >
                                      {options.stream.map(stream => (
                                        <option key={stream.value} value={stream.value}>
                                          {stream.label}
                                        </option>
                                      ))}
                                    </SelectField>
                                    <div className="sd-fr-codec">
                                      <SelectField row readOnly wrapperClassName="col-sm-8 mb-0" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.basic.fps')} name="frameRate">
                                        <option>{values.frameRate}</option>
                                      </SelectField>
                                      <SelectField row readOnly formClassName="mb-0" wrapperClassName="col-sm-8 mb-0" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.basic.codec')} name="codec">
                                        <option>{values.codec}</option>
                                      </SelectField>
                                    </div>
                                    <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.basic.recordingDuration')} name="sdRecordingDuration">
                                      {SDCardRecordingDuration.all().map(duration => (
                                        <option key={duration} value={duration}>{duration === '0' ? i18n.t('sdCard.basic.constants.storageToFull') : duration}</option>
                                      ))}
                                    </SelectField>
                                    <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.basic.recordingLimit')} name="sdRecordingLimit">
                                      {options.limit.map(limit => (
                                        <option key={limit.value} value={limit.value}>{limit.label}</option>
                                      ))}
                                    </SelectField>
                                  </div>
                                </div>
                              </div>
                              <button
                                className="btn btn-block btn-primary rounded-pill"
                                type="submit"
                              >
                                {i18n.t('common.button.apply')}
                              </button>
                            </Tab.Pane>
                          </Tab.Content>
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
  sdCardRecordingSettings: PropTypes.shape().isRequired,
  streamSettings: PropTypes.shape().isRequired
};

export default withGlobalStatus(SDCard);
