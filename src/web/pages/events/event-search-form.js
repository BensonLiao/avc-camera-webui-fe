import classNames from 'classnames';
import {getRouter} from '@benson.liao/capybara-router';
import {Formik, Form, Field} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import NTPTimeZoneList from 'webserver-form-schema/constants/system-sync-time-ntp-timezone-list';
import SyncTimeOption from 'webserver-form-schema/constants/system-sync-time';
import i18n from '../../../i18n';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import utils from '../../../core/utils';

const EventsSearchForm = ({params, isApiProcessing, currentRouteName}) => {
  const [state, setState] = useState({
    isShowStartDatePicker: false,
    isShowEndDatePicker: false
  });

  const {isShowStartDatePicker, isShowEndDatePicker} = state;

  const searchFromInitialValues = {
    keyword: params.keyword || '',
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
   * @param {String} keyword
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  const onSubmitSearchForm = ({keyword, start, end}) => {
    getRouter().go({
      name: currentRouteName,
      params: {
        ...params,
        index: undefined,
        keyword,
        start: start ? utils.addTimezoneOffset(start).toJSON() : undefined,
        end: end ? utils.addTimezoneOffset(end).toJSON() : undefined
      }
    });
  };

  return (
    <Formik
      initialValues={searchFromInitialValues}
      onSubmit={onSubmitSearchForm}
    >
      <Form>
        <div className="form-row datepicker-wrapper">
          <div className="col-auto px-0 btn-group datepicker-group">
            <Field
              name="start"
              component={DateTimePicker}
              dateTabText={i18n.t('Start Date')}
              timeTabText={i18n.t('Start Time')}
              inputProps={{
                className: classNames('btn start-date px-4', {active: isShowStartDatePicker}),
                placeholder: i18n.t('Start Datetime'),
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
              dateTabText={i18n.t('End Date')}
              timeTabText={i18n.t('End Time')}
              inputProps={{
                className: classNames('btn end-date px-4', {active: isShowEndDatePicker}),
                placeholder: i18n.t('End Datetime'),
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
        <div className="form-row mt-4">
          <div className="col-auto px-0">
            <Field name="keyword" className="form-control" type="search" placeholder={i18n.t('Enter Keywords')}/>
          </div>
          <div className="col-auto px-0 ml-3">
            <button className="btn btn-outline-primary rounded-pill px-3" type="submit" disabled={isApiProcessing}>
              <i className="fas fa-search fa-fw"/> {i18n.t('Search')}
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

EventsSearchForm.propTypes = {
  params: PropTypes.shape({
    keyword: PropTypes.string,
    start: PropTypes.any,
    end: PropTypes.any
  }).isRequired,
  systemDateTime: PropTypes.shape({
    ntpTimeZone: PropTypes.oneOf(NTPTimeZoneList.all()).isRequired,
    syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired
  }).isRequired,
  currentRouteName: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default EventsSearchForm;
