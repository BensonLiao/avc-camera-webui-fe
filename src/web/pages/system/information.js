const React = require('react');
const PropTypes = require('prop-types');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');

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

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitForm = () => {
    const {file} = this.state;

    progress.start();
    api.system.uploadFirmware(file)
      .then(() => new Promise(resolve => {
        // Check the server was shut down.
        const test = () => {
          api.ping()
            .then(() => {
              setTimeout(test, 500);
            })
            .catch(() => {
              resolve();
            });
        };

        test();
      }))
      .then(() => {
        // Redirect to the home page with off-line access.
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  systemInfo = () => {
    progress.start();
    console.log('receiving');
    api.system.getInformation()
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

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
                    <li className="breadcrumb-item">{_('Firmware Upgrade')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">資訊</div>
                  <div className="card-body">
                    <table className="w-100">
                      <tbody>
                        <tr className="border-bottom">
                          <th className="text-size-20 pb-3 text-muted">{_('Build Version')}</th>
                          <th className="text-size-20 pb-3 text-primary text-right">{systemInformation.firmware}</th>
                        </tr>
                        <tr className="border-bottom">
                          <th className="text-size-20 py-3 text-muted">{_('S/N Code')}</th>
                          <th className="text-size-20 py-3 text-primary text-right">{systemInformation.serialNumber}</th>
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
