import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import CustomTooltip from '../../../core/components/tooltip';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import CheckboxTablePopoverAction from '../../../core/components/checkbox-table-popover-action';
import DeviceSyncTableStatus from './members-deviceSync-table-status';
import i18n from '../../../i18n';
import noDevice from '../../../resource/noDevice.png';
import {connectForm} from '../../../core/components/form-connect';
import TableWithCheckBox from '../../../core/components/checkbox-table';

const DeviceSyncTable = connectForm(({
  formik,
  syncStatus,
  pageNumber,
  confirmDelete,
  setDeviceModal,
  refreshDevice,
  onFormChange
}) => {
  const {values: formValues} = formik;

  /**
   * Edit selected device
   * @param {Object} device - individual device data
   * @returns {void}
   */
  const editDeviceHandler = device => _ => {
    setDeviceModal({
      isShow: true,
      device: device
    });
  };

  return (
    <TableWithCheckBox
      pageNumber={pageNumber}
      customHandler={onFormChange(formValues)}
      popoverAction={(
        <CheckboxTablePopoverAction
          items={formValues.flat().filter(value => value.isChecked).length}
          actions={[
            {
              id: 1,
              icon: <i className="fas fa-exchange-alt"/>,
              text: i18n.t('userManagement.members.synchronize'),
              func: () => formik.submitForm()
            },
            {
              id: 2,
              icon: <i className="far fa-trash-alt"/>,
              text: i18n.t('common.tooltip.delete'),
              func: confirmDelete(formValues)
            }
          ]}
        />
      )}
    >
      <thead>
        <tr className="shadow">
          <CheckboxHeader
            disabled={syncStatus || !formValues.length}
          />
          <th style={{width: '20%'}}>{i18n.t('userManagement.members.host')}</th>
          <th style={{width: '25%'}}>{i18n.t('userManagement.members.deviceName')}</th>
          <th style={{width: '30%'}}>{i18n.t('userManagement.members.status')}</th>
          <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {
          formValues[pageNumber]?.length ? (
            formValues[pageNumber].map((device, index) => {
              return (
                <tr
                  key={device.id}
                  className={classNames({checked: formValues[pageNumber][index]?.isChecked})}
                >
                  <CheckboxBody
                    id={device.id}
                    pageNumber={pageNumber}
                    index={index}
                    disabled={syncStatus}
                  />
                  <td>
                    <CustomTooltip placement="top-start" title={device.ip + ':' + device.port}>
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
                    <button
                      className="btn btn-link pr-1"
                      type="button"
                      disabled={syncStatus}
                      onClick={editDeviceHandler(device)}
                    >
                      <i className="fas fa-pen fa-lg fa-fw"/>
                    </button>
                    <button
                      className="btn btn-link px-1"
                      type="button"
                      disabled={syncStatus}
                      onClick={confirmDelete(device.id)}
                    >
                      <i className="far fa-trash-alt fa-lg fa-fw"/>
                    </button>
                    {
                      device.connectionStatus !== ConnectionStatusSchema.connectionSuccess &&
                        (
                          <button
                            className="btn btn-link pl-1"
                            type="button"
                            disabled={syncStatus}
                            onClick={refreshDevice(device.id)}
                          >
                            <i className="fas fa-redo fa-lg fa-fw"/>
                          </button>
                        )
                    }
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
});

DeviceSyncTable.propTypes = {
  syncStatus: DeviceSyncTableStatus.propTypes.syncStatus,
  pageNumber: PropTypes.number.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  setDeviceModal: PropTypes.func.isRequired,
  refreshDevice: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired
};

export default DeviceSyncTable;

