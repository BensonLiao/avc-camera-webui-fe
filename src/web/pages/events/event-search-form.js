const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const NTPTimeZoneList = require('webserver-form-schema/constants/system-sync-time-ntp-timezone-list');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const _ = require('../../../languages');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');

module.exports = class EventsSearchForm extends React.PureComponent {
  static get propTypes() {
    return {
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
  }

  state = {
    isShowStartDatePicker: false,
    isShowEndDatePicker: false
  };

  toggleStartDatePicker = () => {
    this.setState(prevState => ({
      isShowStartDatePicker: !prevState.isShowStartDatePicker,
      isShowEndDatePicker: false
    }));
  }

  onHideStartDatePicker = () => {
    this.setState({isShowStartDatePicker: false});
  }

  toggleEndDatePicker = () => {
    this.setState(prevState => ({
      isShowEndDatePicker: !prevState.isShowEndDatePicker,
      isShowStartDatePicker: false
    }));
  }

  onHideEndDatePicker = () => {
    this.setState({isShowEndDatePicker: false});
  }

  convertTime = (time, method) => {
    const {systemDateTime} = this.props;
    if (method === 'add') {
      time = new Date(time.getTime() - (time.getTimezoneOffset() * 60 * 1000));
    }

    if (method === 'subtract') {
      time = new Date(time.getTime() + (time.getTimezoneOffset() * 60 * 1000));
    }

    if (this.props.systemDateTime.syncTimeOption === SyncTimeOption.ntp) {
      const timeZoneDifference = systemDateTime.syncTimeOption === SyncTimeOption.ntp ?
        new Date(time.toLocaleString('en-US', {timeZone: 'utc'})) -
        new Date(time.toLocaleString('en-US', {timeZone: systemDateTime.ntpTimeZone})) :
        0;
      if (method === 'add') {
        time = new Date(time.getTime() + timeZoneDifference);
      }

      if (method === 'subtract') {
        time = new Date(time.getTime() - timeZoneDifference);
      }
    }

    return time;
  }

  /**
   * Handler on user submit the search form.
   * @param {String} keyword
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  onSubmitSearchForm = ({keyword, start, end}) => {
    getRouter().go({
      name: this.props.currentRouteName,
      params: {
        ...this.props.params,
        index: undefined,
        keyword,
        start: start ? this.convertTime(start, 'add').toJSON() : undefined,
        end: end ? this.convertTime(end, 'add').toJSON() : undefined
      }
    });
  };

  render() {
    const {isShowStartDatePicker, isShowEndDatePicker} = this.state;
    const {params, isApiProcessing} = this.props;
    const searchFromInitialValues = {
      keyword: params.keyword || '',
      start: params.start ? this.convertTime(new Date(params.start), 'subtract') : null,
      end: params.end ? this.convertTime(new Date(params.end), 'subtract') : null
    };

    return (
      <Formik initialValues={searchFromInitialValues}
        onSubmit={this.onSubmitSearchForm}
      >
        <Form>
          <div className="form-row datepicker-wrapper">
            <div className="col-auto px-0 btn-group datepicker-group">
              <Field
                name="start"
                component={DateTimePicker}
                dateTabText={_('Start Date')}
                timeTabText={_('Start Time')}
                inputProps={{
                  className: classNames('btn start-date px-4', {active: isShowStartDatePicker}),
                  placeholder: _('Start Datetime'),
                  style: {whiteSpace: 'nowrap'}
                }}
                endDateFieldName="end"
                isShowPicker={isShowStartDatePicker}
                onClickInput={this.toggleStartDatePicker}
                onHide={this.onHideStartDatePicker}
              />
              <Field
                name="end"
                component={DateTimePicker}
                dateTabText={_('End Date')}
                timeTabText={_('End Time')}
                inputProps={{
                  className: classNames('btn end-date px-4', {active: isShowEndDatePicker}),
                  placeholder: _('End Datetime'),
                  style: {whiteSpace: 'nowrap'}
                }}
                startDateFieldName="start"
                isShowPicker={isShowEndDatePicker}
                onClickInput={this.toggleEndDatePicker}
                onHide={this.onHideEndDatePicker}
              />
            </div>
          </div>
          <div className="form-row mt-4">
            <div className="col-auto px-0">
              <Field name="keyword" className="form-control" type="search" placeholder={_('Enter keywords')}/>
            </div>
            <div className="col-auto px-0 ml-3">
              <button className="btn btn-outline-primary rounded-pill px-3" type="submit" disabled={isApiProcessing}>
                <i className="fas fa-search fa-fw"/> {_('Search')}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    );
  }
};
