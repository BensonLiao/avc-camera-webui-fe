const filesize = require('filesize');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../languages');
const CustomTooltip = require('./tooltip');

module.exports = class SdVolumeProgressBar extends React.PureComponent {
  static get propTypes() {
    return {
      sdTotal: PropTypes.number.isRequired,
      sdUsage: PropTypes.number.isRequired,
      percentageToHideText: PropTypes.number
    };
  }

  static get defaultProps() {
    return {percentageToHideText: 8};
  }

  render() {
    const {sdUsage, sdTotal, percentageToHideText} = this.props;
    const usedDiskPercentage = Math.ceil((sdUsage / sdTotal) * 100);
    const freeDiskPercentage = 100 - usedDiskPercentage;
    const freeDiskVolume = sdTotal - sdUsage;
    return (
      <>
        <p>
          {
            _('Free: {0}, Total: {1}', [
              filesize(freeDiskVolume),
              filesize(sdTotal)
            ])
          }
        </p>
        <div className="progress">
          {
            isNaN(usedDiskPercentage) ?
              <div className="progress-bar"/> : (
                <>
                  <CustomTooltip title={_('Used: {0}', [filesize(sdUsage)])}>
                    <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                      {usedDiskPercentage > percentageToHideText ? `${usedDiskPercentage}%` : ''}
                    </div>
                  </CustomTooltip>
                  {usedDiskPercentage && (
                    <CustomTooltip title={_('Free: {0}', [filesize(freeDiskVolume)])}>

                      <div
                        className="progress-bar"
                        style={{
                          width: `${freeDiskPercentage}%`,
                          backgroundColor: '#e9ecef',
                          color: 'var(--gray-dark)'
                        }}
                      >
                        {freeDiskPercentage > 8 ? `${freeDiskPercentage}%` : ''}
                      </div>
                    </CustomTooltip>
                  )}
                </>
              )
          }
        </div>
      </>
    );
  }
};
