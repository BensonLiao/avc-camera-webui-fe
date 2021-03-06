import classNames from 'classnames';
import {getRouter} from '@benson.liao/capybara-router';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import NTPTimeZoneList from 'webserver-form-schema/constants/system-sync-time-ntp-timezone-list';
import SyncTimeOption from 'webserver-form-schema/constants/system-sync-time';
import i18n from '../../../i18n';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import utils from '../../../core/utils';
import keywordValidator from '../../validations/events/keyword-validator';
import CustomPopover from '../../../core/components/popover';

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
      validate={keywordValidator}
      onSubmit={onSubmitSearchForm}
    >
      {({errors, touched}) => {
        return (
          <Form className="d-inline-flex">
            <div className="datepicker-wrapper">
              <div className="col-auto px-0 btn-group datepicker-group">
                <Field
                  name="start"
                  component={DateTimePicker}
                  dateTabText={i18n.t('common.dateTimePicker.date')}
                  timeTabText={i18n.t('common.dateTimePicker.time')}
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
                  timeTabText={i18n.t('common.dateTimePicker.time')}
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
            <div className="vertical-border"/>
            <div className="col-auto px-0">
              <Field
                name="keyword"
                style={{paddingRight: '0.75rem'}}
                className={classNames('form-control search-bar-expand', {'is-invalid': errors.keyword && touched.keyword})}
                type="search"
                placeholder={i18n.t('userManagement.events.searchPlaceholder')}
              />
            </div>
            <div className="col-auto px-0 ml-3">
              <button
                className="btn btn-outline-primary rounded-pill px-4"
                type="submit"
                disabled={(errors.keyword && touched.keyword) || isApiProcessing}
              >
                <i className="fas fa-search fa-fw"/>
              </button>
            </div>
            <div className="col-auto d-flex align-items-center">
              <CustomPopover
                title={i18n.t('userManagement.events.popover.title')}
                content={i18n.t('userManagement.events.popover.content')}
                placement="bottom-start"
              >
                <i className="fas fa-question-circle helper-text text-primary"/>
              </CustomPopover>
            </div>
            <div className="form-row">
              <div className="col-auto">
                <ErrorMessage component="div" name="keyword" className="invalid-feedback d-block mt-2"/>
              </div>
            </div>
          </Form>
        );
      }}
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
