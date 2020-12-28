
import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import i18n from '../../../i18n';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import utils from '../../../core/utils';

const SDCardStorageSearchForm = ({params, isApiProcessing}) => {
  const [state, setState] = useState({isShowStartDatePicker: false});

  const {isShowStartDatePicker} = state;

  const searchFromInitialValues = {start: params.start ? utils.subtractTimezoneOffset(new Date(params.start)) : null};

  const toggleStartDatePicker = () => setState(prevState => ({isShowStartDatePicker: !prevState.isShowStartDatePicker}));

  const onHideStartDatePicker = () => setState(prevState => ({
    ...prevState,
    isShowStartDatePicker: false
  }));

  /**
   * Handler on user submit the search form.
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  const onSubmitSearchForm = ({start}) => {
    console.log('start', start);
  };

  return (
    <Formik
      initialValues={searchFromInitialValues}
      onSubmit={onSubmitSearchForm}
    >
      <Form>
        <div className="d-inline-flex">
          <div className="form-row datepicker-wrapper">
            <Field
              name="start"
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
  params: PropTypes.shape({start: PropTypes.any}).isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default SDCardStorageSearchForm;
