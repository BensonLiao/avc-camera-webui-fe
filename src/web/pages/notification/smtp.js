import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import React, {useState} from 'react';
import SMTPEncryptionType from 'webserver-form-schema/constants/smtp-encryption-type';
import SMTPPort from 'webserver-form-schema/constants/smtp-port';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import notify from '../../../core/notify';
import withGlobalStatus from '../../withGlobalStatus';
import SMTPAccountSettings from './smtp-account-settings';
import SMTPSettings from './smtp-settings';

const SMTP = ({smtpSettings}) => {
  const [isShowAccountModal, setIsShowAccountModal] = useState(false);

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
          title: i18n.t('notification.smtp.toast.emailSettingSuccess'),
          message: i18n.t(response.data.isTestMailSent ?
            'notification.smtp.toast.sendingTestEmail' :
            'notification.smtp.toast.disablingOutgoingEmail')
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
              path={[i18n.t('navigation.sidebar.notificationSettings'), i18n.t('navigation.sidebar.notificationMethod'), i18n.t('navigation.sidebar.email')]}
              routes={['/notification/smtp', '/notification/smtp']}
            />
            <div className="col-center">
              <SMTPSettings
                smtpSettings={smtpSettings}
                setIsShowAccountModal={setIsShowAccountModal}
                onSubmitSMTPSettingsForm={onSubmitSMTPSettingsForm}
              />
              <SMTPAccountSettings
                isShowModal={isShowAccountModal}
                accountSettings={accountSettings}
                setIsShowAccountModal={setIsShowAccountModal}
                onSubmitAccountSettingsForm={onSubmitAccountSettingsForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SMTP.propTypes = {smtpSettings: SMTPSettings.propTypes.smtpSettings};

export default withGlobalStatus(SMTP);
