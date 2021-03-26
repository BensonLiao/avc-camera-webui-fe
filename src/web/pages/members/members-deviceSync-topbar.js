import Clock from 'react-live-clock';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Trans} from 'react-i18next';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import MasterSyncStatus from 'webserver-form-schema/constants/members-master-sync-status';
import api from '../../../core/apis/web-api';
import CustomTooltip from '../../../core/components/tooltip';
import DeviceSyncSchedule from './members-deviceSync-schedule';
import i18n from '../../../i18n';
import {MEMBER_PAGES, MAX_DEVICES, MAX_SELECTED_DEVICES} from '../../../core/constants';
import {useProcessing} from '../../../core/components/processing';
import {tableState} from '../../../core/components/checkbox-table';
import TableFixTopCaption from '../../../core/components/table-fixtop-caption';

const DeviceSyncTopBar = ({
  devices,
  devicesInSync,
  syncStatus,
  disableInput,
  isCancelSync,
  filterType,
  refreshDevice,
  handleDelete,
  showDeviceModal,
  setFilterType,
  setIsCancelSync
}) => {
  const processing = useProcessing();
  const {noneSelectedDisableButton, maxSelectedDevicesReached} = disableInput;
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
  const devicesLeftCount = MAX_SELECTED_DEVICES - tableState.current?.length ?? 0;
  const [isShowDBSchedule, setIsShowDBSchedule] = useState(false);
  const showDBScheduleModal = () => setIsShowDBSchedule(true);
  const hideDBScheduleModal = () => setIsShowDBSchedule(false);

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
   * Calculate total number of each status during sync: done, failed and syncing
   * Initiate sync timer on sync start
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

    if (syncStatus === MasterSyncStatus.syncOngoing) {
      const fetchTime = async () => {
        // Use device time as datum
        const {deviceTime} = await api.system.getSystemDateTime().then(response => response.data);
        const getSyncingDeviceLastUpdateTime = devicesInSync[0];
        setElapsedTime(getSyncingDeviceLastUpdateTime ? deviceTime - getSyncingDeviceLastUpdateTime.lastUpdateTime : 1);
      };

      fetchTime();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesInSync]);

  /**
   * Cancel Sync process
   * @returns {void}
   */
  const cancelSync = () => {
    progress.start();
    processing.start({title: i18n.t('userManagement.members.modal.deviceSync.cancelDeviceApiProcessingModal')});
    setIsCancelSync(true);
    localStorage.setItem('currentTab', MEMBER_PAGES.SYNC);
    api.member.cancelSync()
      .then(getRouter().reload)
      .finally(() => {
        progress.done();
        processing.done();
      });
  };

  /**
   * Render filter button and item menu
   * @returns {JSX}
   */
  const renderFilterButton = () => (
    <div className="dropdown filter-dropdown">
      <button
        disabled={devices.length === 0}
        style={{pointerEvents: devices.length === 0 ? 'none' : 'auto'}}
        className="btn border-primary text-primary rounded-pill dropdown-toggle"
        type="button"
        data-toggle="dropdown"
      >
        {
          (() => {
            switch (filterType) {
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
   * Conditioanl render of caption helper
   * @returns {JSX}
   */
  const renderHelperCaption = () => {
    return (maxSelectedDevicesReached ?
      (
    // Exceeded maximum allowed number of devices
        <span className="mr-4">
          {i18n.t('userManagement.members.maxDeviceReached')}
        </span>
      ) : (
        // Determine initial caption
        tableState.current?.length === 0 ?
          (
            // Initial helper caption
            <span>{i18n.t('userManagement.members.selectDevicesToSync')}</span>
          ) : (
            // Allowed devices left
            <Trans
              i18nKey="userManagement.members.numberOfDevicesLeft"
              count={devicesLeftCount}
            >
              Up to <span id="devices-left" className="mx-2">{{devicesLeftCount}}</span> device left.
            </Trans>
          )
      )
    );
  };

  /**
   * Handler for filter to set filter state
   * @param {String} type - Type of filter applied
   * @returns {void}
   */
  const filterHandler = (type = null) => event => {
    event.preventDefault();
    setFilterType(type);
  };

  return (
    <>
      <div className="col-12 d-inline-flex justify-content-between p-0">
        <div className="d-inline-flex">
          {syncStatus ? (

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
          ) : (
            <CustomTooltip
              placement="auto"
              show={maxSelectedDevicesReached || noneSelectedDisableButton}
              title={maxSelectedDevicesReached ?
                i18n.t('userManagement.members.tooltip.maxSelectedDeviceReached') :
                i18n.t('userManagement.members.tooltip.noDevice')}
            >
              <div>
                <button
                  className="btn btn-outline-primary rounded-pill"
                  type="submit"
                  disabled={maxSelectedDevicesReached || noneSelectedDisableButton}
                  style={{pointerEvents: maxSelectedDevicesReached || noneSelectedDisableButton ? 'none' : 'auto'}}
                >
                  <i className="fas fa-exchange-alt fa-fw mr-2"/>
                  {i18n.t('userManagement.members.synchronize')}
                </button>
              </div>
            </CustomTooltip>
          )}
          <CustomTooltip
            placement="auto"
            show={noneSelectedDisableButton && !syncStatus}
            title={i18n.t('userManagement.members.tooltip.noDevice')}
          >
            <div>
              <button
                className="btn btn-outline-primary rounded-pill ml-3"
                type="button"
                disabled={noneSelectedDisableButton}
                style={{pointerEvents: noneSelectedDisableButton ? 'none' : 'auto'}}
                onClick={refreshDevice()}
              >
                <i className="fas fa-redo fa-fw mx-2"/>
              </button>
            </div>
          </CustomTooltip>
          <div className="vertical-border"/>
          {renderFilterButton()}
        </div>
        <div className="d-inline-flex">
          <CustomTooltip placement="top" show={maxDevicesReached} title={i18n.t('userManagement.members.maxDeviceReached')}>
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
          <div className="dropdown">
            <button
              className="btn no-highlight text-primary shadow-none"
              type="button"
              disabled={syncStatus}
              data-toggle="dropdown"
            >
              <i className="fas fa-ellipsis-v fa-fw text-primary"/>
            </button>
            <div className="dropdown-menu dropdown-menu-right shadow text-primary">
              <CustomTooltip
                placement="top"
                show={!syncStatus && noneSelectedDisableButton}
                title={i18n.t('userManagement.members.tooltip.noDevice')}
              >
                <div style={!syncStatus && noneSelectedDisableButton ? {cursor: 'not-allowed'} : {}}>
                  <button
                    className="dropdown-item"
                    type="button"
                    disabled={noneSelectedDisableButton || syncStatus}
                    style={{pointerEvents: noneSelectedDisableButton ? 'none' : 'auto'}}
                    onClick={handleDelete()}
                  >
                    {i18n.t('common.tooltip.delete')}
                  </button>
                </div>
              </CustomTooltip>
              <button
                type="button"
                className="dropdown-item"
                onClick={showDBScheduleModal}
              >
                {i18n.t('userManagement.members.syncSchedule')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="horizontal-border"
        style={{
          width: 'calc(100% + 4rem)',
          marginLeft: '-2rem'
        }}
      />
      <div>
        {syncStatus ?
        // Conditional rendering of tableFixTopCaption during sync or normal mode
          (
            // Syncing
            <TableFixTopCaption
              isShow
              status="start"
            >
              <div className="d-flex align-content-center align-items-center">
                <span className="text-size-24">
                  {statusStat.syncing - statusStat.done - statusStat.failed}
                </span>
              </div>
              <div>
                <i className="fas fa-sync fa-spin mr-3"/>
                {i18n.t('userManagement.members.syncing')}...
              </div>
              <>
                <i className="fas fa-check-circle mr-1"/>
                <span className="mr-4 text-success">{statusStat.done}</span>
                <i className="fas fa-times-circle mr-1"/>
                <span className="text-danger">{statusStat.failed}</span>
              </>
            </TableFixTopCaption>
          ) : (
            // Normal mode
            <TableFixTopCaption
              isShow
              status={maxSelectedDevicesReached ? 'error' : 'info'}
            >
              <div className="d-flex align-content-center align-items-center">
                <span className="text-size-24 d-flex justify-content-end" style={{minWidth: '2.4rem'}}>
                  {tableState.current?.length ?? 0}&nbsp;&nbsp;
                </span>
                <span id="max-devices" className="text-size-16">
                  /{MAX_SELECTED_DEVICES}
                </span>
              </div>
              {renderHelperCaption()}
            </TableFixTopCaption>
          )}
      </div>
      <DeviceSyncSchedule
        isShowDBSchedule={isShowDBSchedule}
        hideDBScheduleModal={hideDBScheduleModal}
        devices={devices}
      />
    </>
  );
};

DeviceSyncTopBar.propTypes = {
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
  filterType: PropTypes.string,
  refreshDevice: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  showDeviceModal: PropTypes.func.isRequired,
  setFilterType: PropTypes.func.isRequired,
  setIsCancelSync: PropTypes.func.isRequired
};

export default DeviceSyncTopBar;
