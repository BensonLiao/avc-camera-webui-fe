const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
const utils = require('../../../core/utils');

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
          isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
          isEnableAgeGenderKey: PropTypes.bool.isRequired,
          isEnableHumanoidDetectionKey: PropTypes.bool.isRequired,
          isEnable: PropTypes.bool.isRequired
        }).isRequired).isRequired
      }).isRequired
    };
  }

  render() {
    const {authKeys} = this.props;
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
                {authKey.isEnableFaceRecognitionKey && (
                  <span className="badge badge-primary badge-pill">
                    {_('Facial Recognition')}
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
