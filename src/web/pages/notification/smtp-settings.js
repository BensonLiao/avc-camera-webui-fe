import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import SMTPEncryptionType from 'webserver-form-schema/constants/smtp-encryption-type';
import SMTPPort from 'webserver-form-schema/constants/smtp-port';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import smtpSettingsValidator from '../../validations/notifications/smtp-settings-validator';
import {useContextState} from '../../stateProvider';

const SMTPSettings = ({smtpSettings, onSubmitSMTPSettingsForm, setIsShowAccountModal}) => {
  const {isApiProcessing} = useContextState();

  return (
    <Formik
      initialValues={smtpSettings}
      validate={smtpSettingsValidator}
      onSubmit={onSubmitSMTPSettingsForm}
    >
      {({values, errors, touched}) => {
        const {isEnableAuth} = values;
        return (
          <Form className="card shadow">
            <div className="card-header">
              {i18n.t('Email')}
            </div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label>{i18n.t('Enable Outgoing Email')}</label>
                <div className="custom-control custom-switch">
                  <Field
                    name="isEnableAuth"
                    checked={isEnableAuth}
                    type="checkbox"
                    className="custom-control-input"
                    id="switch-auth"
                  />
                  <label className="custom-control-label" htmlFor="switch-auth">
                    <span>{i18n.t('ON')}</span>
                    <span>{i18n.t('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="form-group">
                    <label>{i18n.t('SMTP Server Address')}</label>
                    <Field
                      autoFocus
                      disabled={!isEnableAuth}
                      name="host"
                      type="text"
                      className={classNames('form-control', {'is-invalid': errors.host && touched.host})}
                      placeholder={i18n.t('Enter server address')}
                    />
                    <ErrorMessage component="div" name="host" className="invalid-feedback"/>
                  </div>
                  <div className="form-group d-flex justify-content-between align-items-center">
                    <div>
                      <label className="mb-0 mr-2">{i18n.t('SMTP Logon Settings')}</label>
                      <CustomTooltip title={i18n.t('Some webmail providers may require app passwords for enhanced security, for example, Google and Yahoo Mail accounts. Please follow your webmail provider’s instructions to generate and use an app password.')}>
                        <i className="fas fa-question-circle helper-text text-primary"/>
                      </CustomTooltip>
                    </div>
                    <div>
                      <CustomTooltip show={!isEnableAuth} title={i18n.t('Please enable Outgoing Email first.')}>
                        <a
                          href="#"
                          className={classNames('mr-2', {'disable-link': !isEnableAuth})}
                          onClick={event => {
                            event.preventDefault();
                            return isEnableAuth && setIsShowAccountModal(true);
                          }}
                        >
                          {i18n.t('Edit')}
                        </a>
                      </CustomTooltip>
                    </div>
                  </div>
                  <div className="mb-0 form-group d-flex justify-content-between align-items-center">
                    <label>{i18n.t('Enable Device Login Notification')}</label>
                    <CustomTooltip show={!isEnableAuth} title={i18n.t('Please enable Outgoing Email first.')}>
                      <div className="custom-control custom-switch">
                        <Field
                          disabled={!isEnableAuth}
                          name="isEnableLoginNotification"
                          checked={values.isEnableLoginNotification}
                          type="checkbox"
                          className="custom-control-input"
                          id="switch-login-notification"
                        />
                        <label className="custom-control-label" htmlFor="switch-login-notification">
                          <span>{i18n.t('ON')}</span>
                          <span>{i18n.t('OFF')}</span>
                        </label>
                      </div>
                    </CustomTooltip>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>{i18n.t('Sender Information')}</label>
                <Field
                  disabled={!isEnableAuth}
                  name="senderName"
                  type="text"
                  className={classNames('form-control', {'is-invalid': errors.senderName && touched.senderName})}
                  placeholder={i18n.t('Enter sender\'s name')}
                />
                <ErrorMessage component="div" name="senderName" className="invalid-feedback"/>
              </div>
              <div className="form-group">
                <label>{i18n.t('Email')}</label>
                <Field
                  disabled={!isEnableAuth}
                  name="senderEmail"
                  type="text"
                  className={classNames('form-control', {'is-invalid': errors.senderEmail && touched.senderEmail})}
                  placeholder={i18n.t('Enter sender\'s email')}
                />
                <ErrorMessage component="div" name="senderEmail" className="invalid-feedback"/>
              </div>
              <div className="form-group">
                <label>{i18n.t('Notification Interval (seconds)')}</label>
                <Field
                  disabled={!isEnableAuth}
                  name="interval"
                  type="text"
                  className={classNames('form-control', {'is-invalid': errors.interval && touched.interval})}
                  placeholder={i18n.t('Specify notification interval')}
                />
                <ErrorMessage component="div" name="interval" className="invalid-feedback"/>
                <small className="form-text text-muted">{i18n.t('5-1,800 Seconds')}</small>
              </div>
              <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
                {i18n.t('Apply')}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

SMTPSettings.propTypes = {
  smtpSettings: PropTypes.shape({
    encryption: PropTypes.oneOf(SMTPEncryptionType.all()),
    host: PropTypes.string.isRequired,
    port: PropTypes.oneOf(SMTPPort.all()),
    account: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    senderEmail: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired,
    isEnableLoginNotification: PropTypes.bool.isRequired,
    isEnableAuth: PropTypes.bool.isRequired
  }).isRequired,
  onSubmitSMTPSettingsForm: PropTypes.func.isRequired,
  setIsShowAccountModal: PropTypes.func.isRequired
};

export default SMTPSettings;
