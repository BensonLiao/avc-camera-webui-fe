import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../i18n';
import CustomTooltip from './tooltip';
import SDCardIcon from '../../resource/sd-card.svg';

const VolumeProgressBar = ({total, usage, percentageToHideText, isRoundProgressBar}) => {
  const usedDiskPercentage = Math.ceil((usage / total) * 100);
  const freeDiskPercentage = 100 - usedDiskPercentage;
  const freeDiskVolume = total - usage;

  return isRoundProgressBar ? (
    <div className="d-flex flex-column col-4">
      <div className={`pie-wrapper-sd align-self-center progress-${usedDiskPercentage} style-2`}>
        <img src={SDCardIcon} className="img"/>
        <div className="pie">
          <div className="left-side half-circle"/>
          <div className="right-side half-circle"/>
        </div>
        <div className="shadow-pie"/>
      </div>
      <div className="card form-group rounded-0 p-2">
        <div>
          <label className="mb-0 col-sm-6">
            {i18n.t('common.volumeBar.free')}
          </label>
          <label className="mb-0 text-primary col-sm-6">
            {`${filesize(freeDiskVolume)}`}
          </label>
        </div>
        <div>
          <label className="mb-0 col-sm-6">
            {i18n.t('common.volumeBar.total')}
          </label>
          <label className="mb-0 text-primary col-sm-6">
            {`${filesize(total)}`}
          </label>
        </div>
      </div>
    </div>
  ) : (
    <>
      <p>
        {
          i18n.t('common.volumeBar.sdStorageStatus', {
            0: filesize(freeDiskVolume),
            1: filesize(total)
          })
        }
      </p>
      <div className="progress">
        {
          isNaN(usedDiskPercentage) ?
            <div className="progress-bar"/> : (
              <>
                <CustomTooltip title={i18n.t('common.volumeBar.used', {0: filesize(usage)})}>
                  <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                    {usedDiskPercentage > percentageToHideText ? `${usedDiskPercentage}%` : ''}
                  </div>
                </CustomTooltip>
                {usedDiskPercentage && (
                  <CustomTooltip title={i18n.t('common.volumeBar.free', {0: filesize(freeDiskVolume)})}>

                    <div
                      className="progress-bar"
                      style={{
                        width: `${freeDiskPercentage}%`,
                        backgroundColor: '#e9ecef',
                        color: 'var(--gray-dark)'
                      }}
                    >
                      {freeDiskPercentage > percentageToHideText ? `${freeDiskPercentage}%` : ''}
                    </div>
                  </CustomTooltip>
                )}
              </>
            )
        }
      </div>
    </>
  );
};

VolumeProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  usage: PropTypes.number.isRequired,
  percentageToHideText: PropTypes.number,
  isRoundProgressBar: PropTypes.bool
};

VolumeProgressBar.defaultProps = {percentageToHideText: 8};

export default VolumeProgressBar;
