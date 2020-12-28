import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {Link} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
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

const SDCard = ({
  systemInformation,
  systemInformation: {
    sdUsage,
    sdTotal,
    sdStatus,
    sdEnabled,
    sdFormat
  }, smtpSettings: {isEnableAuth},
  sdCardRecordingSettings
}) => {
  const {isApiProcessing} = useContextState();
  const [isShowDisableModal, setIsShowDisableModal] = useState(false);
  const callApi = (apiFunction, value = '') => {
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

  const mockSchema = {
    type: [{
      label: 'disconnection',
      value: 0
    }, {
      label: 'event recording',
      value: 1
    }, {
      label: 'continuous recording',
      value: 2
    }],
    status: [{
      label: 'not recording',
      value: 0
    }, {
      label: 'recording',
      value: 1
    }],
    enabled: [{
      label: 'enabled',
      value: true
    }, {
      label: 'disabled',
      value: false
    }],
    stream: [{
      label: 'stream 1',
      value: 0
    }, {
      label: 'stream 2',
      value: 1
    }],
    duration: [{
      label: 'until storage limitation',
      value: 0
    }, {
      label: '1 minute',
      value: 1
    }, {
      label: '60 minutes',
      value: 60
    }],
    limit: [{
      label: 'delete oldest recording',
      value: true
    }, {
      label: 'stop recording',
      value: false
    }]
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
                <div className="card-header">{i18n.t('sdCard.title')}</div>
                <Formik
                  initialValues={{
                    ...systemInformation,
                    ...sdCardRecordingSettings
                  }}
                >
                  <Form>
                    <div className="card-body sdcard">
                      <FormikEffect onChange={onChangeSdCardSetting}/>
                      <div className="form-group d-flex justify-content-between align-items-center">
                        <label className="mb-0">{i18n.t('sdCard.enable')}</label>
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
                      <div className="form-group px-3">
                        <div className="d-flex justify-content-between align-items-center mb-0">
                          <label className="mb-o">{i18n.t('sdCard.status')}</label>
                          <label className="mb-o text-primary">
                            {SD_STATUS_LIST[sdStatus] || i18n.t('sdCard.constants.unknownStatus')}
                          </label>
                        </div>
                        <hr/>
                        <div className="d-flex justify-content-between align-items-center mb-0">
                          <label className="mb-o">{i18n.t('sdCard.filesystem')}</label>
                          <label className="mb-o text-primary">{sdFormat === 'Unrecognized' ? i18n.t('sdCard.unrecognized') : sdFormat}</label>
                        </div>
                        <hr/>
                      </div>
                      <div className={classNames('form-group', sdStatus ? 'd-none' : '')}>
                        <div className="card">
                          <div className="card-header sd-card-round">
                            {i18n.t('sdCard.storageSpace')}
                          </div>
                          <div className="card-body">
                            <div className="form-group mb-0">
                              <label className="mb-3">{i18n.t('sdCard.title')}</label>
                              <VolumeProgressBar
                                total={sdTotal}
                                usage={sdUsage}
                                percentageToHideText={4}
                              />
                            </div>
                          </div>
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
                    <Tab.Container defaultActiveKey="tab-sdcard-operation">
                      <Nav>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab-sdcard-operation"
                          >
                            {i18n.t('sdCard.operation')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab-sdcard-recording"
                          >
                            {i18n.t('sdCard.recording')}
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
                              <label>{i18n.t('sdCard.errorNotification')}</label>
                              <div className="card">
                                <div className="card-body">
                                  <div className="form-group align-items-center mb-0">
                                    <label className="mb-0 mr-3">{i18n.t('sdCard.errorNotification')}</label>
                                    <span>
                                      {
                                        isEnableAuth ?
                                          <a className="text-success">{i18n.t('sdCard.notificationSet')}</a> :
                                          <Link className="text-danger" to="/notification/smtp">{i18n.t('sdCard.enableOutgoingEmail')}</Link>
                                      }
                                    </span>
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
                              <label className="mb-0">{i18n.t('sdCard.enableRecording')}</label>
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
                            <div className="card">
                              <div className="card-body">
                                <div className="form-group px-3">
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.type')} name="sdRecordingType">
                                    {mockSchema.type.map(type => (
                                      <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                  </SelectField>
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.resolution')} name="sdRecordingStream">
                                    {mockSchema.stream.map(stream => (
                                      <option key={stream.value} value={stream.value}>{stream.label}</option>
                                    ))}
                                  </SelectField>
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.duration')} name="sdRecordingDuration">
                                    {mockSchema.duration.map(duration => (
                                      <option key={duration.value} value={duration.value}>{duration.label}</option>
                                    ))}
                                  </SelectField>
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.enabled')} name="sdRecordingEnabled">
                                    {mockSchema.enabled.map(enabled => (
                                      <option key={enabled.value} value={enabled.value}>{enabled.label}</option>
                                    ))}
                                  </SelectField>
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.recordingStatus')} name="sdRecordingStatus">
                                    {mockSchema.status.map(status => (
                                      <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                  </SelectField>
                                  <SelectField row wrapperClassName="col-sm-8" labelClassName="col-form-label col-sm-4" labelName={i18n.t('sdCard.limit')} name="sdRecordingLimit">
                                    {mockSchema.limit.map(limit => (
                                      <option key={limit.value} value={limit.value}>{limit.label}</option>
                                    ))}
                                  </SelectField>
                                </div>
                              </div>
                            </div>
                          </Tab.Pane>
                        </Tab.Content>
                      </div>
                    </Tab.Container>
                  </Form>
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
  sdCardRecordingSettings: PropTypes.shape().isRequired
};

export default withGlobalStatus(SDCard);
