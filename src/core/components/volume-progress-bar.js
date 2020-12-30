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
    <div className="volume-progress-bar-round ">
      <div className={`pie-wrapper progress-${usedDiskPercentage} style-2`}>
        <img src={SDCardIcon} className="img"/>
        <div className="pie">
          <div className="left-side half-circle"/>
          <div className="right-side half-circle"/>
        </div>
        <div className="shadow"/>
      </div>
      <div className="card rounded-0 p-2">
        <p className="mb-0">
          {i18n.t('common.volumeBar.free', {0: filesize(freeDiskVolume)})}
        </p>
        <p className="mb-0">
          {i18n.t('common.volumeBar.total', {0: filesize(total)})}
        </p>
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
