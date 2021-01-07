import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomTooltip from '../../../core/components/tooltip';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import DeviceSyncTableStatus from './members-deviceSync-table-status';
import i18n from '../../../i18n';
import noDevice from '../../../resource/noDevice.png';
import TableWithCheckBox from '../../../core/components/checkbox-table';

const DeviceSyncTable = ({
  devices,
  deviceList,
  syncStatus,
  form,
  formikRef,
  pageNumber,
  confirmDelete,
  editDeviceHandler
}) => {
  return (
    <TableWithCheckBox
      formikRef={formikRef}
      pageNumber={pageNumber}
    >
      <thead>
        <tr className="shadow">
          <CheckboxHeader formikForm={form}/>
          <th style={{width: '15%'}}>{i18n.t('userManagement.members.host')}</th>
          <th style={{width: '30%'}}>{i18n.t('userManagement.members.deviceName')}</th>
          <th style={{width: '30%'}}>{i18n.t('userManagement.members.status')}</th>
          <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {
          devices.length ? (
            deviceList[pageNumber] && deviceList[pageNumber].map((device, index) => {
              return (
                <tr
                  key={device.id}
                  className={classNames({
                    checked: form.values[pageNumber] &&
                      form.values[pageNumber][index] &&
                      form.values[pageNumber][index].isChecked
                  })}
                >
                  <CheckboxBody id={device.id} pageNumber={pageNumber} index={index}/>
                  <td>
                    <CustomTooltip placement="top-start" title={device.ip}>
                      <div>
                        {device.ip + ':' + device.port}
                      </div>
                    </CustomTooltip>
                  </td>
                  <td>
                    <CustomTooltip placement="top-start" title={device.name}>
                      <div>
                        {device.name}
                      </div>
                    </CustomTooltip>
                  </td>
                  <td>
                    <div>
                      <DeviceSyncTableStatus
                        device={device}
                        syncStatus={syncStatus}
                      />
                    </div>
                  </td>
                  <td className="text-left group-btn">
                    {syncStatus ? (
                      <i className="fas fa-lg fa-ban"/>
                    ) : (
                      <>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={editDeviceHandler(device)}
                        >
                          <i className="fas fa-pen fa-lg fa-fw"/>
                        </button>
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={confirmDelete(device.id)}
                        >
                          <i className="far fa-trash-alt fa-lg fa-fw"/>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
          /* No Device */
            <tr className="disable-highlight">
              <td className="text-size-20 text-center" colSpan="10">
                <div className="d-flex flex-column align-items-center mt-5">
                  <img src={noDevice}/>
                  <div className="mt-5 text-center text-wrap" style={{width: '300px'}}>{i18n.t('userManagement.members.noDevice')}</div>
                </div>
              </td>
            </tr>
          )
        }
      </tbody>
    </TableWithCheckBox>

  );
};

DeviceSyncTable.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.shape(DeviceSyncTableStatus.propTypes.device)),
  syncStatus: DeviceSyncTableStatus.propTypes.syncStatus,
  deviceList: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  formikRef: PropTypes.object.isRequired,
  pageNumber: PropTypes.number.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  editDeviceHandler: PropTypes.func.isRequired
};

export default DeviceSyncTable;

