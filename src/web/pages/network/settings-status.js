import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../../languages';

class SettingsStatus extends React.PureComponent {
  static propTypes = {
    networkSettings: PropTypes.shape({
      networkInterface: PropTypes.string.isRequired,
      ipType: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
      primaryDNS: PropTypes.string.isRequired,
      secondaryDNS: PropTypes.string.isRequired,
      gateway: PropTypes.string.isRequired,
      subnetMask: PropTypes.string.isRequired,
      mac: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const {
      networkInterface,
      ipType,
      mac,
      ipAddress,
      primaryDNS,
      secondaryDNS,
      subnetMask,
      gateway
    } = this.props.networkSettings;
    const list = [
      {
        name: _('Interface'),
        data: _(networkInterface === '0' ? 'Wired' : 'Wifi')
      },
      {
        name: _('IP Status'),
        data: _(ipType === '0' ? 'Static' : 'Dynamic')
      },
      {
        name: _('MAC Address'),
        data: mac
      },
      {
        name: _('IP Address'),
        data: ipAddress
      },
      {
        name: _('Subnet Mask'),
        data: subnetMask
      },
      {
        name: _('Router/Gateway'),
        data: gateway
      },
      {
        name: _('Primary DNS'),
        data: primaryDNS
      },
      {
        name: _('Secondary DNS'),
        data: secondaryDNS
      }
    ];
    return (
      <table className="w-100">
        <tbody>
          {list.map((value, index) => {
            return (
              <tr key={value.name} className="border-bottom">
                <th className={classNames('text-size-20 pl-4 text-muted', index === 0 ? 'pb-3' : 'py-3')}>{value.name}</th>
                <th className={classNames('text-size-20 pr-4 text-primary text-right', index === 0 ? 'pb-3' : 'py-3')}>
                  {value.data}
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default SettingsStatus;
