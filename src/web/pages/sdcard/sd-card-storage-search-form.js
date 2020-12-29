
import classNames from 'classnames';
import dayjs from 'dayjs';
import {Formik, Form, Field} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const SDCardStorageSearchForm = ({generatePaginatedCheckList, updateSearchResult}) => {
  const {isApiProcessing} = useContextState();
  const [state, setState] = useState({isShowStartDatePicker: false});

  const {isShowStartDatePicker} = state;

  const formInitialValues = {date: new Date()};

  const toggleStartDatePicker = () => setState(prevState => ({isShowStartDatePicker: !prevState.isShowStartDatePicker}));

  const onHideStartDatePicker = () => setState(prevState => ({
    ...prevState,
    isShowStartDatePicker: false
  }));

  /**
   * Handler on user submit the search form.
   * @param {String} date
   * @returns {void}
   */
  const onSubmitSearchForm = ({date}) => {
    api.system.getSDCardStorageFiles(dayjs(date).format('YYYY-MM-DD'))
      .then(response => {
        updateSearchResult(generatePaginatedCheckList(response.data));
      });
  };

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={onSubmitSearchForm}
    >
      <Form>
        <div className="d-inline-flex">
          <div className="form-row datepicker-wrapper">
            <Field
              name="date"
              component={DateTimePicker}
              dateTabText={i18n.t('common.dateTimePicker.date')}
              dateFormat="YYYY-MM-DD"
              inputProps={{
                className: classNames('btn border date px-4 btn-date-time', {active: isShowStartDatePicker}),
                placeholder: i18n.t('common.dateTimePicker.startTime'),
                style: {whiteSpace: 'nowrap'}
              }}
              isShowPicker={isShowStartDatePicker}
              onClickInput={toggleStartDatePicker}
              onHide={onHideStartDatePicker}
            />
          </div>
          <div className="form-row">
            <div className="col-auto px-0 ml-3">
              <button className="btn btn-outline-primary rounded-pill px-3" type="submit" disabled={isApiProcessing}>
                <i className="fas fa-search fa-fw"/> {i18n.t('userManagement.events.search')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

SDCardStorageSearchForm.propTypes = {
  generatePaginatedCheckList: PropTypes.func.isRequired,
  updateSearchResult: PropTypes.func.isRequired
};

export default withGlobalStatus(SDCardStorageSearchForm);
