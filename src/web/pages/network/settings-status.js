import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';

const SettingsStatus = ({networkSettings: {ipType, mac, ipAddress, primaryDNS, secondaryDNS, subnetMask, gateway}}) => {
  const list = [
    {
      name: i18n.t('network.network.ipAssignment'),
      data: ipType === '0' ? i18n.t('network.network.static') : i18n.t('network.network.dynamic')
    },
    {
      name: i18n.t('network.network.macAddress'),
      data: mac
    },
    {
      name: i18n.t('network.network.ipAddress'),
      data: ipAddress
    },
    {
      name: i18n.t('network.network.subnetMask'),
      data: subnetMask
    },
    {
      name: i18n.t('network.network.routerGateway'),
      data: gateway
    },
    {
      name: i18n.t('network.network.primaryDNS'),
      data: primaryDNS
    },
    {
      name: i18n.t('network.network.secondaryDNS'),
      data: secondaryDNS
    }
  ];
  return (
    <table className="w-100">
      <tbody>
        {list.map((value, index) => (
          <tr key={value.name} className="border-bottom">
            <th className={classNames('text-size-20 pl-4 text-muted', index === 0 ? 'pb-3' : 'py-3')}>{value.name}</th>
            <th className={classNames('text-size-20 pr-4 text-primary text-right', index === 0 ? 'pb-3' : 'py-3')}>
              {value.data}
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SettingsStatus.propTypes = {
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

export default SettingsStatus;
