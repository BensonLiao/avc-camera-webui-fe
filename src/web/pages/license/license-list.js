const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const authKeyFaceRecognitionType = require('webserver-form-schema/constants/auth-key-fr');

module.exports = class LicenseList extends React.PureComponent {
  static get propTypes() {
    return {
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
  }

  render() {
    const {authKeys} = this.props;
    // console.log(_('fr-{0}', [authKeyFaceRecognitionType[authKeys.items[0].isEnableFaceRecognitionKey]]));
    // console.log('license page', _('face-recognition-key-{0}', ['thirtyThousand']));
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
              <td>{utils.formatDate(authKey.time)}</td>
              <td>{authKey.user.name}</td>
              <td>{authKey.authKey}</td>
              <td>
                {authKey.isEnableFaceRecognitionKey !== '0' && (
                  <span className="badge badge-primary badge-pill">
                    {_('face-recognition-key-{0}', [authKeyFaceRecognitionType[authKey.isEnableFaceRecognitionKey]])}
                  </span>
                )}
                {authKey.isEnableAgeGenderKey && (
                  <span className="badge badge-primary badge-pill ml-1">
                    {_('Age Gender')}
                  </span>
                )}
                {authKey.isEnableHumanoidDetectionKey && (
                  <span className="badge badge-primary badge-pill ml-1">
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
  }
};
