import CustomTooltip from './tooltip';
import {Doughnut} from 'react-chartjs-2';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../i18n';
import SDCardIcon from '../../resource/sd-card.svg';

// If percentage is less than defined number, percentage label on bar will be hidden
const percentageToHideText = 7;
const defaultColorPalette = ['#999999', '#367CC2', '#E17223', '#873e23', '#abdbe3', '#063970'];

/**
 * Display volumes and respective usages in desired method of display
 *
 * @prop {Boolean} isRoundProgressBar - Toggle between line or doughnut (round) progress bar
 * @prop {Boolean} isShowLegend - Show chart legend
 * @prop {Number} total - Total volume
 * @prop {Number} free - Available volume
 * @prop {Array} usageCategory - Array of volume usages, key as labels and respective values
 * @prop {String} errorMessage - Error message when total size is < 0
 * @returns {Component}
 *
 * @example
 *   <VolumeDistributionChart
 *     total={sdCardTotalBytes}
 *     usageCategory={[
 *       {[i18n.t('common.volumeBar.recordingPercentage')]: recordingVideoBytes},
 *       {[i18n.t('common.volumeBar.snapshotPercentage')]: snapshotImageBytes}
 *     ]}
 *   />
 */
const VolumeDistributionChart = ({isRoundProgressBar, isShowLegend, total, free, usageCategory, errorMessage}) => {
  let categoryList = {
    labels: null,
    values: null,
    valuePercentage: null
  };

  const colorPalette = usageCategory.length > 1 ? defaultColorPalette.slice(0, usageCategory.length) : ['#67afdd'];
  // Free space default colour
  colorPalette.push('#dbdbdb');

  ['labels', 'values', 'valuePercentage'].forEach(property => {
    categoryList[property] = usageCategory.reduce((list, category) => {
      Object.entries(category).forEach(([key, value]) => list.push(
        property === 'labels' ?
          key : property === 'values' ?
            value : Number((100 * value / total).toFixed(1))
      ));
      return list;
    }, []);
  });

  const isUnknownSize = total < 0 || total === null || isNaN(total);
  const totalUsage = isUnknownSize ? 0 : categoryList.values.reduce((total, item) => total + item, 0);
  const freeVolume = isUnknownSize ? 0 : free;
  const freePercentage = Number((freeVolume / total * 100).toFixed(1));

  // Add free space info
  if (freeVolume > 0) {
    categoryList.labels.push(i18n.t('common.volumeBar.freePercentage'));
    categoryList.values.push(freeVolume);
    categoryList.valuePercentage.push(freePercentage);
  }

  let chartConfig;

  if (isUnknownSize) {
    chartConfig = {
      datasets: [{
        data: [-1],
        borderColor: [
          'rgba(229, 229, 229, 1)'
        ],
        backgroundColor: [
          'rgba(229, 229, 229, 1)'
        ],
        borderWidth: 1
      }]
    };
  } else {
    chartConfig = {
      datasets: [{
        data: categoryList.valuePercentage,
        borderColor: 'white',
        backgroundColor: colorPalette,
        borderWidth: 2
      }],
      labels: categoryList.labels,
      labelSuffix: '%'
    };
  }

  const chartOptions = {
    animation: {duration: 0},
    maintainAspectRatio: false,
    legend: {display: false},
    cutoutPercentage: 70,
    tooltips: {
      enabled: total > 0,
      mode: 'dataset',
      position: 'nearest',
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.labels[tooltipItem.index];
          if (label) {
            label += ': ';
          }

          label += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] +
          (data.labelSuffix || '');
          return label;
        }
      }
    }
  };

  return (
    isRoundProgressBar ? (
      <div className="doughnut-chart">
        <div className="volume-info d-flex flex-column">
          {
            isUnknownSize ?
              (
                errorMessage
              ) : (
                <>
                  <div>
                    <span>{i18n.t('common.volumeBar.total')}</span>
                    &nbsp;
                    <b className="ml-1">{total && filesize(total)}</b>
                  </div>
                  <div>
                    <span>{i18n.t('common.volumeBar.usedPercentage')}:</span>
                    &nbsp;
                    <b className="mr-1">{filesize(totalUsage)}</b>
                  </div>
                  <div>
                    <span>{i18n.t('common.volumeBar.freePercentage')}:</span>
                    &nbsp;
                    <b className="mr-1">{filesize(freeVolume)}</b>
                  </div>
                </>
              )
          }
        </div>
        <div
          className="m-2 chart-main"
          style={{backgroundImage: `url(${SDCardIcon})`}}
        >
          <Doughnut height={150} data={chartConfig} options={chartOptions}/>
        </div>
        {isShowLegend && (
          <div className="chart-legend">
            {categoryList.labels.map((category, idx) => (
              <div key={category} className="legend-item">
                <div className="legend-color mr-1" style={{backgroundColor: colorPalette[idx]}}/>
                <div className="legend-text">{category}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      <>
        <p>
          {
            isUnknownSize ?
              (
                errorMessage
              ) :
              i18n.t('common.volumeBar.sdStorageStatus', {
                0: filesize(freeVolume),
                1: filesize(total)
              })
          }
        </p>
        <div className="progress">
          {
            categoryList.labels.map((categoryLabel, idx) => {
              return (
                <CustomTooltip key={categoryLabel} title={`${categoryLabel}: ${filesize(categoryList.values[idx])}`}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${categoryList.valuePercentage[idx]}%`,
                      backgroundColor: colorPalette[idx],
                      color: 'var(--gray-dark)'
                    }}
                  >
                    {categoryList.valuePercentage[idx] > percentageToHideText ? `${categoryList.valuePercentage[idx]}%` : ''}
                  </div>
                </CustomTooltip>
              );
            })
          }
        </div>
      </>
    )

  );
};

VolumeDistributionChart.propTypes = {
  isRoundProgressBar: PropTypes.bool,
  isShowLegend: PropTypes.bool,
  total: PropTypes.number.isRequired,
  free: PropTypes.number.isRequired,
  usageCategory: PropTypes.arrayOf(
    PropTypes.shape({category: PropTypes.number}).isRequired
  ).isRequired,
  errorMessage: PropTypes.string
};

VolumeDistributionChart.defaultProps = {
  isRoundProgressBar: false,
  isShowLegend: true,
  errorMessage: ''
};

export default VolumeDistributionChart;
