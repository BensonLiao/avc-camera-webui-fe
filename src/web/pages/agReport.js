import classNames from 'classnames';
import download from 'downloadjs';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import TimeInterval from 'webserver-form-schema/constants/human-detection-report-time-interval';
import DateSearchForm from '../../core/components/date-search-form';
import i18n from '../../i18n';
import i18nUtils from '../../i18n/utils';
import Pagination from '../../core/components/pagination';
import {withApiWrapper} from '../../core/apis';
import {useContextState} from '../stateProvider';
import withGlobalStatus from '../withGlobalStatus';

const MAX_AGE_RANGE = 60;

const AgReport = withGlobalStatus(({report: {index, size, total, items, ageInterval}, params}) => {
  const {isApiProcessing} = useContextState();
  params.interval = (params.interval || params.interval === 0) ?
    typeof params.interval === 'string' ?
      Number(params.interval) : params.interval :
    TimeInterval.thirtyMinutes;
  const currentRoute = getRouter().findRouteByName('isolatedLayout.agReport');
  const hrefTemplate = currentRoute.generateUri(
    {
      ...params,
      index: undefined
    }
  );

  const filterHandler = interval => event => {
    event.preventDefault();
    let newParams = interval === undefined ? {} : {
      ...params,
      index: undefined,
      interval
    };
    return getRouter().go({
      name: currentRoute.name,
      params: newParams
    });
  };

  const downloadReport = () => {
    progress.start();
    withApiWrapper()({
      method: 'get',
      url: '/api/age-gender-detection/report.csv',
      params: {
        start: params.start,
        end: params.end,
        interval: params.interval
      },
      responseType: 'blob'
    })
      .then(response => {
        download(response.data, 'report.csv');
      })
      .finally(progress.done);
  };

  const ageIntervalArray = Array.from({length: (MAX_AGE_RANGE / ageInterval) + 1}, (_, idx) => {
    if (((MAX_AGE_RANGE / ageInterval) / idx) === 1) {
      return '60+';
    }

    return `${idx * ageInterval}-${((idx + 1) * ageInterval) - 1}`;
  });

  return (
    <div className="col-12 px-8x py-4 ag-report">
      <div className="d-inline-flex justify-content-between w-100 mb-32px">
        <div className="d-inline-flex align-items-center">
          <DateSearchForm
            params={params}
            currentRouteName={currentRoute.name}
          />
          <div className="vertical-border"/>
          <div className="dropdown ml-2">
            <button
              className="btn border-primary text-primary rounded-pill dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              disabled={isApiProcessing}
            >
              <i className="fas fa-clock"/>
              {i18n.t('analytics.report.interval')}
              &nbsp;
              {i18nUtils.getReportIntervalI18N(params.interval)}
            </button>
            <div className="dropdown-menu dropdown-menu-left shadow">
              <a
                href=""
                className="dropdown-item"
                onClick={filterHandler(TimeInterval.fifteenMinutes)}
              >
                {i18n.t('analytics.report.duration15Mins')}
              </a>
              <a
                href=""
                className="dropdown-item"
                onClick={filterHandler(TimeInterval.thirtyMinutes)}
              >
                {i18n.t('analytics.report.duration30Mins')}
              </a>
              <a
                href=""
                className="dropdown-item"
                onClick={filterHandler(TimeInterval.oneHour)}
              >
                {i18n.t('analytics.report.duration1Hour')}
              </a>
            </div>
          </div>
          {(params.start || params.end) && (
            <a
              href=""
              className="ml-3 d-flex align-items-end"
              onClick={filterHandler()}
            >
              {i18n.t('analytics.report.clearFilter')}
            </a>
          )}
        </div>
        <div className="d-inline-flex">
          <div className="ml-3">
            <button
              className="btn btn-outline-primary rounded-pill"
              type="button"
              disabled={isApiProcessing}
              onClick={downloadReport}
            >
              <i className="fas fa-download mr-2"/>
              {i18n.t('common.button.downloadReport')}
            </button>
          </div>
        </div>
      </div>
      <div className="ag-report-table">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="text-center"
                >
                  {i18n.t('analytics.report.date')}
                </th>
                <th rowSpan="3">{i18n.t('analytics.report.interval')}</th>
                <th
                  rowSpan="1"
                  className="text-center border-left"
                  colSpan={((MAX_AGE_RANGE / ageInterval) + 1) * 2}
                >
                  {i18n.t('analytics.report.ageInterval')}
                </th>
              </tr>
              <tr>
                {ageIntervalArray.map(x => (
                  <th
                    key={x}
                    className="text-center border"
                    rowSpan="1"
                    colSpan="2"
                  >
                    {x}
                  </th>
                ))}
              </tr>
              <tr>
                {ageIntervalArray.map(ageInterval => (
                  [1, 0].map(gender => (
                    <th
                      key={ageInterval + gender}
                      className="border"
                      colSpan="1"
                    >
                      {gender ? 'male' : 'female'}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.date + item.timeInterval}>
                  <td>{item.date}</td>
                  <td className="border-right">{item.timeInterval}</td>
                  {item.age.map(genderCount => (
                    ['male', 'female'].map((x, idx) => (
                      <td
                        key={item.timeInterval + x}
                        className={classNames('text-center', {'border-right': idx})}
                      >
                        {genderCount[x]}
                      </td>
                    ))
                  ))}
                </tr>
              ))}
              {
                /* Empty Message */
                !items.length && (
                  <tr className="disable-highlight">
                    <td className="text-size-20 text-center border-0" colSpan="16">
                      <i className="fas fa-frown-open fa-fw text-dark"/> {i18n.t('userManagement.members.noData')}
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
        <Pagination
          index={index}
          size={size}
          total={total}
          currentPageItemQuantity={items.length}
          hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index=` : `${hrefTemplate}?index=`}
        />
      </div>
    </div>
  );
});

AgReport.propTypes = {
  params: PropTypes.any,
  report: PropTypes.shape({
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    ageInterval: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      timeInterval: PropTypes.string.isRequired,
      age: PropTypes.arrayOf(PropTypes.shape({
        male: PropTypes.number.isRequired,
        female: PropTypes.number.isRequired
      })).isRequired
    })).isRequired
  })
};

export default AgReport;
