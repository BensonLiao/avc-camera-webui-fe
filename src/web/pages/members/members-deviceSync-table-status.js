import PropTypes from 'prop-types';
import React from 'react';
import ConnectionStatusSchema from 'webserver-form-schema/constants/members-device-connection-status';
import DeviceSyncStatusSchema from 'webserver-form-schema/constants/members-device-sync-status';
import MasterSyncStatusSchema from 'webserver-form-schema/constants/members-master-sync-status';
import CustomTooltip from '../../../core/components/tooltip';
import {formatDate} from '../../../core/utils';
import i18n from '../../../i18n';
import ProgressIndicator from '../../../core/components/progress-indicator';

/**
 * Conditional render for device status
 * @param {Object} device
 * @param {number} syncStatus
 * @returns {JSX} - Device status
 */
const DeviceSyncTableStatus = ({device, syncStatus}) => {
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

DeviceSyncTableStatus.propTypes = {
  device: PropTypes.shape({
    account: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    ip: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    connectionStatus: PropTypes.number.isRequired,
    lastUpdateTime: PropTypes.number.isRequired,
    syncStatus: PropTypes.number.isRequired
  }).isRequired,
  syncStatus: PropTypes.number.isRequired
};

export default DeviceSyncTableStatus;
