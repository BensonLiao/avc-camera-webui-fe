import classNames from 'classnames';
import dayjs from 'dayjs';
import {Formik, Form, Field} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import DateTimePicker from './fields/datetime-picker';
import i18n from '../../i18n';
import {useContextState} from '../../web/stateProvider';
import utils from '../utils';

const DateSearchForm = ({params, currentRouteName}) => {
  const {isApiProcessing} = useContextState();
  const [state, setState] = useState({
    isShowStartDatePicker: false,
    isShowEndDatePicker: false
  });

  const {isShowStartDatePicker, isShowEndDatePicker} = state;

  const searchFromInitialValues = {
    start: params.start ? utils.subtractTimezoneOffset(new Date(params.start)) : null,
    end: params.end ? utils.subtractTimezoneOffset(new Date(params.end)) : null
  };

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

  /**
   * Handler on user submit the search form.
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  const onSubmitSearchForm = ({start, end}) => {
    // Return start as start of the day, setting seconds, minutes and hours to 0
    const conditionStartDate = () => {
      const conditionedStart = dayjs(start).startOf('day').toDate();
      return utils.addTimezoneOffset(conditionedStart).toJSON();
    };

    // Return end date as end of the day, one second before next day
    const conditionEndDate = () => {
      const conditionEnd = dayjs(end).endOf('day').toDate();
      return utils.addTimezoneOffset(conditionEnd).toJSON();
    };

    getRouter().go({
      name: currentRouteName,
      params: {
        ...params,
        index: undefined,
        start: start && conditionStartDate(),
        end: end && conditionEndDate()
      }
    });
  };

  return (
    <Formik
      initialValues={searchFromInitialValues}
      onSubmit={onSubmitSearchForm}
    >
      <Form>
        <div className="d-inline-flex pr-3">
          <div className="form-row datepicker-wrapper">
            <div className="col-auto px-0 btn-group datepicker-group">
              <Field
                name="start"
                component={DateTimePicker}
                dateTabText={i18n.t('common.dateTimePicker.date')}
                inputProps={{
                  className: classNames('btn start-date px-4', {active: isShowStartDatePicker}),
                  placeholder: i18n.t('common.dateTimePicker.startTime'),
                  style: {
                    whiteSpace: 'nowrap',
                    boxShadow: 'none'
                  }
                }}
                endDateFieldName="end"
                isShowPicker={isShowStartDatePicker}
                onClickInput={toggleStartDatePicker}
                onHide={onHideStartDatePicker}
              />
              <Field
                name="end"
                component={DateTimePicker}
                dateTabText={i18n.t('common.dateTimePicker.date')}
                inputProps={{
                  className: classNames('btn end-date px-4', {active: isShowEndDatePicker}),
                  placeholder: i18n.t('common.dateTimePicker.endTime'),
                  style: {
                    whiteSpace: 'nowrap',
                    boxShadow: 'none'
                  }
                }}
                startDateFieldName="start"
                isShowPicker={isShowEndDatePicker}
                onClickInput={toggleEndDatePicker}
                onHide={onHideEndDatePicker}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-auto px-0 ml-3">
              <button
                disabled={isApiProcessing}
                className="btn btn-outline-primary rounded-pill px-3"
                type="submit"
              >
                <i className="fas fa-search fa-fw mx-2"/>
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

DateSearchForm.propTypes = {
  params: PropTypes.shape({
    interval: PropTypes.any,
    start: PropTypes.string,
    end: PropTypes.string
  }).isRequired,
  currentRouteName: PropTypes.string.isRequired
};

export default DateSearchForm;
