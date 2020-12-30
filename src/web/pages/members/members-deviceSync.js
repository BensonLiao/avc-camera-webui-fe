import classNames from 'classnames';
import {getRouter} from '@benson.liao/capybara-router';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import DeviceSyncAddDevice from './members-deviceSync-add';
import FormikEffect from '../../../core/components/formik-effect';
import {Formik, Form, Field} from 'formik';
import {formatDate, getPaginatedData, isArray} from '../../../core/utils';
import noDevice from '../../../resource/noDevice.png';
import notify from '../../../core/notify';
import Pagination from '../../../core/components/pagination';
import ProgressIndicator from '../../../core/components/progress-indicator';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import MasterSyncStatusSchema from 'webserver-form-schema/constants/members-master-sync-status';
import SourceStatusSchema from 'webserver-form-schema/constants/members-sync-source-status';

// Sync API ping frequency, in seconds
const REFRESH_LIST_INTERVAL = 5;
const ITEMS_PER_PAGE = 10;

const DeviceSync = ({deviceSync: {devices, syncStatus}, ipAddress}) => {
  const [isShowDeviceModal, setIsShowDeviceModal] = useState(false);
  const [device, setDevice] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [deleteDeviceID, setDeleteDeviceID] = useState();
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const selectAllRef = useRef();
  const formRef = useRef();

  const generatePaginatedDeviceList = devices => {
    return getPaginatedData(devices.map(device => ({
      ...device,
      isChecked: false
    })), ITEMS_PER_PAGE);
  };

  const [deviceList, setDeviceList] = useState(generatePaginatedDeviceList(devices));

  const showDeviceModal = () => setIsShowDeviceModal(true);

  const showConfirmModal = () => setIsShowConfirmModal(true);

  const hideDeviceModal = () => {
    setDevice(null);
    setIsShowDeviceModal(false);
  };

  const hideConfirmModal = () => setIsShowConfirmModal(false);

  const hideApiProcessModal = () => setIsShowApiProcessModal(false);

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
  }, [page, selectAllCheckboxState]);

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
      // Check if all checkboxes has been selected
      if (values[page].some(device => !device.isChecked)) {
        selectAllRef.current.indeterminate = true;
      } else {
        // All checkboxes selected manually
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
   * Remove checked unlinked devices
   * @param {Object} form
   * @returns {void}
   */
  const removeUnlinkedDevices = form => event => {
    event.preventDefault();
    form.values.forEach((page, pageIndex) => {
      page.forEach((device, deviceIndex) => {
        if (device.isChecked && !device.connectionStatus) {
          form.setFieldValue(`${pageIndex}.${deviceIndex}.isChecked`, false);
        }
      });
    });
  };

  /**
   * Edit selected device
   * @param {Object} device - individual device data
   * @returns {void}
   */
  const editDeviceHandler = device => _ => {
    setDevice(device);
    setIsShowDeviceModal(true);
  };

  /**
   * Delete selected device
   * @param {Array | String} list - Single device ID or a list to filter for devices selected to be deleted
   * @returns {void}
   */
  const deleteDevice = list => _ => {
    hideConfirmModal();
    setIsShowApiProcessModal(true);
    localStorage.setItem('currentPage', 'sync');
    const isListArray = isArray(list);
    api.member.deleteDevice({devices: isListArray ? checkedItemsToArray(list) : [list]})
      .then(getRouter().reload)
      .finally(hideApiProcessModal);
  };

  /**
   * Show delete confirm modal for selected device
   * @param {number} deviceID
   * @returns {void}
   */
  const confirmDelete = (deviceID = null) => _ => {
    showConfirmModal(true);
    setDeleteDeviceID(deviceID);
  };

  /**
   * Return array of selected items from given list
   * @param {Object} list - Formik form values
   * @returns {Array}
   */
  const checkedItemsToArray = list => list.flat().filter(device => device.isChecked)
    .reduce((arr, item) => {
      arr.push(item.id);
      return arr;
    }, []);

  /**
   * Sync selected Databases
   * @param {Object} list - form values
   * @returns {void}
   */
  const syncDB = list => {
    localStorage.setItem('currentPage', 'sync');
    const checkedDevices = checkedItemsToArray(list);
    getRouter().reload();
    api.member.syncDB({devices: checkedDevices});
  };

  // Check if DB sync process is in progress
  useEffect(() => {
    let syncID;
    // Ping sync api to get latest device sync status and update device list
    const refreshList = () => api.member.syncDB()
      .then(syncStatus => {
        syncStatus.data.devices.forEach(syncDevice => {
          const index = devices.findIndex(device => device.id === syncDevice.id);
          devices[index] = syncDevice;
        });
        setDeviceList(generatePaginatedDeviceList(devices));
        return syncStatus.data;
      })
      .then(({devices, sourceStatus}) => {
        // Stop pinging if status is not 0 or 1 (Not yet started or syncing) -AND- master device sync status is 8 (all finished, regardless or errors)
        if (!devices.some(device =>
          device.syncStatus === DeviceSyncStatusSchema.syncNotStarted ||
           device.syncStatus === DeviceSyncStatusSchema.syncOngoing
        ) && sourceStatus === SourceStatusSchema.importFinish) {
          localStorage.setItem('currentPage', 'sync');
          notify.showSuccessNotification({
            title: i18n.t('userManagement.members.toast.syncSuccessTitle'),
            message: i18n.t('userManagement.members.toast.syncSuccessBody')
          });
          clearInterval(syncID);
          getRouter().reload();
        }
      });

    if (syncStatus) {
      refreshList();
      syncID = setInterval(refreshList, REFRESH_LIST_INTERVAL * 1000);
    }

    return () => clearInterval(syncID);
  }, [devices, syncStatus]);

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
    <div>
      <Formik
        innerRef={formRef}
        initialValues={deviceList}
        onSubmit={syncDB}
      >
        {form => {
          const flattenedFormValues = form.values.flat();
          const noneSelectedDisableButton = !flattenedFormValues.some(device => device.isChecked);
          const invalidSelection = flattenedFormValues.some(device => device.isChecked && !device.connectionStatus);
          return (
            <Form className="card-body">
              <FormikEffect onChange={onChangeCardForm}/>
              <div className="col-12 d-inline-flex justify-content-between">
                <div className="d-inline-flex">
                  {syncStatus ? (
                    <button
                      disabled
                      className="btn btn-primary rounded-pill"
                      type="button"
                    >
                      <i className="fas fa-spin fa-sync-alt fa-fw mr-2"/>
                      {i18n.t('userManagement.members.syncing')}
                    </button>
                  ) : (
                    <CustomTooltip placement="auto" show={noneSelectedDisableButton || invalidSelection} title={invalidSelection ? i18n.t('userManagement.members.tooltip.invalidSelection') : i18n.t('userManagement.members.tooltip.noDevice')}>
                      <div>
                        <button
                          className="btn btn-primary rounded-pill"
                          type="submit"
                          disabled={noneSelectedDisableButton || invalidSelection}
                          style={{pointerEvents: noneSelectedDisableButton || invalidSelection ? 'none' : 'auto'}}
                        >
                          <i className="fas fa-exchange-alt fa-fw mr-2"/>
                          {i18n.t('userManagement.members.synchronize')}
                        </button>
                      </div>
                    </CustomTooltip>
                  )}
                  {invalidSelection && (
                    <a href="#" className="ml-4 d-flex align-items-center" onClick={removeUnlinkedDevices(form)}>{i18n.t('userManagement.members.removeUnlinked')}</a>
                  )}
                </div>
                <div className="d-inline-flex">
                  <CustomTooltip placement="top" show={noneSelectedDisableButton} title={i18n.t('userManagement.members.tooltip.noDevice')}>
                    <div className="ml-3">
                      <button
                        className="btn btn-outline-primary rounded-pill"
                        type="button"
                        disabled={noneSelectedDisableButton}
                        style={{pointerEvents: noneSelectedDisableButton ? 'none' : 'auto'}}
                        onClick={confirmDelete()}
                      >
                        <i className="far fa-trash-alt fa-lg fa-fw mr-2"/>
                        {i18n.t('userManagement.members.remove')}
                      </button>
                    </div>
                  </CustomTooltip>
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill ml-3"
                    onClick={showDeviceModal}
                  >
                    <i className="fas fa-plus fa-fw mr-2"/>
                    {i18n.t('common.button.add')}
                  </button>
                </div>
                <DeviceSyncAddDevice
                  device={device}
                  devices={devices}
                  ipAddress={ipAddress}
                  isShowDeviceModal={isShowDeviceModal}
                  hideDeviceModal={hideDeviceModal}
                />
              </div>
              <div className="col-12 pt-4 mb-5 table-responsive">
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
              <Pagination
                name="page"
                index={page}
                size={ITEMS_PER_PAGE}
                total={deviceList.flat().length}
                currentPageItemQuantity={deviceList[page] ? deviceList[page].length : 0}
                hrefTemplate=""
                setPageIndexState={setPage}
              />
              {/* Delete confirmation */}
              <CustomNotifyModal
                backdrop="static"
                isShowModal={isShowConfirmModal}
                modalTitle={i18n.t('userManagement.members.modal.deviceSync.confirmDeleteTitle')}
                modalBody={i18n.t('userManagement.members.modal.deviceSync.confirmDeleteBody')}
                onHide={hideConfirmModal}
                onConfirm={deleteDevice(deleteDeviceID ? deleteDeviceID : form.values)}
              />
            </Form>
          );
        }}
      </Formik>
      {/* API processing modal */}
      <CustomNotifyModal
        modalType="process"
        backdrop="static"
        isShowModal={isShowApiProcessModal}
        modalTitle={i18n.t('userManagement.members.modal.deviceSync.deleteDeviceApiProcessingModal')}
        onHide={hideApiProcessModal}
      />
    </div>
  );
};

DeviceSync.propTypes = {
  deviceSync: PropTypes.shape({
    devices: PropTypes.arrayOf(PropTypes.shape({
      account: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      ip: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connectionStatus: PropTypes.number.isRequired,
      lastUpdateTime: PropTypes.number.isRequired,
      syncStatus: PropTypes.number.isRequired
    })),
    syncStatus: PropTypes.number.isRequired
  }).isRequired,
  ipAddress: PropTypes.string.isRequired
};

export default DeviceSync;

