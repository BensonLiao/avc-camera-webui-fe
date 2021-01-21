import {Formik, Form} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect} from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import MasterSyncStatusSchema from 'webserver-form-schema/constants/members-master-sync-status';
import SourceStatusSchema from 'webserver-form-schema/constants/members-sync-source-status';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import DeviceSyncAddDevice from './members-deviceSync-add';
import DeviceSyncTable from './members-deviceSync-table';
import {getPaginatedData, isArray} from '../../../core/utils';
import i18n from '../../../i18n';
import {MEMBER_PAGES, ITEMS_PER_PAGE, MAX_SELECTED_DEVICES} from '../../../core/constants';
import Pagination from '../../../core/components/pagination';
import DeviceSyncTopBar from './members-deviceSync-topbar';
import {useNonInitialEffect} from '../../../core/utils';

// Sync API ping frequency, in seconds
const REFRESH_LIST_INTERVAL = 5;

const DeviceSync = ({deviceSync, ipAddress}) => {
  const [propsDeviceSync, setPropsDeviceSync] = useState(deviceSync);
  const {devices, syncStatus} = propsDeviceSync;
  const [deleteDeviceID, setDeleteDeviceID] = useState();
  const [devicesInSync, setDevicesInSync] = useState([]);
  const [filterType, setFilterType] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [deviceModal, setDeviceModal] = useState({
    isShow: false,
    device: null
  });
  const [confirmModal, setConfirmModal] = useState({
    isShow: false,
    body: ''
  });
  const [apiProcessModal, setApiProcessModal] = useState({
    isShow: false,
    title: ''
  });
  const [disableInput, setDisableInput] = useState({
    noneSelectedDisableButton: true,
    invalidSelection: false,
    maxSelectedDevicesReached: false
  });
  const [checkedItems, setCheckedItems] = useState([]);
  const [isUpdateList, setIsUpdateList] = useState(false);
  const [isCancelSync, setIsCancelSync] = useState(false);
  const savedFilterState = useRef();
  /**
   * Generate paginated list with default isChecked key for Formik checkboxes
   * @param {Array}   devices             - Array of devices to paginate
   * @param {Boolean} retainCheckedStatus - Option to retain checkbox status on rerender
   * @returns {Array}
   */
  const generatePaginatedDeviceList = (devices, retainCheckedStatus = false) => {
    return getPaginatedData(devices.map(device => ({
      ...device,
      isChecked: retainCheckedStatus ? checkedItems.some(id => id === device.id) : false
    })), ITEMS_PER_PAGE);
  };

  const [deviceList, setDeviceList] = useState(generatePaginatedDeviceList(devices));

  const showDeviceModal = () => setDeviceModal(state => ({
    ...state,
    isShow: true
  }));

  const hideDeviceModal = () => setDeviceModal({
    isShow: false,
    device: null
  });

  const hideConfirmModal = () => setConfirmModal(state => ({
    ...state,
    isShow: false
  }));

  const hideApiProcessModal = () => setApiProcessModal(state => ({
    ...state,
    isShow: false
  }));

  /**
   * Filter device list
   * @param {String}  filter         - Parameter to filter: `failed`, `disconnected`, `success` or '' for all
   * @param {Array}   customList     - Custom list of devices (e.g. Devices in sync)
   * @param {Boolean} isCallbackData - Use `SyncingDevices` as device list instead of state
   * @returns {void}
   */
  const filterDevices = (filter, customList = devicesInSync, isCallbackData = false) => {
    // Reset page number only if sync is not in progress or switching between filters, prevents page
    // reset on every api ping during synchronisation
    if (syncStatus === MasterSyncStatusSchema.syncNotStarted || filter !== savedFilterState.current) {
      setPageNumber(0);
    }

    const deviceToFilter = isCallbackData ? customList : devices;

    if (filter && filter !== 'syncing') {
      const newList = (() => {
        switch (filter) {
          default: return;
          case ('connected'):
            return deviceToFilter.filter(device => device.connectionStatus === ConnectionStatusSchema.connectionSuccess && !device.lastUpdateTime);
          case ('disconnected'):
            return deviceToFilter.filter(device => device.connectionStatus !== ConnectionStatusSchema.connectionSuccess);
          case ('failed'):
            return deviceToFilter.filter(device =>
              device.syncStatus !== DeviceSyncStatusSchema.syncFinished &&
              device.syncStatus !== DeviceSyncStatusSchema.syncNotStarted &&
              device.syncStatus !== DeviceSyncStatusSchema.syncOngoing
            );
          case ('success'):
            return deviceToFilter.filter(device =>
              device.connectionStatus === ConnectionStatusSchema.connectionSuccess &&
              device.syncStatus === DeviceSyncStatusSchema.syncNotStarted &&
              device.lastUpdateTime
            );
        }
      })();
      return setDeviceList(generatePaginatedDeviceList(newList));
    }

    if (filter === 'syncing') {
      return setDeviceList(generatePaginatedDeviceList(customList));
    }

    setDeviceList(generatePaginatedDeviceList(deviceToFilter));
  };

  /**
   * Return array of selected items from given list
   * @param {Object} list - Formik form values
   * @param {String} type - Type of key to return (id, ip..., etc.)
   * @returns {Array}
   */
  const checkedItemsToArray = (list, type = 'id') => list.flat().filter(device => device.isChecked)
    .reduce((arr, item) => {
      arr.push(item[type]);
      return arr;
    }, []);

  /**
   * Refresh selected device
   * @param {Array | String} list - Single device ID or a list to filter for devices selected to be refreshed
   * @returns {void}
   */
  const refreshDevice = list => _ => {
    setApiProcessModal({
      isShow: true,
      title: i18n.t('userManagement.members.modal.deviceSync.refreshDeviceApiProcessingModal')
    });
    const isDeviceArray = isArray(list);
    api.member.refreshDevice({devices: isDeviceArray ? checkedItems : [list]})
      .then(setIsUpdateList(prevState => !prevState))
      .finally(hideApiProcessModal);
  };

  /**
   * Show delete confirm modal for selected device
   * @param {number} deviceToDelete
   * @returns {void}
   */
  const confirmDelete = deviceToDelete => _ => {
    const isListArray = isArray(deviceToDelete);
    if (isListArray) {
      let ipList = checkedItemsToArray(deviceToDelete, 'ip');
      ipList.unshift(`${i18n.t('userManagement.members.modal.deviceSync.numberOfDevices')}: ${ipList.length}`);
      ipList.unshift(i18n.t('userManagement.members.modal.deviceSync.confirmMultipleDeleteBody'));
      setConfirmModal({
        isShow: true,
        body: ipList
      });
    } else {
      setConfirmModal({
        isShow: true,
        body: i18n.t('userManagement.members.modal.deviceSync.confirmDeleteBody')
      });
    }

    setDeleteDeviceID(deviceToDelete);
  };

  /**
   * Delete selected device
   * @param {Array | String} list - Single device ID or a list to filter for devices selected to be deleted
   * @returns {void}
   */
  const deleteDevice = list => _ => {
    hideConfirmModal();
    setApiProcessModal({
      isShow: true,
      title: i18n.t('userManagement.members.modal.deviceSync.deleteDeviceApiProcessingModal')
    });
    const isListArray = isArray(list);
    api.member.deleteDevice({devices: isListArray ? checkedItems : [list]})
      .then(setIsUpdateList(prevState => !prevState))
      .finally(hideApiProcessModal);
  };

  /**
   * Formik effect function, set various states for disabling button
   * @param {Object} formValues - Formik form values
   * @returns {void}
   */
  const onFormChange = formValues => () => {
    if (syncStatus === MasterSyncStatusSchema.syncNotStarted) {
      const flattenedFormValues = formValues.flat();
      const checkedItems = checkedItemsToArray(flattenedFormValues);
      setCheckedItems(checkedItems);
      // Disable Sync button:
      setDisableInput({
      // None selected
        noneSelectedDisableButton: checkedItems.length === 0,
        // Has disconnected devices
        invalidSelection: flattenedFormValues.some(device => device.isChecked && (
          device.connectionStatus === ConnectionStatusSchema.connectionFail ||
        device.connectionStatus === ConnectionStatusSchema.loginFail
        )),
        // Reached limit for selected devices to sync
        maxSelectedDevicesReached: checkedItems.length > MAX_SELECTED_DEVICES
      });
    }
  };

  /**
   * Sync selected Databases
   * @param {Object} list - form values
   * @returns {void}
   */
  const syncDB = () => {
    localStorage.setItem('currentTab', MEMBER_PAGES.SYNC);
    api.member.syncDB({devices: checkedItems})
      .then(getRouter().reload);
  };

  /**
   * Update latest filter type state for setInterval function in sync useEffect
   */
  useNonInitialEffect(() => {
    savedFilterState.current = filterType;
  }, [filterType]);

  /**
   * Sync useEffect, checks if sync is ongoing on component load
   * will ping sync api once every REFRESH_LIST_INTERVAL seconds if master sync status is set to 1 (from GET API)
   * stops if source sync status is 8 (all finished, regardless or errors) (from sync API)
   */
  useEffect(() => {
    // Check if DB sync process is in progress
    let syncID;
    if (isCancelSync) {
      clearInterval(syncID);
      return;
    }

    // Ping sync api to get latest device sync status and update device list
    const refreshList = () => api.member.syncDB()
      .then(syncStatus => {
        setDevicesInSync(syncStatus.data.devices || []);
        if (syncStatus.data.devices) {
          let newDevices = devices;
          syncStatus.data.devices.forEach(syncDevice => {
            const index = devices.findIndex(device => device.id === syncDevice.id);
            newDevices[index] = syncDevice;
          });
          setPropsDeviceSync(prevState => ({
            ...prevState,
            devices: newDevices
          }));
        }

        // Remember filter and apply on every sync api ping if filter was selected
        if (savedFilterState.current && savedFilterState.current !== 'syncing') {
          filterDevices(savedFilterState.current);
        } else if (savedFilterState.current === 'syncing') {
          filterDevices(savedFilterState.current, syncStatus.data.devices);
        } else {
          setDeviceList(generatePaginatedDeviceList(devices));
        }

        return syncStatus.data.sourceStatus;
      })
      .then(sourceStatus => {
        // Stops pinging sync API
        if (sourceStatus === SourceStatusSchema.importFinish) {
          localStorage.setItem('currentTab', MEMBER_PAGES.SYNC);
          clearInterval(syncID);
          getRouter().reload();
        }
      });

    // Start pinging sync API
    if (syncStatus === MasterSyncStatusSchema.syncOngoing) {
      refreshList();
      syncID = setInterval(refreshList, REFRESH_LIST_INTERVAL * 1000);
    }

    return () => clearInterval(syncID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncStatus, isCancelSync]);

  /**
   * Refresh device list useEffect, this replaces router reload on every api action, greatly reducing api called
   * onApiCall is used to determine when to call GET api and refresh component device list
   */
  useNonInitialEffect(() => {
    api.member.getDevice()
      .then(response => {
        setPropsDeviceSync({
          syncStatus: response.data.syncStatus,
          devices: response.data.devices
        });
        if (filterType) {
          filterDevices(filterType, response.data.devices, true);
        } else {
          setDeviceList(generatePaginatedDeviceList(response.data.devices, true));
        }
      });
  }, [isUpdateList]);

  /**
   * Set page number to one before last page if all devices on last page was deleted
   */
  useNonInitialEffect(() => {
    if (propsDeviceSync.devices.length && deviceList.length !== 0 && !deviceList[pageNumber]) {
      setPageNumber(prevState => --prevState);
    }
  }, [deviceList]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={deviceList}
        onSubmit={syncDB}
      >
        {form => {
          return (
            <Form className="card-body p-0">
              <DeviceSyncTopBar
                form={form}
                devices={devices}
                devicesInSync={devicesInSync}
                syncStatus={syncStatus}
                disableInput={disableInput}
                isCancelSync={isCancelSync}
                savedFilterState={savedFilterState}
                refreshDevice={refreshDevice}
                confirmDelete={confirmDelete}
                showDeviceModal={showDeviceModal}
                filterDevices={filterDevices}
                setFilterType={setFilterType}
                setIsCancelSync={setIsCancelSync}
                setApiProcessModal={setApiProcessModal}
              />
              <DeviceSyncAddDevice
                device={deviceModal.device}
                devices={devices}
                ipAddress={ipAddress}
                isShowDeviceModal={deviceModal.isShow}
                hideDeviceModal={hideDeviceModal}
                setIsUpdateList={setIsUpdateList}
              />
              <DeviceSyncTable
                syncStatus={syncStatus}
                pageNumber={pageNumber}
                confirmDelete={confirmDelete}
                setDeviceModal={setDeviceModal}
                refreshDevice={refreshDevice}
                onFormChange={onFormChange}
              />
              <Pagination
                name="page"
                index={pageNumber}
                size={ITEMS_PER_PAGE}
                total={form.values.flat().length}
                currentPageItemQuantity={form.values[pageNumber] ? form.values[pageNumber].length : 0}
                hrefTemplate=""
                setPageIndexState={setPageNumber}
              />
              {/* Delete confirmation */}
              <CustomNotifyModal
                backdrop="static"
                isShowModal={confirmModal.isShow}
                modalTitle={i18n.t('userManagement.members.modal.deviceSync.confirmDeleteTitle')}
                modalBody={confirmModal.body}
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
        isShowModal={apiProcessModal.isShow}
        modalTitle={apiProcessModal.title}
        onHide={hideApiProcessModal}
      />
    </div>
  );
};

DeviceSync.propTypes = {
  deviceSync: PropTypes.shape({
    devices: PropTypes.arrayOf(DeviceSyncAddDevice.propTypes.device).isRequired,
    syncStatus: DeviceSyncTable.propTypes.syncStatus.isRequired
  }).isRequired,
  ipAddress: PropTypes.string.isRequired
};

export default DeviceSync;
