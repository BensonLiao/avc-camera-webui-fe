import Clock from 'react-live-clock';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import api from '../../../core/apis/web-api';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {MEMBER_PAGES, MAX_DEVICES} from '../../../core/constants';

const DeviceSyncTopBar = ({
  form,
  devices,
  devicesInSync,
  syncStatus,
  disableInput,
  isCancelSync,
  savedFilterState,
  refreshDevice,
  confirmDelete,
  showDeviceModal,
  filterDevices,
  setFilterType,
  setIsCancelSync,
  setApiProcessModal
}) => {
  const {noneSelectedDisableButton, invalidSelection, maxSelectedDevicesReached} = disableInput;
  const [maxDevicesReached, setMaxDevicesReached] = useState(false);
  const [statusStat, setStatusStat] = useState({
    done: 0,
    failed: 0,
    syncing: 0
  });
  const [deviceStat, setDeviceStat] = useState({
    connected: 0,
    disconnected: 0,
    success: 0,
    failed: 0
  });
  const [elapsedTime, setElapsedTime] = useState(1);

  /**
   * Calculate total number of each status: connected, disconnected, failed and success
   */
  useEffect(() => {
    // Disable add button: if number of devices reaches max allowed devices
    setMaxDevicesReached(devices.length > MAX_DEVICES);
    setDeviceStat({
      connected: devices.reduce((acc, device) => (
        device.connectionStatus === ConnectionStatusSchema.connectionSuccess && !device.lastUpdateTime ? acc + 1 : acc
      ), 0),
      disconnected: devices.reduce((acc, device) => (
        device.connectionStatus === ConnectionStatusSchema.connectionSuccess ? acc : acc + 1
      ), 0),
      failed: devices.reduce((acc, device) => (device.syncStatus > 2 &&
         device.connectionStatus === ConnectionStatusSchema.connectionSuccess ? acc + 1 : acc), 0),
      success: devices.reduce((acc, device) => (
        device.lastUpdateTime && device.syncStatus === DeviceSyncStatusSchema.syncNotStarted ? acc + 1 : acc
      ), 0)
    });
  }, [devices, devicesInSync]);

  /**
   * Initiate sync timer on sync start
   */
  useEffect(() => {
    const getSyncingDeviceLastUpdateTime = devices.find(device => device.syncStatus === DeviceSyncStatusSchema.syncOngoing);
    setElapsedTime(getSyncingDeviceLastUpdateTime ? new Date().getTime() - getSyncingDeviceLastUpdateTime.lastUpdateTime : 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncStatus]);

  /**
   * Calculate total number of each status during sync: done, failed and syncing
   */
  useEffect(() => {
    setStatusStat({
      done: devicesInSync.reduce((acc, device) => (device.syncStatus === DeviceSyncStatusSchema.syncFinished ? acc + 1 : acc), 0),
      failed: devicesInSync.reduce((acc, device) => (
        (
          device.syncStatus !== DeviceSyncStatusSchema.syncFinished &&
          device.syncStatus !== DeviceSyncStatusSchema.syncNotStarted &&
          device.syncStatus !== DeviceSyncStatusSchema.syncOngoing
        ) ? acc + 1 : acc
      ), 0),
      syncing: devicesInSync.length || 0
    });
  }, [devicesInSync]);

  /**
   * Remove checked unlinked devices
   * @param {Object} form
   * @returns {void}
   */
  const removeUnlinkedDevices = form => event => {
    event.preventDefault();
    form.values.forEach((page, pageIndex) => {
      page.forEach((device, deviceIndex) => {
        if (device.isChecked && device.connectionStatus !== ConnectionStatusSchema.connectionSuccess) {
          form.setFieldValue(`${pageIndex}.${deviceIndex}.isChecked`, false);
        }
      });
    });
  };

  /**
   * Cancel Sync process
   * @returns {void}
   */
  const cancelSync = () => {
    progress.start();
    setApiProcessModal({
      isShow: true,
      title: i18n.t('userManagement.members.modal.deviceSync.cancelDeviceApiProcessingModal')
    });
    setIsCancelSync(true);
    localStorage.setItem('currentTab', MEMBER_PAGES.SYNC);
    api.member.cancelSync()
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        setApiProcessModal({
          isShow: false,
          title: ''
        });
      });
  };

  /**
   * Render filter button and item menu
   * @returns {JSX}
   */
  const renderFilterButton = () => (
    <div className="dropdown ml-3">
      <button
        className="btn border-primary text-primary rounded-pill dropdown-toggle"
        type="button"
        data-toggle="dropdown"
      >
        {
          (() => {
            switch (savedFilterState.current) {
              default: return <i className="fas fa-filter fa-fw"/>;
              case ('connected'):
                return <i className="fas fa-link fa-fw"/>;
              case ('disconnected'):
                return <i className="fas fa-unlink fa-fw"/>;
              case ('success'):
                return (
                  <span className="sync-success">
                    <i className="fas fa-exchange-alt fa-fw"/>
                    <i className="fas fa-check-circle"/>
                  </span>
                );
              case ('failed'):
                return <i className="fas fa-times-circle fa-fw"/>;
              case ('syncing'):
                return <i className="fas fa-exchange-alt fa-fw"/>;
            }
          })()
        }

      </button>
      <div className="dropdown-menu dropdown-menu-left shadow">
        <a href="#" className="dropdown-item" onClick={filterHandler('connected')}>
          <i className="fas fa-link fa-fw mr-3"/>
          {i18n.t('userManagement.members.connected') + ` (${deviceStat.connected})`}
        </a>
        <a href="#" className="dropdown-item" onClick={filterHandler('disconnected')}>
          <i className="fas fa-unlink fa-fw mr-3"/>
          {i18n.t('userManagement.members.disconnected') + ` (${deviceStat.disconnected})`}
        </a>
        <a href="#" className="dropdown-item" onClick={filterHandler('success')}>
          <span className="sync-success">
            <i className="fas fa-exchange-alt fa-fw mr-3"/>
            <i className="fas fa-check-circle"/>
          </span>
          {i18n.t('userManagement.members.success') + ` (${deviceStat.success})`}
        </a>
        <a href="#" className="dropdown-item" onClick={filterHandler('failed')}>
          <i className="fas fa-times-circle fa-fw mr-3"/>
          {i18n.t('userManagement.members.failed') + ` (${deviceStat.failed})`}
        </a>
        {syncStatus ? (
          <a href="#" className="dropdown-item" onClick={filterHandler('syncing')}>
            <i className="fas fa-exchange-alt fa-fw mr-3"/>
            {i18n.t('userManagement.members.syncing') + ` (${statusStat.syncing})`}
          </a>
        ) : ''}
        <a href="#" className="dropdown-item" onClick={filterHandler()}>
          <i className="fas fa-list fa-fw mr-3"/>
          {i18n.t('userManagement.members.all') + ` (${devices.length || 0})`}
        </a>
      </div>
    </div>
  );

  /**
   * Handler for filter to set state and apply filter
   * @param {String} type - Type of filter applied
   * @returns {void}
   */
  const filterHandler = (type = null) => event => {
    event.preventDefault();
    setFilterType(type);
    filterDevices(type);
  };

  return (
    <div className="col-12 d-inline-flex justify-content-between">
      <div className="d-inline-flex">
        {syncStatus ? (
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-danger rounded-pill ml-2"
              type="button"
              onClick={cancelSync}
            >
              <i className="fas fa-stop fa-fw mr-2"/>
              {isCancelSync ? i18n.t('userManagement.members.cancelling') :
                (
                  <>
                    {i18n.t('userManagement.members.stop')}
                    <Clock
                      key={elapsedTime}
                      ticking
                      className="ml-3"
                      date={elapsedTime}
                      timezone="Etc/GMT"
                      format="H:mm:ss"
                    />
                  </>
                )}
            </button>
            {renderFilterButton()}
            <div className="vertical-border"/>
            <div className="btn btn-outline-primary rounded-pill bg-white">
              <i className="fas fa-check-circle mr-1"/>
              <span className="mr-4 text-success">{statusStat.done}</span>
              <i className="fas fa-times-circle mr-1"/>
              <span className="text-danger">{statusStat.failed}</span>
            </div>
          </div>
        ) : (
          <>
            <CustomTooltip
              placement="auto"
              show={maxSelectedDevicesReached || noneSelectedDisableButton || invalidSelection}
              title={invalidSelection ?
                i18n.t('userManagement.members.tooltip.invalidSelection') :
                maxSelectedDevicesReached ?
                  i18n.t('userManagement.members.tooltip.maxSelectedDeviceReached') :
                  i18n.t('userManagement.members.tooltip.noDevice')}
            >
              <div>
                <button
                  className="btn btn-outline-primary rounded-pill"
                  type="submit"
                  disabled={maxSelectedDevicesReached || noneSelectedDisableButton || invalidSelection}
                  style={{pointerEvents: maxSelectedDevicesReached || noneSelectedDisableButton || invalidSelection ? 'none' : 'auto'}}
                >
                  <i className="fas fa-exchange-alt fa-fw mr-2"/>
                  {i18n.t('userManagement.members.synchronize')}
                </button>
              </div>
            </CustomTooltip>
            <CustomTooltip
              placement="auto"
              show={noneSelectedDisableButton}
              title={i18n.t('userManagement.members.tooltip.noDevice')}
            >
              <div>
                <button
                  className="btn btn-outline-primary rounded-pill ml-3"
                  type="button"
                  disabled={noneSelectedDisableButton}
                  style={{pointerEvents: noneSelectedDisableButton ? 'none' : 'auto'}}
                  onClick={refreshDevice(form.values)}
                >
                  <i className="fas fa-redo fa-fw mr-2"/>
                  {i18n.t('userManagement.members.refresh')}
                </button>
              </div>
            </CustomTooltip>
            {renderFilterButton()}
          </>
        )}
        {invalidSelection && (
          <a href="#" className="ml-4 d-flex align-items-center" onClick={removeUnlinkedDevices(form)}>{i18n.t('userManagement.members.removeUnlinked')}</a>
        )}
      </div>
      <div className="d-inline-flex">
        <CustomTooltip placement="top" show={!syncStatus && noneSelectedDisableButton} title={i18n.t('userManagement.members.tooltip.noDevice')}>
          <div className="ml-3">
            <button
              className="btn btn-outline-primary rounded-pill"
              type="button"
              disabled={noneSelectedDisableButton || syncStatus}
              style={{pointerEvents: noneSelectedDisableButton ? 'none' : 'auto'}}
              onClick={confirmDelete(form.values)}
            >
              <i className="far fa-trash-alt fa-fw mr-2"/>
              {i18n.t('common.tooltip.delete')}
            </button>
          </div>
        </CustomTooltip>
        <CustomTooltip placement="top" show={maxDevicesReached} title={i18n.t('userManagement.members.tooltip.maxDeviceReached')}>
          <div>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill ml-3"
              disabled={maxDevicesReached || syncStatus}
              style={{pointerEvents: maxDevicesReached ? 'none' : 'auto'}}
              onClick={showDeviceModal}
            >
              <i className="fas fa-plus fa-fw mr-2"/>
              {i18n.t('common.button.add')}
            </button>
          </div>
        </CustomTooltip>
      </div>
    </div>
  );
};

DeviceSyncTopBar.propTypes = {
  form: PropTypes.object.isRequired,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      ip: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connectionStatus: PropTypes.number.isRequired,
      lastUpdateTime: PropTypes.number.isRequired,
      syncStatus: PropTypes.number.isRequired
    })
  ).isRequired,
  devicesInSync: PropTypes.array.isRequired,
  syncStatus: PropTypes.number.isRequired,
  disableInput: PropTypes.object.isRequired,
  isCancelSync: PropTypes.bool.isRequired,
  savedFilterState: PropTypes.object.isRequired,
  refreshDevice: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  showDeviceModal: PropTypes.func.isRequired,
  filterDevices: PropTypes.func.isRequired,
  setFilterType: PropTypes.func.isRequired,
  setIsCancelSync: PropTypes.func.isRequired,
  setApiProcessModal: PropTypes.func.isRequired
};

export default DeviceSyncTopBar;
