import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import BreadCrumb from '../../../core/components/fields/breadcrumb';

const Information = ({networkSettings: {mac}, systemInformation: {firmware, serialNumber}}) => {
  const list = [
    {
      name: i18n.t('Build Version'),
      data: firmware
    },
    {
      name: i18n.t('S/N Code'),
      data: serialNumber
    },
    {
      name: i18n.t('MAC Address'),
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
              path={[i18n.t('System'), i18n.t('System Information'), i18n.t('Information')]}
              routes={['/system/datetime', '/system/log']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('Information')}</div>
                <div className="card-body">
                  <table className="w-100">
                    <tbody>
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
};

Information.propTypes = {
  systemInformation: PropTypes.shape({
    serialNumber: PropTypes.string.isRequired,
    firmware: PropTypes.string.isRequired
  }).isRequired,
  networkSettings: PropTypes.shape({mac: PropTypes.string.isRequired}).isRequired
};

export default Information;
