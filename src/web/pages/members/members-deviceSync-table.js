import classNames from 'classnames';
import {Field} from 'formik';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import {formatDate} from '../../../core/utils';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import noDevice from '../../../resource/noDevice.png';
import ProgressIndicator from '../../../core/components/progress-indicator';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import MasterSyncStatusSchema from 'webserver-form-schema/constants/members-master-sync-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';

const DeviceSyncTable = ({
  devices,
  deviceList,
  syncStatus,
  form,
  formRef,
  page,
  confirmDelete,
  isShowConfirmModal,
  hideConfirmModal,
  editDeviceHandler,
  deleteDevice,
  deleteDeviceID
}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const selectAllRef = useRef();

  /**
   * Select or un-select all checkboxes on current page
   * @param {Object} form - Formik form object
   * @returns {void}
   */
  const selectAllHandler = form => _ => {
    let checkboxState = false;
    if (!isSelectAll) {
      checkboxState = true;
    }

    if (form.values[page]) {
      form.values[page].forEach((_, index) => {
        form.setFieldValue(`${page}.${index}.isChecked`, checkboxState);
      });
    }

    setIsSelectAll(prevState => (!prevState));
  };

  /**
   * Update `Select All` checkbox based on page navigated to
   */
  useEffect(() => {
    // Crash prevention fallback if React is less than v2.2.0, innerRef only exists after v2.2.0
    if (formRef.current) {
      const values = formRef.current.values;
      selectAllCheckboxState(values);
    }
  }, [formRef, page, selectAllCheckboxState]);

  /**
   * Update `Select All` checkbox based on any checkbox update
   * @param {Object} nextValues - Form next values
   * @returns {void}
   */
  const onChangeCardForm = ({nextValues}) => {
    if (devices.length) {
      selectAllCheckboxState(nextValues);
    }
  };

  /**
   * Determine condition for table header checkbox indeterminate, check or unchecked state
   * @param {Object} values - Form values
   * @returns {void}
   */
  const selectAllCheckboxState = useCallback(values => {
    // Check if any checkboxes has been selected
    if (values[page] && values[page].some(device => device.isChecked)) {
      if (values[page].some(device => !device.isChecked)) {
        // Some checkboxes are selected, set to indetermindate state
        selectAllRef.current.indeterminate = true;
      } else {
        // Manually selected all checkboxes
        selectAllRef.current.indeterminate = false;
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      selectAllRef.current.indeterminate = false;
      setIsSelectAll(false);
    }
  }, [page]);

  /**
   * Conditional render for device status
   * @param {Object} device
   * @returns {JSX}
   */
  const renderStatus = device => {
    // Check if sync is ongoing
    if (device.syncStatus && syncStatus === MasterSyncStatusSchema.syncOngoing) {
      switch (device.syncStatus) {
        default: return;
        case DeviceSyncStatusSchema.syncOngoing:
          // Ongoing sync
          return (
            <div className="d-flex align-items-center">
              <ProgressIndicator
                isDetermined={false}
                status="start"
                className="ml-0 mr-2"
              />
              <span>{i18n.t('userManagement.members.syncing')}</span>
            </div>
          );
        case DeviceSyncStatusSchema.syncFinished:
          // Sync finished
          return (
            <div className="d-flex align-items-center">
              <i className="fas fa-lg fa-check-circle mr-2"/>
              <span>{i18n.t('userManagement.members.done')}</span>
            </div>
          );
        case DeviceSyncStatusSchema.syncAbnormal:
          // Sync failed
          return (
            <div className="d-flex align-items-center">
              <i className="fas fa-lg fa-times-circle mr-2"/>
              <span>{i18n.t('userManagement.members.failed')}</span>
            </div>
          );
      }
    } else {
      // Show failed if last update failed
      if (device.syncStatus === DeviceSyncStatusSchema.syncAbnormal) {
        return (
          <div className="d-flex align-items-center">
            <i className="fas fa-lg fa-times-circle mr-2"/>
            <span>{i18n.t('userManagement.members.failed')}</span>
          </div>
        );
      }

      // Display last synced time if lastUpdateTime is not 0
      if (device.lastUpdateTime) {
        return (
          <CustomTooltip title={formatDate(device.lastUpdateTime)}>
            <span>
              <i className="fas fa-lg fa-check-circle mr-2"/>
              {i18n.t('userManagement.members.lastUpdated') + ': ' + formatDate(device.lastUpdateTime)}
            </span>
          </CustomTooltip>
        );
      }

      // Device has not been synced at all - show if initial device linking was successful
      switch (device.connectionStatus) {
        default: return;
        case ConnectionStatusSchema.connectionSuccess:
          return (
            <CustomTooltip title={i18n.t('userManagement.members.tooltip.connected')}>
              <i className="fas fa-lg fa-link"/>
            </CustomTooltip>
          );
        case ConnectionStatusSchema.connectionFail:
          return (
            <CustomTooltip title={i18n.t('userManagement.members.tooltip.notConnected')}>
              <i className="fas fa-lg fa-unlink"/>
            </CustomTooltip>
          );
      }
    }
  };

  return (
    <>
      <div className="col-12 pt-4 mb-5 table-responsive">
        <FormikEffect onChange={onChangeCardForm}/>
        <table className="table custom-style">
          <thead>
            <tr className="shadow">
              <th
                className="text-center th-checkbox"
                style={{width: '10%'}}
              >
                <input
                  ref={selectAllRef}
                  id="selectAll"
                  type="checkbox"
                  indeterminate="true"
                  checked={isSelectAll}
                  onChange={selectAllHandler(form)}
                />
                <label htmlFor="selectAll"/>
              </th>
              <th style={{width: '15%'}}>{i18n.t('userManagement.members.host')}</th>
              <th style={{width: '30%'}}>{i18n.t('userManagement.members.deviceName')}</th>
              <th style={{width: '30%'}}>{i18n.t('userManagement.members.status')}</th>
              <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.length ? (
                deviceList[page] && deviceList[page].map((device, index) => {
                  return (
                    <tr
                      key={device.id}
                      className={classNames({checked: form.values[page] && form.values[page][index] && form.values[page][index].isChecked})}
                    >
                      <td className="text-center td-checkbox">
                        <Field
                          name={`${page}.${index}.isChecked`}
                          id={device.id}
                          type="checkbox"
                        />
                        <label htmlFor={device.id}/>
                      </td>
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
                          {renderStatus(device)}
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
        </table>
      </div>
      {/* Delete confirmation */}
      <CustomNotifyModal
        backdrop="static"
        isShowModal={isShowConfirmModal}
        modalTitle={i18n.t('userManagement.members.modal.deviceSync.confirmDeleteTitle')}
        modalBody={i18n.t('userManagement.members.modal.deviceSync.confirmDeleteBody')}
        onHide={hideConfirmModal}
        onConfirm={deleteDevice(deleteDeviceID ? deleteDeviceID : form.values)}
      />
    </>
  );
};

DeviceSyncTable.propTypes = {
  devices: PropTypes.array.isRequired,
  deviceList: PropTypes.array.isRequired,
  syncStatus: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  isShowConfirmModal: PropTypes.bool.isRequired,
  hideConfirmModal: PropTypes.func.isRequired,
  editDeviceHandler: PropTypes.func.isRequired,
  deleteDevice: PropTypes.func.isRequired,
  deleteDeviceID: PropTypes.func
};

export default DeviceSyncTable;

