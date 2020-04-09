const React = require('react');
const PropTypes = require('prop-types');
const {Link} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Information extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es']).isRequired,
        deviceName: PropTypes.string.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        usedDiskSize: PropTypes.number.isRequired,
        totalDiskSize: PropTypes.number.isRequired,
        serialNumber: PropTypes.string.isRequired,
        modelName: PropTypes.string.isRequired,
        firmware: PropTypes.string.isRequired
      }).isRequired
    };
  }

  render() {
    const {systemInformation} = this.props;
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/system">{_('System')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/system/date">{_('Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Information')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Information')}</div>
                  <div className="card-body">
                    <table className="w-100">
                      <tbody>
                        <tr className="border-bottom">
                          <th className="text-size-20 pt-2 pb-2 text-muted">{_('Build Version')}</th>
                          <th className="text-size-20 pt-2 pb-2 text-primary text-right">{systemInformation.firmware}</th>
                        </tr>
                        <tr className="border-bottom">
                          <th className="text-size-20 pt-4 pb-2 text-muted">{_('S/N Code')}</th>
                          <th className="text-size-20 pt-4 pb-2 text-primary text-right">{systemInformation.serialNumber}</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
