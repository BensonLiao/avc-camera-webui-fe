const filesize = require('filesize');
const PropTypes = require('prop-types');
const React = require('react');
const i18n = require('../../web/i18n').default;
const CustomTooltip = require('./tooltip');

module.exports = class VolumeProgressBar extends React.PureComponent {
  static get propTypes() {
    return {
      total: PropTypes.number.isRequired,
      usage: PropTypes.number.isRequired,
      percentageToHideText: PropTypes.number
    };
  }

  static get defaultProps() {
    return {percentageToHideText: 8};
  }

  render() {
    const {usage, total, percentageToHideText} = this.props;
    const usedDiskPercentage = Math.ceil((usage / total) * 100);
    const freeDiskPercentage = 100 - usedDiskPercentage;
    const freeDiskVolume = total - usage;
    return (
      <>
        <p>
          {
            i18n.t('Free: {{0}}, Total: {{1}}', {
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
                  <CustomTooltip title={i18n.t('Used: {{0}}', {0: filesize(usage)})}>
                    <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                      {usedDiskPercentage > percentageToHideText ? `${usedDiskPercentage}%` : ''}
                    </div>
                  </CustomTooltip>
                  {usedDiskPercentage && (
                    <CustomTooltip title={i18n.t('Free: {{0}}', {0: filesize(freeDiskVolume)})}>

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
  }
};
