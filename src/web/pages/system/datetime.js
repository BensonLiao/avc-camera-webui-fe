const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const dayjs = require('dayjs');
const progress = require('nprogress');
const Clock = require('react-live-clock');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const NTPTimeOption = require('webserver-form-schema/constants/system-sync-time-ntp-option');
const NTPTimeRateOption = require('webserver-form-schema/constants/system-sync-time-ntp-rate');
const {AVAILABLE_LANGUAGE_CODES, TIMEZONE_LIST} = require('../../../core/constants');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const SelectField = require('../../../core/components/fields/select-field');
const CustomTooltip = require('../../../core/components/tooltip');
const utils = require('../../../core/utils');

module.exports = class DateTime extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({languageCode: PropTypes.oneOf(AVAILABLE_LANGUAGE_CODES).isRequired}).isRequired,
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
  }

  constructor(props) {
    super(props);
    this.state.showDateTimePicker = {
      ntpUpdateTime: false,
      manualTime: false
    };
    this.state.isShowModal = false;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Updating Date & Time');
    this.isNoNTPTooltip = i18n.t('Please Enable Sync with Network Time Server (NTP)');
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  toggleDateTimePicker = name => event => {
    event.preventDefault();
    return this.setState(prevState => ({
      showDateTimePicker: {
        ...prevState.showDateTimePicker,
        [name]: !prevState.showDateTimePicker[name]
      }
    }));
  }

  onHideDateTimePicker = name => _ => {
    return this.setState({showDateTimePicker: {[name]: false}});
  }

  onSubmit = values => {
    const formValues = {...values};
    const {systemInformation: {languageCode}} = this.props;
    const isLanguageUpdate = languageCode !== formValues.language;
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      isShowModal: false
    }, () => {
      if (formValues.syncTimeOption === SyncTimeOption.local) {
        formValues.manualTime = new Date();
        formValues.ntpTimeZone = dayjs.tz.guess();
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
            this.hideApiProcessModal();
          })
          .finally(progress.done);
      }
    });
  };

  formRender = ({values}) => {
    const {$isApiProcessing, showDateTimePicker, isShowModal} = this.state;
    const isNotNTP = values.syncTimeOption !== SyncTimeOption.ntp;
    return (
      <Form>
        {/* Remove language in AVN version */}
        <SelectField hide labelName={i18n.t('Language')} name="language">
          <option value={window.navigator.userLanguage || window.navigator.language}>{i18n.t('Default')}</option>
          <option value={AVAILABLE_LANGUAGE_CODES[0]}>{i18n.t('English')}</option>
          <option value={AVAILABLE_LANGUAGE_CODES[1]}>{i18n.t('Traditional Chinese')}</option>
        </SelectField>
        <CustomTooltip
          show={values.syncTimeOption === SyncTimeOption.local}
          title={i18n.t('Time Zone Disabled when Sync with Computer')}
          placement="bottom-end"
        >
          <div
            className={classNames({'cursor-disabled': values.syncTimeOption === SyncTimeOption.local}, {'cursor-pointer': values.syncTimeOption !== SyncTimeOption.local})}
          >
            <SelectField
              labelName={i18n.t('Time Zone')}
              readOnly={values.syncTimeOption === SyncTimeOption.local}
              name="ntpTimeZone"
            >
              {TIMEZONE_LIST.map(zone => {
                return (
                  <option key={zone.name} value={zone.name}>{zone.label}</option>
                );
              })}
            </SelectField>
          </div>
        </CustomTooltip>
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
                  <div className="text-size-14 text-nowrap mr-3">{`${i18n.t('Host Name and IP Address')} :`}</div>
                  <CustomTooltip show={isNotNTP} title={this.isNoNTPTooltip}>
                    <Field
                      disabled={isNotNTP}
                      className="form-control flex-grow-1"
                      type="text"
                      name="ntpIP"
                      placeholder={i18n.t('Enter Your IP Address')}
                    />
                  </CustomTooltip>
                </div>
                <hr className="my-4"/>
                <div className="d-flex align-items-center mb-3">
                  <div className="form-check">
                    <Field
                      disabled={isNotNTP}
                      name="ntpTimeOption"
                      className={classNames('form-check-input', {'cursor-disabled': isNotNTP})}
                      type="radio"
                      id={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                      value={NTPTimeOption.updateTime}
                    />
                    <label
                      className={classNames('form-check-label', {'cursor-disabled': isNotNTP})}
                      htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                    >
                      {`${i18n.t('Update Time')} :`}
                    </label>
                  </div>
                  <CustomTooltip show={isNotNTP} title={this.isNoNTPTooltip}>
                    <div className="form-row datepicker-wrapper">
                      <Field
                        disabled={isNotNTP}
                        name="ntpUpdateTime"
                        component={DateTimePicker}
                        timeTabText={i18n.t('Update Time')}
                        inputProps={{
                          className: classNames(
                            'btn border date px-4 btn-date-time',
                            {active: showDateTimePicker.ntpUpdateTime && values.syncTimeOption === SyncTimeOption.ntp},
                            {'cursor-disabled': isNotNTP}
                          ),
                          placeholder: i18n.t('Update Time'),
                          style: {
                            whiteSpace: 'nowrap',
                            backgroundColor: values.syncTimeOption === SyncTimeOption.ntp ? '#fff' : '#e9ecef'
                          }
                        }}
                        isShowPicker={showDateTimePicker.ntpUpdateTime && values.syncTimeOption === SyncTimeOption.ntp}
                        onClickInput={values.syncTimeOption === SyncTimeOption.ntp ? this.toggleDateTimePicker('ntpUpdateTime') : () => {}}
                        onHide={this.onHideDateTimePicker('ntpUpdateTime')}
                      />
                    </div>
                  </CustomTooltip>
                </div>

                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <Field
                      disabled={isNotNTP}
                      name="ntpTimeOption"
                      className={classNames('form-check-input', {'cursor-disabled': isNotNTP})}
                      type="radio"
                      id={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                      value={NTPTimeOption.updateTimeRate}
                    />
                    <label
                      className={classNames('form-check-label mr-3', {'cursor-disabled': isNotNTP})}
                      htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                    >
                      {`${i18n.t('Update Frequency (Minutes)')} :`}
                    </label>
                  </div>
                  <CustomTooltip show={isNotNTP} title={this.isNoNTPTooltip}>
                    <div className={classNames('select-wrapper rounded-pill overflow-hidden', {'cursor-disabled': isNotNTP})}>
                      <SelectField
                        labelName=""
                        readOnly={isNotNTP}
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
                  </CustomTooltip>
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
              {i18n.t('Sync with Computer')}
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
                {`${i18n.t('Set Date/Time Manually')} :`}
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
                onClickInput={this.toggleDateTimePicker('manualTime')}
                onHide={this.onHideDateTimePicker('manualTime')}
              />
            </div>
          </div>
        </div>
        <button
          className="btn btn-block btn-primary rounded-pill"
          type="button"
          onClick={this.showModal}
        >
          {i18n.t('Apply')}
        </button>
        <CustomNotifyModal
          isShowModal={isShowModal}
          modalTitle={i18n.t('Date & Time')}
          modalBody={i18n.t('Update date & time need to log in again. Are you sure you want to continue?')}
          isConfirmDisable={$isApiProcessing}
          onHide={this.hideModal}
          onConfirm={() => {
            this.onSubmit(values);
          }}
        />
      </Form>
    );
  };

  render() {
    const {systemDateTime, systemDateTime: {ntpUpdateTime, ntpTimeZone, deviceTime}, systemInformation: {languageCode}} = this.props;
    return (
      <div className="main-content left-menu-active">
        <div className="page-system">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                path={[i18n.t('System'), i18n.t('Settings'), i18n.t('Date & Time')]}
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
                      onSubmit={this.onSubmit}
                    >
                      {this.formRender}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CustomNotifyModal
            modalType="process"
            backdrop="static"
            isShowModal={this.state.isShowApiProcessModal}
            modalTitle={this.state.apiProcessModalTitle}
            onHide={this.hideApiProcessModal}
          />
        </div>
      </div>
    );
  }
};
