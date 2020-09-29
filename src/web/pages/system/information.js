const React = require('react');
const classNames = require('classNames');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const _ = require('../../../languages');
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
    const {networkSettings: {mac}, systemInformation: {firmware, serialNumber}} = this.props;
    const list = [
      {
        name: _('Build Version'),
        data: firmware
      },
      {
        name: _('S/N Code'),
        data: serialNumber
      },
      {
        name: _('MAC Address'),
        data: mac
      }
    ];
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[_('System'), _('System Information'), _('Information')]}
                routes={['/system/datetime', '/system/log']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Information')}</div>
                  <div className="card-body">
                    <table className="w-100">
                      {list.map((value, index) => {
                        return (
                          <tr key={value.name} className="border-bottom">
                            <th className={classNames('text-size-20 pb-2 text-muted', index === 0 ? 'pt-2' : 'pt-4')}>{value.name}</th>
                            <th className={classNames('text-size-20 pb-2 text-primary text-right', index === 0 ? 'pt-2' : 'pt-4')}>
                              {value.data}
                            </th>
                          </tr>
                        );
                      })}
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
