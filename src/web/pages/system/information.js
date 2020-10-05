const React = require('react');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const {default: i18n} = require('../../i18n');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

module.exports = class Information extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        serialNumber: PropTypes.string.isRequired,
        firmware: PropTypes.string.isRequired
      }).isRequired,
      networkSettings: PropTypes.shape({mac: PropTypes.string.isRequired}).isRequired
    };
  }

  render() {
    const {systemInformation, networkSettings} = this.props;
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('System'), i18n.t('System Information'), i18n.t('Information')]}
                routes={['/system/datetime', '/system/log']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('Information')}</div>
                  <div className="card-body">
                    <table className="w-100">
                      <tbody>
                        <tr className="border-bottom">
                          <th className="text-size-20 pt-2 pb-2 text-muted">{i18n.t('Build Version')}</th>
                          <th className="text-size-20 pt-2 pb-2 text-primary text-right">{systemInformation.firmware}</th>
                        </tr>
                        <tr className="border-bottom">
                          <th className="text-size-20 pt-4 pb-2 text-muted">{i18n.t('S/N Code')}</th>
                          <th className="text-size-20 pt-4 pb-2 text-primary text-right">{systemInformation.serialNumber}</th>
                        </tr>
                        <tr className="border-bottom">
                          <th className="text-size-20 pt-4 pb-2 text-muted">{i18n.t('MAC Address')}</th>
                          <th className="text-size-20 pt-4 pb-2 text-primary text-right">{networkSettings.mac}</th>
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
