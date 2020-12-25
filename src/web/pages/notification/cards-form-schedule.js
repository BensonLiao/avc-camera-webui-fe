import classNames from 'classnames';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import i18n from '../../../i18n';
import CustomTooltip from '../../../core/components/tooltip';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import utils from '../../../core/utils';

const CardsFormSchedule = ({values, setFieldValue}) => {
  const [state, setState] = useState({
    isShowStartDatePicker: false,
    isShowEndDatePicker: false
  });

  const {isShowStartDatePicker, isShowEndDatePicker} = state;

  const toggleStartDatePicker = () => setState(prevState => ({
    isShowStartDatePicker: !prevState.isShowStartDatePicker,
    isShowEndDatePicker: false
  }));

  const toggleEndDatePicker = () => setState(prevState => ({
    isShowEndDatePicker: !prevState.isShowEndDatePicker,
    isShowStartDatePicker: false
  }));

  const onHideStartDatePicker = () => setState(prevState => ({
    ...prevState,
    isShowStartDatePicker: false
  }));

  const onHideEndDatePicker = () => setState(prevState => ({
    ...prevState,
    isShowEndDatePicker: false
  }));

  const onClickAddTimePeriod = () => {
    const timePeriods = [...values.timePeriods];
    timePeriods.push({
      id: Math.random().toString(36).substr(2),
      start: values.$start,
      end: values.$end,
      isRepeat: false
    });
    setFieldValue('timePeriods', timePeriods);
    setFieldValue('$start', null);
    setFieldValue('$end', null);
  };

  const generateDeleteTimePeriodHandler = index => event => {
    event.preventDefault();
    const timePeriods = [...values.timePeriods];
    timePeriods.splice(index, 1);
    setFieldValue('timePeriods', timePeriods);
  };

  return (
    <>
      {/* face-recognition */}
      <div className="form-group d-flex justify-content-between align-items-center">
        <label className="mb-0">{i18n.t('notification.cards.enableSchedule')}</label>
        <div className="custom-control custom-switch">
          <Field name="isEnableTime" checked={values.isEnableTime} type="checkbox" className="custom-control-input" id="switch-notification-time"/>
          <label className="custom-control-label" htmlFor="switch-notification-time">
            <span>{i18n.t('common.button.on')}</span>
            <span>{i18n.t('common.button.off')}</span>
          </label>
        </div>
      </div>
      <div className="form-group pl-4 datepicker-wrapper">
        <div className="form-row">
          <div className="col-auto my-1 btn-group datepicker-group">
            <Field
              name="$start"
              component={DateTimePicker}
              dateTabText={i18n.t('common.dateTimePicker.date')}
              timeTabText={i18n.t('common.dateTimePicker.time')}
              inputProps={{
                className: classNames(
                  'btn start-date px-4',
                  {active: isShowStartDatePicker}
                ),
                placeholder: i18n.t('common.dateTimePicker.startTime'),
                style: {whiteSpace: 'nowrap'}
              }}
              endDateFieldName="$end"
              isShowPicker={isShowStartDatePicker}
              onClickInput={toggleStartDatePicker}
              onHide={onHideStartDatePicker}
            />
            <Field
              name="$end"
              component={DateTimePicker}
              dateTabText={i18n.t('common.dateTimePicker.date')}
              timeTabText={i18n.t('common.dateTimePicker.time')}
              inputProps={{
                className: classNames(
                  'btn end-date px-4',
                  {active: isShowEndDatePicker}
                ),
                placeholder: i18n.t('common.dateTimePicker.endTime'),
                style: {whiteSpace: 'nowrap'}
              }}
              startDateFieldName="$start"
              isShowPicker={isShowEndDatePicker}
              onClickInput={toggleEndDatePicker}
              onHide={onHideEndDatePicker}
            />
          </div>
          {(() => {
            let statusCheck = !values.$start || !values.$end || values.timePeriods.length >= 5;
            return (
              <CustomTooltip
                show={statusCheck}
                title={i18n.t(values.timePeriods.length >= 5 ?
                  'notification.cards.tooltip.maxSchedules' :
                  'notification.cards.tooltip.enterDatetime')}
              >
                <div className="col-auto my-1">
                  <button
                    disabled={statusCheck}
                    className="btn btn-primary rounded-circle"
                    type="button"
                    style={statusCheck ? {pointerEvents: 'none'} : {}}
                    onClick={onClickAddTimePeriod}
                  >
                    <i className="fas fa-plus"/>
                  </button>
                </div>
              </CustomTooltip>
            );
          })()}
        </div>
        {
          values.timePeriods.map((timePeriod, index) => (
            <div key={timePeriod.id} className="form-row my-3">
              <div className="col-12">
                <div className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item">
                  <div>
                    {`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}
                  </div>
                  <a href="#" onClick={generateDeleteTimePeriodHandler(index)}><i className="fas fa-times-circle fa-lg"/></a>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

CardsFormSchedule.propTypes = {
  values: PropTypes.shape({
    isEnableTime: PropTypes.bool.isRequired,
    $start: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
    $end: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
    timePeriods: PropTypes.array.isRequired
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default CardsFormSchedule;
