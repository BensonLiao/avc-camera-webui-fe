import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../i18n';
import CustomTooltip from './tooltip';

const VolumeProgressBar = ({total, usage, percentageToHideText}) => {
  const usedDiskPercentage = Math.ceil((usage / total) * 100);
  const freeDiskPercentage = 100 - usedDiskPercentage;
  const freeDiskVolume = total - usage;
  return (
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
  percentageToHideText: PropTypes.number
};

VolumeProgressBar.defaultProps = {percentageToHideText: 8};

export default VolumeProgressBar;
