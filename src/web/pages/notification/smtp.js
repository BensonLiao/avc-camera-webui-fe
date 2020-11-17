import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import SMTPEncryptionType from 'webserver-form-schema/constants/smtp-encryption-type';
import SMTPPort from 'webserver-form-schema/constants/smtp-port';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import notify from '../../../core/notify';
import withGlobalStatus from '../../withGlobalStatus';
import SMTPAccountSettings from './smtp-account-settings';
import SMTPSMTPSettings from './smtp-smtp-settings';

const SMTP = ({smtpSettings}) => {
  const [isShowModal, setIsShowAccountModal] = useState(false);

  const generateAccountSettingsInitialValues = settings => ({
    account: settings.account,
    password: settings.password,
    port: settings.port || SMTPPort['25'],
    encryption: settings.encryption || SMTPEncryptionType.none
  });

  const [accountSettings, setAccountSettings] = useState(generateAccountSettingsInitialValues(smtpSettings));

  const onSubmitAccountSettingsForm = values => {
    setAccountSettings(values);
    setIsShowAccountModal(false);
  };

  const onSubmitSMTPSettingsForm = values => {
    progress.start();
    api.notification.updateSMTPSettings({
      ...values,
      ...accountSettings
    })
      .then(response => {
        notify.showSuccessNotification({
          title: i18n.t('Email Setting Success'),
          message: i18n.t(response.data.isTestMailSent ? 'Sending Test Email' : 'Disabling Outgoing Email')
        });
      })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <div className="main-content left-menu-active">
      <div className="page-notification">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('Notification Settings'), i18n.t('Notification Method'), i18n.t('Email')]}
              routes={['/notification/smtp', '/notification/smtp']}
            />
            <div className="col-center">
              <SMTPSMTPSettings
                smtpSettings={smtpSettings}
                setIsShowAccountModal={setIsShowAccountModal}
                onSubmitSMTPSettingsForm={onSubmitSMTPSettingsForm}
              />
            </div>
          </div>
        </div>
        <SMTPAccountSettings
          isShowModal={isShowModal}
          accountSettings={accountSettings}
          setIsShowAccountModal={setIsShowAccountModal}
          onSubmitAccountSettingsForm={onSubmitAccountSettingsForm}
        />
      </div>
    </div>
  );
};

SMTP.propTypes = {
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
  }).isRequired
};

export default withGlobalStatus(SMTP);
