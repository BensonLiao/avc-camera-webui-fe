import PropTypes from 'prop-types';
import React from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import CustomTooltip from '../../../core/components/tooltip';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import CheckboxBodyRow from '../../../core/components/fields/checkbox-body-row';
import CheckboxTablePopoverAction from '../../../core/components/checkbox-table-popover-action';
import TableActionButton from '../../../core/components/table-action-button';
import DeviceSyncTableStatus from './members-deviceSync-table-status';
import i18n from '../../../i18n';
import noDevice from '../../../resource/noDevice.png';
import {connectForm} from '../../../core/components/form-connect';
import TableWithCheckBox from '../../../core/components/checkbox-table';

const DeviceSyncTable = connectForm(({
  formik,
  syncStatus,
  pageNumber,
  handleDelete,
  setDeviceModal,
  refreshDevice,
  onFormChange,
  disableInput
}) => {
  const {values: formValues} = formik;
  const {invalidSelection, maxSelectedDevicesReached} = disableInput;

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
    <div className="db-sync-table">
      <TableWithCheckBox
        pageNumber={pageNumber}
        customHandler={onFormChange}
        popoverAction={(
          <CheckboxTablePopoverAction
            actions={[
              {
                icon: <i className="fas fa-exchange-alt"/>,
                text: invalidSelection ?
                  i18n.t('userManagement.members.unlinkedSelectedWarning') :
                  maxSelectedDevicesReached ?
                    i18n.t('userManagement.members.tooltip.maxSelectedDeviceReached') :
                    i18n.t('userManagement.members.synchronize'),
                func: () => formik.submitForm(),
                disabled: invalidSelection || maxSelectedDevicesReached
              },
              {
                icon: <i className="far fa-trash-alt"/>,
                text: i18n.t('common.tooltip.delete'),
                func: handleDelete()
              }
            ]}
          />
        )}
      >
        <thead>
          <tr>
            <CheckboxHeader
              width="7%"
              disabled={syncStatus || !formValues.length}
            />
            <th style={{width: '23%'}}>{i18n.t('userManagement.members.host')}</th>
            <th style={{width: '25%'}}>{i18n.t('userManagement.members.deviceName')}</th>
            <th style={{width: '30%'}}>{i18n.t('userManagement.members.status')}</th>
            <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {

            formValues[pageNumber]?.map((device, index) => {
              return (
                <CheckboxBodyRow
                  key={device.id}
                  rowId={device.id}
                  disabled={syncStatus}
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
                    <TableActionButton
                      isStopPropagation
                      disabled={syncStatus}
                      onClick={editDeviceHandler(device)}
                    >
                      <i className="fas fa-pen fa-lg fa-fw"/>
                    </TableActionButton>
                    <TableActionButton
                      isStopPropagation
                      disabled={syncStatus}
                      onClick={handleDelete(device.id)}
                    >
                      <i className="far fa-trash-alt fa-lg fa-fw"/>
                    </TableActionButton>
                    {
                      device.connectionStatus !== ConnectionStatusSchema.connectionSuccess &&
                        (
                          <TableActionButton
                            isStopPropagation
                            disabled={syncStatus}
                            onClick={refreshDevice(device.id)}
                          >
                            <i className="fas fa-redo fa-lg fa-fw"/>
                          </TableActionButton>
                        )
                    }
                  </td>
                </CheckboxBodyRow>
              );
            }) ?? (
            /* No Device */
              <tr className="disable-highlight">
                <td className="text-size-20 text-center border-0" colSpan="10">
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
    </div>
  );
});

DeviceSyncTable.propTypes = {
  syncStatus: DeviceSyncTableStatus.propTypes.syncStatus,
  pageNumber: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setDeviceModal: PropTypes.func.isRequired,
  refreshDevice: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  disableInput: PropTypes.object.isRequired
};

export default DeviceSyncTable;

