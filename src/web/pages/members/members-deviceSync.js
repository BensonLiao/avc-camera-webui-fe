import {Formik, Form} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect} from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import MasterSyncStatusSchema from 'webserver-form-schema/constants/members-master-sync-status';
import SourceStatusSchema from 'webserver-form-schema/constants/members-sync-source-status';
import api from '../../../core/apis/web-api';
import DeviceSyncAddDevice from './members-deviceSync-add';
import DeviceSyncTable from './members-deviceSync-table';
import {getPaginatedData} from '../../../core/utils';
import i18n from '../../../i18n';
import {MEMBER_PAGES, ITEMS_PER_PAGE, MAX_SELECTED_DEVICES} from '../../../core/constants';
import Pagination from '../../../core/components/pagination';
import DeviceSyncTopBar from './members-deviceSync-topbar';
import {useConfirm} from '../../../core/components/confirm';
import {useNonInitialEffect} from '../../../core/utils';
import {useProcessing} from '../../../core/components/processing';
import {tableState} from '../../../core/components/checkbox-table';

// Sync API ping frequency, in seconds
const REFRESH_LIST_INTERVAL = 5;

const DeviceSync = ({deviceSync, ipAddress}) => {
  const confirm = useConfirm();
  const processing = useProcessing();
  const [propsDeviceSync, setPropsDeviceSync] = useState(deviceSync);
  const {devices, syncStatus} = propsDeviceSync;
  const [devicesInSync, setDevicesInSync] = useState([]);
  const [filterType, setFilterType] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [deviceModal, setDeviceModal] = useState({
    isShow: false,
    device: null
  });
  const [disableInput, setDisableInput] = useState({
    noneSelectedDisableButton: true,
    maxSelectedDevicesReached: false
  });
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
      isChecked: retainCheckedStatus ? tableState.current?.some(id => id === device.id) : false
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
              device.syncStatus !== DeviceSyncStatusSchema.syncOngoing &&
              !(device.syncStatus === DeviceSyncStatusSchema.syncAbnormal &&
              device.connectionStatus !== ConnectionStatusSchema.connectionSuccess)
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
   * Refresh selected device
   * @param {number} deviceId - Single device ID to filter for devices selected to be refreshed
   * @returns {void}
   */
  const refreshDevice = (deviceId = null) => _ => {
    processing.start({title: i18n.t('userManagement.members.modal.deviceSync.refreshDeviceApiProcessingModal')});
    api.member.refreshDevice({devices: deviceId ? [deviceId] : tableState.current})
      .then(setIsUpdateList(prevState => !prevState))
      .finally(processing.done);
  };

  /**
   * Show delete confirm modal for selected device
   * @param {number} deviceId
   * @returns {void}
   */
  const handleDelete = (deviceId = null) => e => {
    e?.preventDefault();
    let confirmBody;
    if (deviceId) {
      confirmBody = i18n.t('userManagement.members.modal.deviceSync.confirmDeleteBody', [devices.find(device => device.id === deviceId)?.ip]);
    } else {
      confirmBody = tableState.current?.map(id => devices.find(device => device.id === id).ip);
      confirmBody.unshift(`${i18n.t('userManagement.members.modal.deviceSync.numberOfDevices')}: ${confirmBody.length}`);
      confirmBody.unshift(i18n.t('userManagement.members.modal.deviceSync.confirmMultipleDeleteBody'));
    }

    confirm.open({
      title: i18n.t('userManagement.members.modal.deviceSync.confirmDeleteTitle'),
      body: confirmBody
    })
      .then(isConfirm => {
        if (isConfirm) {
          processing.start({title: i18n.t('userManagement.members.modal.deviceSync.deleteDeviceApiProcessingModal')});
          api.member.deleteDevice({devices: deviceId ? [deviceId] : tableState.current})
            .then(() => {
              setIsUpdateList(prevState => !prevState);
              tableState.current = [];
            })
            .finally(processing.done);
        }
      });
  };

  /**
   * Formik effect function, set various states for disabling button
   * @param {Object} selectedItems - Checked items (taken from checkbox-table component)
   * @returns {void}
   */
  const onFormChange = selectedItems => {
    if (syncStatus === MasterSyncStatusSchema.syncNotStarted) {
      // Disable Sync button:
      setDisableInput({
      // None selected
        noneSelectedDisableButton: selectedItems.length === 0,
        // Reached limit for selected devices to sync
        maxSelectedDevicesReached: selectedItems.length > MAX_SELECTED_DEVICES
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
    api.member.syncDB({devices: tableState.current})
      .then(getRouter().reload);
  };

  /**
   * Filter list and update latest filter type state for setInterval function in sync useEffect (filtered items remains on deviceList update)
   */
  useNonInitialEffect(() => {
    filterDevices(filterType);
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
    <>
      <Formik
        enableReinitialize
        initialValues={deviceList}
        onSubmit={syncDB}
      >
        <Form className="card-body p-0">
          <DeviceSyncTopBar
            devices={devices}
            devicesInSync={devicesInSync}
            syncStatus={syncStatus}
            disableInput={disableInput}
            isCancelSync={isCancelSync}
            filterType={filterType}
            refreshDevice={refreshDevice}
            handleDelete={handleDelete}
            showDeviceModal={showDeviceModal}
            setFilterType={setFilterType}
            setIsCancelSync={setIsCancelSync}
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
            disableInput={disableInput}
            handleDelete={handleDelete}
            setDeviceModal={setDeviceModal}
            refreshDevice={refreshDevice}
            onFormChange={onFormChange}
          />
        </Form>
      </Formik>
      <Pagination
        name="page"
        index={pageNumber}
        size={ITEMS_PER_PAGE}
        total={deviceList.flat().length}
        currentPageItemQuantity={deviceList[pageNumber]?.length ?? 0}
        hrefTemplate=""
        setPageIndexState={setPageNumber}
      />
    </>
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
