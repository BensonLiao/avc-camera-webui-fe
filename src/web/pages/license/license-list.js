import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../../languages';
import utils from '../../../core/utils';
// const authKeyFaceRecognitionType = require('webserver-form-schema/constants/auth-key-fr');

const LicenseList = ({authKeys}) => {
  return (
    <table className="table custom-style">
      <thead>
        <tr className="shadow">
          <th/>
          <th>{_('Time')}</th>
          <th>{_('Activate User')}</th>
          <th>{_('Authentication Key')}</th>
          <th>{_('Activate Functions')}</th>
          <th>{_('Enable Status')}</th>
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
                  {/* Language resource buggy, using temp. solution until fix is found */}
                  {/* {_('face-recognition-key-{0}', [authKeyFaceRecognitionType[authKey.isEnableFaceRecognitionKey]])} */}
                  {authKey.isEnableFaceRecognitionKey === '1' && _('face-recognition-key-thirtyThousand')}
                  {authKey.isEnableFaceRecognitionKey === '2' && _('face-recognition-key-threeThousand')}
                </span>
              )}
              {authKey.isEnableAgeGenderKey && (
                <span className="badge badge-primary badge-pill">
                  {_('Age Gender')}
                </span>
              )}
              {authKey.isEnableHumanoidDetectionKey && (
                <span className="badge badge-primary badge-pill">
                  {_('Human Detection')}
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
