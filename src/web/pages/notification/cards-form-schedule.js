import classNames from 'classnames';
import dayjs from 'dayjs';
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
    isShowEndDatePicker: false,
    isShowStartTimePicker: false,
    isShowEndTimePicker: false
  });

  const {isShowStartDatePicker, isShowEndDatePicker, isShowStartTimePicker, isShowEndTimePicker} = state;

  const toggleStartDatePicker = () => setState(prevState => ({
    isShowStartDatePicker: !prevState.isShowStartDatePicker,
    isShowEndDatePicker: false
  }));

  const toggleEndDatePicker = () => setState(prevState => ({
    isShowEndDatePicker: !prevState.isShowEndDatePicker,
    isShowStartDatePicker: false
  }));

  const toggleStartTimePicker = () => setState(prevState => ({
    isShowStartTimePicker: !prevState.isShowStartTimePicker,
    isShowEndTimePicker: false
  }));

  const toggleEndTimePicker = () => setState(prevState => ({
    isShowEndTimePicker: !prevState.isShowEndTimePicker,
    isShowStartTimePicker: false
  }));

  const onHidePicker = type => setState(prevState => ({
    ...prevState,
    [type]: false
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
      <div className="form-group flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('notification.cards.enableSchedule')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableTime" checked={values.isEnableTime} type="checkbox" className="custom-control-input" id="switch-notification-time"/>
            <label className="custom-control-label" htmlFor="switch-notification-time">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <label className="mb-0">{i18n.t('notification.cards.enableSelectedDay')}</label>
          <div className="custom-control custom-switch">
            <Field
              disabled={!values.isEnableTime}
              name="isEnableSchedule"
              checked={values.isEnableSchedule}
              type="checkbox"
              className="custom-control-input"
              id="switch-notification-time-schedule"
            />
            <label className="custom-control-label" htmlFor="switch-notification-time-schedule">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <div className="form-group d-inline-flex schedule-checkbox my-3">
          {
            ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((weekday, index) => {
              return (
                <div key={weekday} className="form-check mr-4">
                  <Field
                    disabled={!(values.isEnableTime && values.isEnableSchedule)}
                    name={`selectedDay.${weekday}`}
                    className="form-check-input"
                    type="checkbox"
                    id={`input-schedule-${weekday}`}
                  />
                  <label className="form-check-label ml-1" htmlFor={`input-schedule-${weekday}`}>
                    {dayjs().day(index).format('dd').replace(/\.$/, '')}
                  </label>
                </div>
              );
            })
          }
        </div>
      </div>
      <div className="form-group datepicker-wrapper">
        <div className="form-row">
          <div className="col-auto my-1 btn-group datepicker-group">
            {values.isEnableSchedule ? (
              <>
                <Field
                  disabled={!values.isEnableTime}
                  name="$start"
                  component={DateTimePicker}
                  timeTabText={i18n.t('common.dateTimePicker.time')}
                  inputProps={{
                    className: classNames(
                      'btn start-date px-4',
                      {active: isShowStartTimePicker}
                    ),
                    placeholder: i18n.t('common.dateTimePicker.startTime'),
                    style: {whiteSpace: 'nowrap'}
                  }}
                  endDateFieldName="$end"
                  isShowPicker={isShowStartTimePicker}
                  onClickInput={toggleStartTimePicker}
                  onHide={() => onHidePicker('isShowStartTimePicker')}
                />
                <Field
                  disabled={!values.isEnableTime}
                  name="$end"
                  component={DateTimePicker}
                  timeTabText={i18n.t('common.dateTimePicker.time')}
                  inputProps={{
                    className: classNames(
                      'btn end-date px-4',
                      {active: isShowEndTimePicker}
                    ),
                    placeholder: i18n.t('common.dateTimePicker.endTime'),
                    style: {whiteSpace: 'nowrap'}
                  }}
                  startDateFieldName="$start"
                  isShowPicker={isShowEndTimePicker}
                  onClickInput={toggleEndTimePicker}
                  onHide={() => onHidePicker('isShowEndTimePicker')}
                />
              </>
            ) : (
              <>
                <Field
                  disabled={!values.isEnableTime}
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
                  onHide={() => onHidePicker('isShowStartDatePicker')}
                />
                <Field
                  disabled={!values.isEnableTime}
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
                  onHide={() => onHidePicker('isShowEndDatePicker')}
                />
              </>
            ) }
          </div>
          {(() => {
            let statusCheck = !values.$start || !values.$end || values.timePeriods.length >= 5;
            return (
              <CustomTooltip
                show={statusCheck}
                title={values.timePeriods.length >= 5 ?
                  i18n.t('notification.cards.tooltip.maxSchedules') :
                  i18n.t('notification.cards.tooltip.enterDatetime')}
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
                    {`${utils.formatDate(timePeriod.start, values.isEnableSchedule && {format: 'LT'})} - ${utils.formatDate(timePeriod.end, values.isEnableSchedule && {format: 'LT'})}`}
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
    isEnableSchedule: PropTypes.bool.isRequired,
    selectedDay: PropTypes.object.isRequired,
    $start: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
    $end: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
    timePeriods: PropTypes.array.isRequired
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default CardsFormSchedule;
