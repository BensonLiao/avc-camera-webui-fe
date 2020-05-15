const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const NTPTimeZone = require('webserver-form-schema/constants/system-sync-time-ntp-timezone');
const NTPTimeOption = require('webserver-form-schema/constants/system-sync-time-ntp-option');
const NTPTimeRateOption = require('webserver-form-schema/constants/system-sync-time-ntp-rate');
const {AVAILABLE_LANGUAGE_CODES} = require('../../../core/constants');
const Clock = require('react-live-clock');

module.exports = class DateTime extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(AVAILABLE_LANGUAGE_CODES).isRequired
      }).isRequired,
      systemDateTime: PropTypes.shape({
        deviceTime: PropTypes.string.isRequired,
        syncTimeOption: PropTypes.oneOf(SyncTimeOption.all()).isRequired,
        ntpTimeZone: PropTypes.oneOf(NTPTimeZone.all()).isRequired,
        ntpIP: PropTypes.string.isRequired,
        ntpTimeOption: PropTypes.oneOf(NTPTimeOption.all()).isRequired,
        ntpUpdateTime: PropTypes.string.isRequired,
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
  }

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
    if (values.syncTimeOption === SyncTimeOption.local) {
      values.manualTime = new Date();
    }

    if (isLanguageUpdate) {
      api.system.updateLanguage(values.language)
        .then(() => {
          location.reload();
        })
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    } else {
      api.system.updateSystemDateTime(values)
        .then(() => {
          getRouter().reload();
        })
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    }
  };

  formRender = () => {
    const {systemDateTime: {deviceTime}} = this.props;
    const {showDateTimePicker} = this.state;
    return (
      <Form className="card-body">
        <div className="card form-group">
          <div className="card-body">
            <div className="form-group d-flex justify-content-between align-items-center mb-0">
              <label className="mb-0">{_('Date and Time of the Device')}</label>
              <label className="text-primary mb-0">
                <Clock
                  ticking
                  date={deviceTime}
                  format="YYYY-MM-DD, hh:mm:ss A"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Language')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="language" component="select" className="form-control border-0">
              <option value={AVAILABLE_LANGUAGE_CODES[0]}>{_('English')}</option>
              <option value={AVAILABLE_LANGUAGE_CODES[1]}>{_('Traditional Chinese')}</option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Time Zone')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="ntpTimeZone" component="select" className="form-control border-0">
              {NTPTimeZone.all().map(v => {
                return (
                  <option key={v} value={v}>{v}</option>
                );
              })}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <div className="form-check mb-3">
            <Field name="syncTimeOption" className="form-check-input" type="radio" id={`system-date-sync-option-${SyncTimeOption.ntp}`} value={SyncTimeOption.ntp}/>
            <label className="form-check-label" htmlFor={`system-date-sync-option-${SyncTimeOption.ntp}`}>
              {_('Sync with network time server (NTP)')}
            </label>
          </div>
          <div className="pl-4 mb-3">
            <div className="d-flex align-items-center mb-3">
              <span className="text-size-14">
                {_('Host Name and IP Address:')}
              </span>
              <Field
                className="form-control flex-grow-1"
                type="text"
                name="ntpIP"
                placeholder={_('Enter your IP address')}
              />
            </div>
            <div className="d-flex align-items-center mb-3">
              <div className="form-check">
                <Field name="ntpTimeOption" className="form-check-input" type="radio" id={`system-date-sync-time-option-${NTPTimeOption.updateTime}`} value={NTPTimeOption.updateTime}/>
                <label className="form-check-label" htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTime}`}>
                  {_('Update Time')}
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

            <div className="d-flex align-items-center mb-3">
              <div className="form-check">
                <Field name="ntpTimeOption" className="form-check-input" type="radio" id={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`} value={NTPTimeOption.updateTimeRate}/>
                <label className="form-check-label" htmlFor={`system-date-sync-time-option-${NTPTimeOption.updateTimeRate}`}>
                  {_('Update Frequency')}
                </label>
              </div>
              <div className="select-wrapper border rounded-pill overflow-hidden ml-3">
                <Field name="ntpUpdateTimeRate" component="select" className="form-control border-0">
                  {NTPTimeRateOption.all().map(v => {
                    return (
                      <option key={v} value={v}>{v}</option>
                    );
                  })}
                </Field>
              </div>
              <span className="ml-2">{_('Minutes')}</span>
            </div>
          </div>

          <div className="form-check mb-3">
            <Field name="syncTimeOption" className="form-check-input" type="radio" id={`system-date-sync-option-${SyncTimeOption.local}`} value={SyncTimeOption.local}/>
            <label className="form-check-label" htmlFor={`system-date-sync-option-${SyncTimeOption.local}`}>
              {_('Sync with Computer')}
            </label>
          </div>

          <div className="form-check mb-3">
            <Field name="syncTimeOption" className="form-check-input" type="radio" id={`system-date-sync-option-${SyncTimeOption.manual}`} value={SyncTimeOption.manual}/>
            <label className="form-check-label" htmlFor={`system-date-sync-option-${SyncTimeOption.manual}`}>
              {_('Setup the Date/Time Manually')}
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

        <button
          className="btn btn-block btn-primary rounded-pill"
          type="submit"
        >
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {systemDateTime, systemInformation: {languageCode}} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="page-system">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/system">{_('System')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/system/date">{_('Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Date & Region')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Date & Region')}</div>
                  <Formik
                    initialValues={{
                      ...systemDateTime,
                      ntpUpdateTime: new Date(systemDateTime.ntpUpdateTime),
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
      </div>
    );
  }
};
