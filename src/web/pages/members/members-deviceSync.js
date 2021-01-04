import {Formik, Form} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect} from 'react';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import DeviceSyncAddDevice from './members-deviceSync-add';
import DeviceSyncTable from './members-deviceSync-table';
import {getPaginatedData, isArray} from '../../../core/utils';
import i18n from '../../../i18n';
import notify from '../../../core/notify';
import Pagination from '../../../core/components/pagination';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import SourceStatusSchema from 'webserver-form-schema/constants/members-sync-source-status';

// Sync API ping frequency, in seconds
const REFRESH_LIST_INTERVAL = 5;
const ITEMS_PER_PAGE = 10;

const DeviceSync = ({deviceSync: {devices, syncStatus}, ipAddress}) => {
  const [isShowDeviceModal, setIsShowDeviceModal] = useState(false);
  const [device, setDevice] = useState(null);
  const [page, setPage] = useState(0);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const [deleteDeviceID, setDeleteDeviceID] = useState();
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
   * Edit selected device
   * @param {Object} device - individual device data
   * @returns {void}
   */
  const editDeviceHandler = device => _ => {
    setDevice(device);
    setIsShowDeviceModal(true);
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
              <DeviceSyncTable
                devices={devices}
                deviceList={deviceList}
                syncStatus={syncStatus}
                form={form}
                formRef={formRef}
                page={page}
                confirmDelete={confirmDelete}
                editDeviceHandler={editDeviceHandler}
              />
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
    devices: DeviceSyncTable.propTypes.devices.isRequired,
    syncStatus: DeviceSyncTable.propTypes.syncStatus.isRequired
  }).isRequired,
  ipAddress: PropTypes.string.isRequired
};

export default DeviceSync;

