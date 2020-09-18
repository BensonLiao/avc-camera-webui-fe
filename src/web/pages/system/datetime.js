const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const dayjs = require('dayjs');
const progress = require('nprogress');
const Clock = require('react-live-clock');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const NTPTimeOption = require('webserver-form-schema/constants/system-sync-time-ntp-option');
const NTPTimeRateOption = require('webserver-form-schema/constants/system-sync-time-ntp-rate');
const {AVAILABLE_LANGUAGE_CODES, TIMEZONE_LIST} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const SelectField = require('../../../core/components/fields/select-field');

module.exports = class DateTime extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({languageCode: PropTypes.oneOf(AVAILABLE_LANGUAGE_CODES).isRequired}).isRequired,
      systemDateTime: PropTypes.shape({
        deviceTime: PropTypes.string.isRequired,
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
    this.state.apiProcessModalTitle = _('Updating Date & Time');
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
    const {systemInformation: {languageCode}} = this.props;
    const isLanguageUpdate = languageCode !== values.language;
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      isShowModal: false
    }, () => {
      if (values.syncTimeOption === SyncTimeOption.local) {
        values.manualTime = new Date();
        values.ntpTimeZone = dayjs.tz.guess();
      }

      if (isLanguageUpdate) {
        api.system.updateLanguage(values.language)
          .then(() => {
            location.reload();
          })
          .finally(progress.done);
      } else {
        values.manualTime.setSeconds(0);
        values.manualTime = values.manualTime.getTime() - (new Date(values.manualTime).getTimezoneOffset() * 60 * 1000);
        values.ntpUpdateTime = values.ntpUpdateTime.getTime() - (new Date(values.ntpUpdateTime).getTimezoneOffset() * 60 * 1000);
        api.system.updateSystemDateTime(values)
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
    const {systemDateTime: {deviceTime}} = this.props;
    const {$isApiProcessing, showDateTimePicker, isShowModal} = this.state;
    return (
      <Form className="card-body">
        <div className="card form-group">
          <div className="card-body">
            <div className="form-group d-flex justify-content-between align-items-center mb-0">
              <label className="mb-0">{_('Date and Time of the Device')}</label>
              <label className="text-primary mb-0">
                <Clock ticking date={deviceTime} timezone={values.ntpTimeZone} format="YYYY-MM-DD, hh:mm:ss A Z"/>
              </label>
            </div>
          </div>
        </div>
        <SelectField hide labelName={_('Language')} name="language">
          <option value={window.navigator.userLanguage || window.navigator.language}>{_('Default')}</option>
          <option value={AVAILABLE_LANGUAGE_CODES[0]}>{_('English')}</option>
          <option value={AVAILABLE_LANGUAGE_CODES[1]}>{_('Traditional Chinese')}</option>
        </SelectField>
        <div className="form-group">
          <label>{_('Time Zone')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="ntpTimeZone" component="select" className="form-control border-0">
              {TIMEZONE_LIST.map(zone => {
                return (
                  <option key={zone.name} value={zone.name}>{zone.label}</option>
                );
              })}
            </Field>
          </div>
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
              {_('Sync with Network Time Server (NTP)')}
            </label>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <div>
                <div className="d-flex form-group align-items-center">
                  <div className="text-size-14 text-nowrap mr-3">{`${_('Host Name and IP Address')} :`}</div>
                  <Field
                    className="form-control flex-grow-1"
                    type="text"
                    name="ntpIP"
                    placeholder={_('Enter Your IP Address')}
                  />
                </div>
                <hr className="my-4"/>
                <div className="d-flex align-items-center mb-3">
                  <div className="form-check">
                    <Field
                      name="ntpTimeOption"
                      className="form-check-input"
                      type="radio"
                      id={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                      value={NTPTimeOption.updateTime}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}
                    >
                      {`${_('Update Time')} :`}
                    </label>
                  </div>
                  <div className="form-row datepicker-wrapper">
                    <Field
                      name="ntpUpdateTime"
                      component={DateTimePicker}
                      timeTabText={_('Update Time')}
                      inputProps={{
                        className: classNames(
                          'btn date px-4',
                          {active: showDateTimePicker.ntpUpdateTime}
                        ),
                        placeholder: _('Update Time'),
                        style: {whiteSpace: 'nowrap'}
                      }}
                      isShowPicker={showDateTimePicker.ntpUpdateTime}
                      onClickInput={this.toggleDateTimePicker('ntpUpdateTime')}
                      onHide={this.onHideDateTimePicker('ntpUpdateTime')}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <Field
                      name="ntpTimeOption"
                      className="form-check-input"
                      type="radio"
                      id={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                      value={NTPTimeOption.updateTimeRate}
                    />
                    <label
                      className="form-check-label mr-3"
                      htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}
                    >
                      {`${_('Update Frequency (Minutes)')} :`}
                    </label>
                  </div>
                  <div className="select-wrapper border rounded-pill overflow-hidden">
                    <Field
                      name="ntpUpdateTimeRate"
                      component="select"
                      className="form-control border-0"
                    >
                      {NTPTimeRateOption.all().map(v => {
                        return (
                          <option key={v} value={v}>{v}</option>
                        );
                      })}
                    </Field>
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
              {_('Sync with Computer')}
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
                {`${_('Set Date/Time Manually')} :`}
              </label>
            </div>
            <div className="form-row datepicker-wrapper">
              <Field
                name="manualTime"
                component={DateTimePicker}
                dateTabText={_('Manual Date')}
                timeTabText={_('Manual Time')}
                inputProps={{
                  className: classNames(
                    'btn date px-4',
                    {active: showDateTimePicker.manualTime}
                  ),
                  placeholder: _('Manual DateTime'),
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
          {_('Apply')}
        </button>
        <CustomNotifyModal
          isShowModal={isShowModal}
          modalTitle={_('Date & Time')}
          modalBody={_('Update date & time need to log in again. Are you sure you want to continue?')}
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
    const {systemDateTime, systemInformation: {languageCode}} = this.props;
    const ntpUpdateTimeAdjust = systemDateTime.ntpUpdateTime + (new Date(systemDateTime.ntpUpdateTime).getTimezoneOffset() * 60 * 1000);

    return (
      <div className="main-content left-menu-active">
        <div className="page-system">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/system/datetime">{_('System')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/system/datetime">{_('Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Date & Time')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Date & Time')}</div>
                  <Formik
                    initialValues={{
                      ...systemDateTime,
                      ntpUpdateTime: new Date(ntpUpdateTimeAdjust),
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
