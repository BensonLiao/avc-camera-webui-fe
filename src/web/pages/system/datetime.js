import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dayjs from 'dayjs';
import progress from 'nprogress';
import Clock from 'react-live-clock';
import {Formik, Form, Field} from 'formik';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import SyncTimeOption from 'webserver-form-schema/constants/system-sync-time';
import NTPTimeOption from 'webserver-form-schema/constants/system-sync-time-ntp-option';
import NTPTimeRateOption from 'webserver-form-schema/constants/system-sync-time-ntp-rate';
import {TIMEZONE_LIST} from '../../../core/constants';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import SelectField from '../../../core/components/fields/select-field';
import utils from '../../../core/utils';
import {useContextState} from '../../stateProvider';
import withGlobalStatus from '../../withGlobalStatus';

const DateTime = ({systemDateTime, systemDateTime: {syncTimeOption, ntpUpdateTime, ntpTimeZone, deviceTime}, systemInformation: {languageCode}}) => {
  const {isApiProcessing} = useContextState();
  const [state, setState] = useState({
    showDateTimePicker: {
      ntpUpdateTime: false,
      manualTime: false
    },
    isShowModal: false,
    isShowApiProcessModal: false,
    apiProcessModalTitle: i18n.t('Updating Date & Time')
  });

  const {showDateTimePicker, isShowModal, isShowApiProcessModal, apiProcessModalTitle} = state;

  const hideApiProcessModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: false
    }));
  };

  const showModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowModal: true
    }));
  };

  const hideModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowModal: false
    }));
  };

  const toggleDateTimePicker = name => event => {
    event.preventDefault();
    return setState(prevState => ({
      ...prevState,
      showDateTimePicker: {
        ...prevState.showDateTimePicker,
        [name]: !prevState.showDateTimePicker[name]
      }
    }));
  };

  const onHideDateTimePicker = name => _ => {
    return setState(prevState => ({
      ...prevState,
      showDateTimePicker: {[name]: false}
    }));
  };

  const onSubmit = values => {
    const formValues = {...values};
    const isLanguageUpdate = languageCode !== formValues.language;
    progress.start();
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: true,
      isShowModal: false
    }));
    if (formValues.syncTimeOption === SyncTimeOption.local) {
      formValues.manualTime = new Date();
      // Auto fill timezone when switching to `sync with your computer` for the first time
      if (formValues.syncTimeOption !== syncTimeOption) {
        formValues.ntpTimeZone = dayjs.tz.guess();
      }
    }

    if (isLanguageUpdate) {
      api.system.updateLanguage(formValues.language)
        .then(() => {
          location.reload();
        })
        .finally(progress.done);
    } else {
      formValues.manualTime.setSeconds(0);
      formValues.manualTime = utils.addTimezoneOffset(formValues.manualTime).getTime();
      formValues.ntpUpdateTime = utils.addTimezoneOffset(formValues.ntpUpdateTime).getTime();
      api.system.updateSystemDateTime(formValues)
        .then(() => {
          location.href = '/login';
        })
        .catch(() => {
          hideApiProcessModal();
        })
        .finally(progress.done);
    }
  };

  return (
    <div className="main-content left-menu-active">
      <div className="page-system">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              path={[i18n.t('System'), i18n.t('Administration'), i18n.t('Date & Time')]}
              routes={['/system/datetime', '/system/datetime']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('Date & Time')}</div>
                <div className="card-body">
                  <div className="card form-group">
                    <div className="card-body">
                      <div className="form-group d-flex justify-content-between align-items-center mb-0">
                        <label className="mb-0">{i18n.t('Date and Time of the Device')}</label>
                        <label className="text-primary mb-0">
                          <Clock ticking date={deviceTime} timezone={ntpTimeZone} format="YYYY-MM-DD, hh:mm:ss A Z"/>
                        </label>
                      </div>
                    </div>
                  </div>
                  <Formik
                    initialValues={{
                      ...systemDateTime,
                      ntpUpdateTime: utils.subtractTimezoneOffset(ntpUpdateTime).getTime(),
                      manualTime: systemDateTime.manualTime ?
                        new Date(systemDateTime.manualTime) : new Date(),
                      language: languageCode
                    }}
                    onSubmit={onSubmit}
                  >
                    {({values}) => {
                      return (
                        <Form>
                          {/* Remove language in AVN version */}
                          <SelectField hide labelName={i18n.t('Language')} name="language">
                            <option value={window.navigator.userLanguage || window.navigator.language}>{i18n.t('Default')}</option>
                            <option value={i18n.options.supportedLangCodes[0]}>{i18n.t('English')}</option>
                            <option value={i18n.options.supportedLangCodes[1]}>{i18n.t('Traditional Chinese')}</option>
                          </SelectField>
                          <div
                            className="cursor-pointer"
                          >
                            <SelectField
                              labelName={i18n.t('Time Zone')}
                              name="ntpTimeZone"
                            >
                              {TIMEZONE_LIST.map(zone => {
                                return (
                                  <option key={zone.name} value={zone.name}>{zone.label}</option>
                                );
                              })}
                            </SelectField>
                          </div>
                          <div className="form-group mb-5">
                            <div className="form-check mb-4">
                              <Field
                                name="syncTimeOption"
                                className="form-check-input"
                                type="radio"
                                id={`system-date-sync-option-${SyncTimeOption.ntp}`}
                                value={SyncTimeOption.ntp}
                              />
                              <label
                                className="form-check-label text-size-16"
                                htmlFor={`system-date-sync-option-${SyncTimeOption.ntp}`}
                              >
                                {i18n.t('Sync with Network Time Server (NTP)')}
                              </label>
                            </div>
                            <div className="card mb-4">
                              <div className="card-body">
                                <div>
                                  <div className="d-flex form-group align-items-center">
                                    <div className="text-size-14 text-nowrap mr-3">{`${i18n.t('Host Name or IP Address')} :`}</div>
                                    <Field
                                      className="form-control flex-grow-1"
                                      type="text"
                                      name="ntpIP"
                                      placeholder={i18n.t('Enter Your IP Address')}
                                    />
                                  </div>
                                  <hr className="my-4"/>
                                  <div className="d-flex align-items-center mb-3">
                                    <div className="form-check">
                                      <Field
                                        name="ntpTimeOption"
                                        className={classNames('form-check-input')}
                                        type="radio"
                                        id={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                                        value={NTPTimeOption.updateTime}
                                      />
                                      <label
                                        className={classNames('form-check-label')}
                                        htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                                      >
                                        {`${i18n.t('Sync Time')} :`}
                                      </label>
                                    </div>
                                    <div className="form-row datepicker-wrapper">
                                      <Field
                                        name="ntpUpdateTime"
                                        component={DateTimePicker}
                                        timeTabText={i18n.t('Sync Time')}
                                        inputProps={{
                                          className: classNames(
                                            'btn border date px-4 btn-date-time',
                                            {active: showDateTimePicker.ntpUpdateTime}
                                          ),
                                          placeholder: i18n.t('Sync Time'),
                                          style: {whiteSpace: 'nowrap'}
                                        }}
                                        isShowPicker={showDateTimePicker.ntpUpdateTime}
                                        onClickInput={toggleDateTimePicker('ntpUpdateTime')}
                                        onHide={onHideDateTimePicker('ntpUpdateTime')}
                                      />
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <div className="form-check">
                                      <Field
                                        name="ntpTimeOption"
                                        className={classNames('form-check-input')}
                                        type="radio"
                                        id={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                                        value={NTPTimeOption.updateTimeRate}
                                      />
                                      <label
                                        className={classNames('form-check-label mr-3')}
                                        htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                                      >
                                        {`${i18n.t('Sync Interval (minutes)')} :`}
                                      </label>
                                    </div>
                                    <div className={classNames('select-wrapper rounded-pill overflow-hidden')}>
                                      <SelectField
                                        labelName=""
                                        name="ntpUpdateTimeRate"
                                        className={classNames('form-control')}
                                      >
                                        {NTPTimeRateOption.all().map(v => {
                                          return (
                                            <option key={v} value={v}>{v}</option>
                                          );
                                        })}
                                      </SelectField>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-check mb-4">
                              <Field
                                name="syncTimeOption"
                                className="form-check-input"
                                type="radio"
                                id={`system-date-sync-option-${SyncTimeOption.local}`}
                                value={SyncTimeOption.local}
                              />
                              <label
                                className="form-check-label text-size-16"
                                htmlFor={`system-date-sync-option-${SyncTimeOption.local}`}
                              >
                                {i18n.t('Sync with Your Computer')}
                              </label>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="form-check">
                                <Field
                                  name="syncTimeOption"
                                  className="form-check-input"
                                  type="radio"
                                  id={`system-date-sync-option-${SyncTimeOption.manual}`}
                                  value={SyncTimeOption.manual}
                                />
                                <label
                                  className="form-check-label text-size-16"
                                  htmlFor={`system-date-sync-option-${SyncTimeOption.manual}`}
                                >
                                  {`${i18n.t('Set the Date & Time Manually')} :`}
                                </label>
                              </div>
                              <div className="form-row datepicker-wrapper">
                                <Field
                                  name="manualTime"
                                  component={DateTimePicker}
                                  dateTabText={i18n.t('Manual Date')}
                                  timeTabText={i18n.t('Manual Time')}
                                  inputProps={{
                                    className: classNames(
                                      'btn date px-4',
                                      {active: showDateTimePicker.manualTime && values.syncTimeOption === SyncTimeOption.manual}
                                    ),
                                    placeholder: i18n.t('Manual DateTime'),
                                    style: {whiteSpace: 'nowrap'}
                                  }}
                                  isShowPicker={showDateTimePicker.manualTime}
                                  onClickInput={toggleDateTimePicker('manualTime')}
                                  onHide={onHideDateTimePicker('manualTime')}
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-block btn-primary rounded-pill"
                            type="button"
                            onClick={showModal}
                          >
                            {i18n.t('Apply')}
                          </button>
                          <CustomNotifyModal
                            isShowModal={isShowModal}
                            modalTitle={i18n.t('Date & Time')}
                            modalBody={i18n.t('Updating date and time requires you to log in again. Are you sure you want to continue?')}
                            isConfirmDisable={isApiProcessing}
                            onHide={hideModal}
                            onConfirm={() => {
                              onSubmit(values);
                            }}
                          />
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CustomNotifyModal
          modalType="process"
          backdrop="static"
          isShowModal={isShowApiProcessModal}
          modalTitle={apiProcessModalTitle}
          onHide={hideApiProcessModal}
        />
      </div>
    </div>
  );
};

DateTime.propTypes = {
  systemInformation: PropTypes.shape({languageCode: PropTypes.oneOf(i18n.options.supportedLangCodes).isRequired}).isRequired,
  systemDateTime: PropTypes.shape({
    deviceTime: PropTypes.number.isRequired,
    syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired,
    ntpTimeZone: PropTypes.oneOf(TIMEZONE_LIST.map(zone => zone.name)).isRequired,
    ntpIP: PropTypes.string.isRequired,
    ntpTimeOption: PropTypes.oneOf(NTPTimeOption.all()).isRequired,
    ntpUpdateTime: PropTypes.number.isRequired,
    ntpUpdateTimeRate: PropTypes.oneOf(NTPTimeRateOption.all()).isRequired,
    manualTime: PropTypes.number
  }).isRequired
};

export default withGlobalStatus(DateTime);
