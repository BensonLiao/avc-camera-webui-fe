const classNames = require('classnames');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const NTPTimeZoneList = require('webserver-form-schema/constants/system-sync-time-ntp-timezone-list');
const SyncTimeOption = require('webserver-form-schema/constants/system-sync-time');
const i18n = require('../../i18n').default;
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const utils = require('../../../core/utils');

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
    isShowEndDatePicker: false,
    inputEndTime: localStorage.getItem('inputEndTime') || false
  };

  componentDidMount() {
    localStorage.removeItem('inputEndTime');
  }

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

  /**
   * Handler on user submit the search form.
   * @param {String} keyword
   * @param {String} start
   * @param {String} end
   * @returns {void}
   */
  onSubmitSearchForm = ({keyword, start, end}) => {
    if (end) {
      localStorage.setItem('inputEndTime', true);
    }

    getRouter().go({
      name: this.props.currentRouteName,
      params: {
        ...this.props.params,
        index: undefined,
        keyword,
        start: start ? utils.addTimezoneOffset(start).toJSON() : undefined,
        end: end ? utils.addTimezoneOffset(end).toJSON() : undefined
      }
    });
  };

  render() {
    const {isShowStartDatePicker, isShowEndDatePicker, inputEndTime} = this.state;
    const {params, isApiProcessing} = this.props;
    const searchFromInitialValues = {
      keyword: params.keyword || '',
      start: params.start ? utils.subtractTimezoneOffset(new Date(params.start)) : null,
      end: params.end && inputEndTime ? utils.subtractTimezoneOffset(new Date(params.end)) : null
    };

    return (
      <Formik
        initialValues={searchFromInitialValues}
        onSubmit={this.onSubmitSearchForm}
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
                onClickInput={this.toggleStartDatePicker}
                onHide={this.onHideStartDatePicker}
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
                onClickInput={this.toggleEndDatePicker}
                onHide={this.onHideEndDatePicker}
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
  }
};
