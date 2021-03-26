import React from 'react';
import SDCardRecordingStatus from 'webserver-form-schema/constants/sdcard-recording-status';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import {SD_STATUS_LIST} from '../../../core/constants';
import VolumeDistributionChart from '../../../core/components/volume-distribution-chart';

const SDCardMain = ({
  sdCardRecordingSettings,
  sdSpaceAllocation,
  isWaitingApiCall,
  systemInformation
}) => {
  const {sdFormat, sdStatus, sdUsage, sdTotal} = systemInformation;
  const {sdCardTotalBytes, recordingVideoBytes, snapshotImageBytes, sdCardAvailableBytes, sdcardReservedBytes, isInitialized} = sdSpaceAllocation;
  return (
    <div className="card-body sdcard">
      <div className="d-flex flex-column border p-2">
        <VolumeDistributionChart
          isRoundProgressBar
          total={isInitialized ? sdCardTotalBytes : sdTotal}
          free={isInitialized ? sdCardAvailableBytes : sdTotal - sdUsage}
          usageCategory={
            isInitialized ?
              [
                {[i18n.t('common.volumeBar.reserved')]: sdcardReservedBytes},
                {[i18n.t('common.volumeBar.recordingPercentage')]: recordingVideoBytes},
                {[i18n.t('common.volumeBar.snapshotPercentage')]: snapshotImageBytes},
                {[i18n.t('common.volumeBar.others')]: sdCardTotalBytes - recordingVideoBytes - snapshotImageBytes - sdCardAvailableBytes - sdcardReservedBytes}
              ] : [
                {[i18n.t('common.volumeBar.usedPercentage')]: sdUsage}
              ]
          }
          errorMessage={SD_STATUS_LIST[sdStatus] || i18n.t('sdCard.basic.constants.unknownStatus')}
        />
      </div>
      <div className="d-flex justify-content-center flex-column mt-4">
        <div className="form-group d-flex flex-column mb-2">
          <label className="mb-2">{i18n.t('sdCard.basic.enable')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="sdEnabled"
              type="checkbox"
              className="custom-control-input"
              id="switch-sound"
              disabled={isWaitingApiCall}
            />
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <hr/>
        <div className="form-group mb-0">
          <div className="d-flex flex-column mb-2">
            <label className="mb-o pl-0">{i18n.t('sdCard.basic.status')}</label>
            {sdCardRecordingSettings.sdRecordingStatus === Number(SDCardRecordingStatus.on) ? (
              <div className="d-flex align-items-center">
                <div className="dot-sd"/>
                <label className="text-danger">{i18n.t('sdCard.basic.recording')}</label>
              </div>
            ) : <label className="mb-o text-primary">{SD_STATUS_LIST[sdStatus] || i18n.t('sdCard.basic.constants.unknownStatus')}</label>}
          </div>
          <div className="mb-0 d-flex flex-column">
            <label className="mb-o pl-0">{i18n.t('sdCard.basic.filesystem')}</label>
            <label className="mb-o text-primary">{sdFormat === 'Unrecognized' ? i18n.t('sdCard.basic.unrecognized') : sdFormat}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

SDCardMain.propTypes = {
  sdCardRecordingSettings: PropTypes.object.isRequired,
  sdSpaceAllocation: PropTypes.object.isRequired,
  isWaitingApiCall: PropTypes.bool.isRequired,
  systemInformation: PropTypes.object.isRequired
};

export default SDCardMain;
