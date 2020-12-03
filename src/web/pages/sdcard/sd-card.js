import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {Link} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
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

const SDCard = ({
  systemInformation,
  systemInformation: {
    sdUsage,
    sdTotal,
    sdStatus,
    sdEnabled,
    sdFormat
  }, smtpSettings: {isEnableAuth}
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

  return (
    <div className="main-content">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('SD Card')]}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('SD Card')}</div>
                <Formik
                  initialValues={systemInformation}
                >
                  <Form className="card-body sdcard">
                    <FormikEffect onChange={onChangeSdCardSetting}/>
                    <div className="form-group d-flex justify-content-between align-items-center">
                      <label className="mb-0">{i18n.t('Enable SD Card')}</label>
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
                    <CustomNotifyModal
                      isShowModal={isShowDisableModal}
                      modalTitle={i18n.t('Disabling SD Card')}
                      modalBody={i18n.t('Event photos will not be available after the SD card is disabled. Are you sure you want to continue?')}
                      isConfirmDisable={isApiProcessing}
                      onHide={getRouter().reload} // Reload to reset SD card switch button state
                      onConfirm={() => callApi('enableSD', {sdEnabled: false})}
                    />
                    <SDCardOperation
                      sdEnabled={sdEnabled}
                      sdStatus={sdStatus}
                      callApi={callApi}
                    />
                    <div className="form-group">
                      <div className="card">
                        <div className="card-body">
                          <div className="form-group align-items-center mb-0">
                            <label className="mb-0 mr-3">{i18n.t('Error Notification')}</label>
                            <span>
                              {
                                isEnableAuth ?
                                  <a className="text-success">{i18n.t('Email Notification Set')}</a> :
                                  <Link className="text-danger" to="/notification/smtp">{i18n.t('SD Card Enable Outgoing Email')}</Link>
                              }
                            </span>
                            <CustomTooltip show={!isEnableAuth} title={i18n.t('Please enable Outgoing Email first.')}>
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
                    <div className="form-group px-3">
                      <div className="d-flex justify-content-between align-items-center mb-0">
                        <label className="mb-o">{i18n.t('Status')}</label>
                        <label className="mb-o text-primary">{i18n.t(SD_STATUS_LIST[sdStatus] || 'UNKNOWN STATUS')}
                        </label>
                      </div>
                      <hr/>
                      <div className="d-flex justify-content-between align-items-center mb-0">
                        <label className="mb-o">{i18n.t('Filesystem')}</label>
                        <label className="mb-o text-primary">{i18n.t(sdFormat)}</label>
                      </div>
                      <hr/>
                    </div>
                    <div className={classNames('form-group', sdStatus ? 'd-none' : '')}>
                      <div className="card">
                        <div className="card-header sd-card-round">
                          {i18n.t('Storage Space')}
                        </div>
                        <div className="card-body">
                          <div className="form-group mb-0">
                            <label className="mb-3">{i18n.t('SD Card')}</label>
                            <VolumeProgressBar
                              total={sdTotal}
                              usage={sdUsage}
                              percentageToHideText={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
  smtpSettings: PropTypes.shape({isEnableAuth: PropTypes.bool.isRequired}).isRequired
};

export default withGlobalStatus(SDCard);
