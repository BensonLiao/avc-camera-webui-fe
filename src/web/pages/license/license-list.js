import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import utils from '../../../core/utils';
import authKeyFaceRecognitionType from 'webserver-form-schema/constants/auth-key-fr';

const LicenseList = ({authKeys}) => {
  return (
    <table className="table custom-style">
      <thead>
        <tr className="shadow">
          <th/>
          <th>{i18n.t('analytics.license.time')}</th>
          <th>{i18n.t('analytics.license.activatedBy')}</th>
          <th>{i18n.t('analytics.license.authenticationKey')}</th>
          <th>{i18n.t('analytics.license.activatedFunctions')}</th>
          <th>{i18n.t('analytics.license.enableStatus')}</th>
        </tr>
      </thead>
      <tbody>
        {authKeys.items.map((authKey, index) => (
          <tr key={authKey.time}>
            <td>{index + 1}</td>
            <td>{utils.formatDate(utils.subtractTimezoneOffset(new Date(authKey.time)))}</td>
            <td>{authKey.user.name}</td>
            <td>{authKey.authKey}</td>
            <td>
              {authKey.isEnableFaceRecognitionKey !== '0' && (
                <span className="badge badge-primary badge-pill">
                  {i18n.t(`analytics.license.constants.key-${authKeyFaceRecognitionType[authKey.isEnableFaceRecognitionKey]}`)}
                </span>
              )}
              {authKey.isEnableAgeGenderKey && (
                <span className="badge badge-primary badge-pill">
                  {i18n.t('analytics.license.ageGender')}
                </span>
              )}
              {authKey.isEnableHumanoidDetectionKey && (
                <span className="badge badge-primary badge-pill">
                  {i18n.t('analytics.license.humanDetection')}
                </span>
              )}
            </td>
            <td>
              {authKey.isEnable && (
                <i className="fas fa-check-circle fa-lg fa-fw text-success"/>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

LicenseList.propTypes = {
  authKeys: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      authKey: PropTypes.string.isRequired,
      isEnableFaceRecognitionKey: PropTypes.string.isRequired,
      isEnableAgeGenderKey: PropTypes.bool.isRequired,
      isEnableHumanoidDetectionKey: PropTypes.bool.isRequired,
      isEnable: PropTypes.bool.isRequired
    }).isRequired).isRequired
  }).isRequired
};

export default LicenseList;
