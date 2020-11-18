import React from 'react';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import SDCardSettings from './sd-card-settings';
import withGlobalStatus from '../../withGlobalStatus';

const SDCard = ({systemInformation, smtpSettings}) => {
  return (
    <div className="main-content">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('SD Card')]}
            />
            <SDCardSettings
              systemInformation={systemInformation}
              smtpSettings={smtpSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SDCard.propTypes = {
  systemInformation: SDCardSettings.propTypes.systemInformation,
  smtpSettings: SDCardSettings.propTypes.smtpSettings
};

export default withGlobalStatus(SDCard);
