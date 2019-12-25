const $ = require('jquery');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const Overlay = require('react-bootstrap/Overlay').default;
const leftPad = require('left-pad');
const utils = require('../../utils');
const _ = require('../../../languages');

const CLOCK_ITEM_HEIGHT = 40;

module.exports = class DatePicker extends React.PureComponent {
  static get propTypes() {
    return {
      inputProps: PropTypes.object,
      isShowRepeatSwitch: PropTypes.bool,
      dateTabText: PropTypes.string.isRequired,
      timeTabText: PropTypes.string.isRequired,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.instanceOf(Date)
      }).isRequired,
      form: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired
      }).isRequired,
      isShowPicker: PropTypes.bool,
      onClickInput: PropTypes.func.isRequired,
      onHide: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {
      inputProps: {},
      isShowRepeatSwitch: false,
      isShowPicker: false
    };
  }

  state = {};

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.clockData = {
      hours: [null, null, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, null, null],
      minutes: [null, null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, null, null],
      meridiemItems: [null, null, 'PM', 'AM', null, null],
      hoursRef: React.createRef(),
      minutesRef: React.createRef(),
      meridiemItemsRef: React.createRef(),
      tuneHoursScrollTimeout: null,
      tuneMinutesScrollTimeout: null,
      tuneMeridiemItemsScrollTimeout: null
    };
    if (props.field.value) {
      this.state.displayDate = new Date(props.field.value);
      if (isNaN(this.state.displayDate.getTime())) {
        this.state.displayDate = new Date();
      }
    } else {
      this.state.displayDate = new Date();
    }

    this.state.currentMeridiem = 'AM';
    if (this.state.displayDate.getHours() >= 12) {
      this.state.currentMeridiem = 'PM';
    }

    this.state.displayDate.setDate(1);
  }

  /**
   * Compare two dates.
   * @param {Date|null} a
   * @param {Date|null} b
   * @returns {Boolean}
   */
  isSelected = (a, b) => {
    if (!a || !b) {
      return false;
    }

    return utils.formatDate(a, {format: 'YYYYMMDD'}) === utils.formatDate(b, {format: 'YYYYMMDD'});
  };

  setValue = (date = new Date(), {skipTime} = {}) => {
    const {field, form} = this.props;

    if (skipTime && field.value) {
      date.setMilliseconds(field.value.getMilliseconds());
      date.setSeconds(field.value.getSeconds());
      date.setMinutes(field.value.getMinutes());
      date.setHours(field.value.getHours());
    }

    form.setFieldValue(field.name, date);
  };

  /**
   * @param {Date} start
   * @param {Date} selectedDate
   * @returns {calender}
   * @calender {Array<Array<{Object}>>}
   * - [][].date {Date}
   * - [][].isSelected {Boolean}
   * - [][].isDisplayMonth {Boolean}
   */
  generateCalendarContentInMonth = (start, selectedDate) => {
    const result = [];

    // Complete previous month.
    if (start.getDay() === 0) {
      result.push([]);
    } else {
      const previousMonth = new Date(start);
      previousMonth.setDate(previousMonth.getDate() - start.getDay());
      result.push([]);
      for (let index = start.getDay(); index > 0; index -= 1) {
        result[result.length - 1].push({
          date: new Date(previousMonth),
          isSelected: this.isSelected(previousMonth, selectedDate),
          isDisplayMonth: false
        });
        previousMonth.setDate(previousMonth.getDate() + 1);
      }
    }

    // Push this month.
    const indexDate = new Date(start);
    while (indexDate.getMonth() === start.getMonth()) {
      if (result[result.length - 1].length >= 7) {
        result.push([]);
      }

      result[result.length - 1].push({
        date: new Date(indexDate),
        isSelected: this.isSelected(indexDate, selectedDate),
        isDisplayMonth: true
      });
      indexDate.setDate(indexDate.getDate() + 1);
    }

    // Complete next month.
    const nextMonth = new Date(start);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    while (result.length <= 6) {
      while (result[result.length - 1].length < 7) {
        result[result.length - 1].push({
          date: new Date(nextMonth),
          isSelected: this.isSelected(nextMonth, selectedDate),
          isDisplayMonth: false
        });
        nextMonth.setDate(nextMonth.getDate() + 1);
      }

      result.push([]);
    }

    result.pop();
    return result;
  };

  onClickInput = () => {
    this.setState(prevState => {
      return {isShowPicker: !prevState.isShowPicker};
    });
  };

  onSwitchToClock = () => {
    const {field} = this.props;

    if (field.value == null) {
      this.setValue();
    }

    setTimeout(() => {
      $(this.clockData.hoursRef.current).scrollTop(
        (this.props.field.value.getHours() % 12) * CLOCK_ITEM_HEIGHT
      );
      $(this.clockData.minutesRef.current).scrollTop(
        this.props.field.value.getMinutes() * CLOCK_ITEM_HEIGHT
      );
      $(this.clockData.meridiemItemsRef.current).scrollTop(
        (this.props.field.value.getHours() >= 12 ? 0 : 1) * CLOCK_ITEM_HEIGHT
      );
    }, 200);
  };

  hoursScrollHandler = event => {
    const {field, form} = this.props;
    const positionY = $(event.target).scrollTop();
    const index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    const hours = this.clockData.hours[index + 2];
    const {currentMeridiem} = this.state;
    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneHoursScrollTimeout);
    if (expectPositionY === positionY) {
      if (field.value.getHours() !== hours) {
        const date = new Date(field.value);
        if (hours === 12) {
          date.setHours(currentMeridiem === 'PM' ? hours : hours - 12);
        } else {
          date.setHours(currentMeridiem === 'PM' ? hours + 12 : hours);
        }

        form.setFieldValue(field.name, date);
      }
    } else {
      this.clockData.tuneHoursScrollTimeout = setTimeout(() => {
        $(this.clockData.hoursRef.current).animate({scrollTop: expectPositionY}, 200);
      }, 300);
    }
  };

  minutesScrollHandler = event => {
    const {field, form} = this.props;
    const positionY = $(event.target).scrollTop();
    const index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    const minutes = this.clockData.minutes[index + 2];
    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneMinutesScrollTimeout);
    if (expectPositionY === positionY) {
      if (field.value.getMinutes() !== minutes) {
        const date = new Date(field.value);
        date.setMinutes(minutes);
        form.setFieldValue(field.name, date);
      }
    } else {
      this.clockData.tuneMinutesScrollTimeout = setTimeout(() => {
        $(this.clockData.minutesRef.current).animate({scrollTop: expectPositionY}, 200);
      }, 300);
    }
  };

  meridiemItemsScrollHandler = event => {
    const {field, form} = this.props;
    const positionY = $(event.target).scrollTop();
    const index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    const item = this.clockData.meridiemItems[index + 2];
    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneMeridiemItemsScrollTimeout);
    if (expectPositionY === positionY) {
      if (item === 'AM' && field.value.getHours() >= 12) {
        const date = new Date(field.value);
        date.setHours(date.getHours() - 12);
        form.setFieldValue(field.name, date);
      } else if (item === 'PM' && field.value.getHours() < 12) {
        const date = new Date(field.value);
        date.setHours(date.getHours() + 12);
        form.setFieldValue(field.name, date);
      }

      this.setState({currentMeridiem: item});
    } else {
      this.clockData.tuneMeridiemItemsScrollTimeout = setTimeout(() => {
        $(this.clockData.meridiemItemsRef.current).animate({scrollTop: expectPositionY}, 200);
      }, 300);
    }
  };

  onEnteredPicker = () => {
    $(this.clockData.hoursRef.current).scroll(this.hoursScrollHandler);
    $(this.clockData.minutesRef.current).scroll(this.minutesScrollHandler);
    $(this.clockData.meridiemItemsRef.current).scroll(this.meridiemItemsScrollHandler);
  };

  onExitPicker = () => {
    $(this.clockData.hoursRef.current).off('scroll', this.hoursScrollHandler);
    $(this.clockData.minutesRef.current).off('scroll', this.minutesScrollHandler);
    $(this.clockData.meridiemItemsRef.current).off('scroll', this.meridiemItemsScrollHandler);
  };

  generateClickDateHandler = date => event => {
    event.preventDefault();
    this.setValue(date, {skipTime: true});
  };

  generateChangeDisplayMonthHandler = date => event => {
    event.preventDefault();
    this.setState({displayDate: date});
  };

  calendarRender = () => {
    const {field} = this.props;
    const {displayDate} = this.state;
    const content = this.generateCalendarContentInMonth(displayDate, field.value);
    const previousMonthDisplayDate = new Date(displayDate);
    const nextMonthDisplayDate = new Date(displayDate);
    const displayMonthDropdownItems = (() => {
      const result = [];
      for (let index = -6; index <= 6; index += 1) {
        const date = new Date(displayDate);
        date.setMonth(date.getMonth() + index);
        result.push(date);
      }

      return result;
    })();

    previousMonthDisplayDate.setMonth(previousMonthDisplayDate.getMonth() - 1);
    nextMonthDisplayDate.setMonth(nextMonthDisplayDate.getMonth() + 1);

    return (
      <div className="calendar">
        <div className="d-flex justify-content-between">
          <div>
            <button className="btn btn-link date-selector px-2 dropdown-toggle" type="button" data-toggle="dropdown">
              {utils.formatDate(displayDate, {format: 'MMM YYYY'})}
            </button>
            <div className="dropdown-menu">
              {
                displayMonthDropdownItems.map(date => {
                  const key = utils.formatDate(date, {format: 'YYYYMM'});
                  return (
                    <a key={key} href={`#${key}`}
                      className="dropdown-item"
                      onClick={this.generateChangeDisplayMonthHandler(date)}
                    >
                      {utils.formatDate(date, {format: 'MMM YYYY'})}
                    </a>
                  );
                })
              }
            </div>
          </div>
          <div>
            <button className="btn btn-link previous-month" type="button"
              onClick={this.generateChangeDisplayMonthHandler(previousMonthDisplayDate)}
            >
              <i className="fas fa-chevron-left"/>
            </button>
            <button className="btn btn-link next-month" type="button"
              onClick={this.generateChangeDisplayMonthHandler(nextMonthDisplayDate)}
            >
              <i className="fas fa-chevron-right"/>
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>{_('Su')}</th>
              <th>{_('Mo')}</th>
              <th>{_('Tu')}</th>
              <th>{_('We')}</th>
              <th>{_('Th')}</th>
              <th>{_('Fr')}</th>
              <th>{_('Sa')}</th>
            </tr>
          </thead>
          <tbody>
            {
              content.map(row => {
                return (
                  <tr key={`r${utils.formatDate(row[0].date, {format: 'YYYYMMDD'})}`}>
                    {
                      row.map(item => {
                        const key = utils.formatDate(item.date, {format: 'YYYYMMDD'});
                        if (item.isDisplayMonth) {
                          return (
                            <td key={key} className={classNames({active: item.isSelected})}
                              onClick={this.generateClickDateHandler(item.date)}
                            >
                              <a href={`#${key}`}>{item.date.getDate()}</a>
                            </td>
                          );
                        }

                        return (
                          <td key={key} className={classNames('disabled', {active: item.isSelected})}>
                            {item.date.getDate()}
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  clockRender = () => {
    const {hours, minutes, meridiemItems} = this.clockData;

    return (
      <div className="time-selector form-row">
        <div className="col-4">
          <div className="divider"/>
          <div ref={this.clockData.hoursRef} className="item-container">
            {
              hours.map((hour, index) => (
                <a key={hour || `none-${index}`} className="item">
                  {hour == null ? '' : leftPad(hour, 2, '0')}
                </a>
              ))
            }
          </div>
        </div>
        <div className="col-4">
          <div className="divider"/>
          <div ref={this.clockData.minutesRef} className="item-container">
            {
              minutes.map((minute, index) => (
                <a key={minute || `none-${index}`} className="item">
                  {minute == null ? '' : leftPad(minute, 2, '0')}
                </a>
              ))
            }
          </div>
        </div>
        <div className="col-4">
          <div className="divider"/>
          <div ref={this.clockData.meridiemItemsRef} className="item-container">
            {
              meridiemItems.map((item, index) => (
                <a key={item || `none-${index}`} className="item">
                  {item || ''}
                </a>
              ))
            }
          </div>
        </div>
      </div>
    );
  };

  pickerRender = ({placement,
    scheduleUpdate,
    arrowProps,
    outOfBoundaries,
    show: _show,
    ...props}) => {
    const {isShowRepeatSwitch, dateTabText, timeTabText} = this.props;

    return (
      <div className="datepicker-wrapper">
        <div className="datepicker" {...props}>
          <nav>
            <div className="nav nav-tabs">
              <a className="nav-item nav-link flex-fill text-center ml-0 active" data-toggle="tab" href="#tab-datepicker-date">
                {dateTabText}
              </a>
              <a className="nav-item nav-link flex-fill text-center mr-0" data-toggle="tab" href="#tab-datepicker-time"
                onClick={this.onSwitchToClock}
              >
                {timeTabText}
              </a>
            </div>
          </nav>
          <div className="tab-content">
            <div className="tab-pane fade active show" id="tab-datepicker-date">
              {
                isShowRepeatSwitch && (
                  <div className="form-group d-flex justify-content-between align-items-center">
                    <label className="text-size-14 mb-0">重複</label>
                    <div className="custom-control custom-switch switch-sm">
                      <input type="checkbox" className="custom-control-input" id="switch-repeat"/>
                      <label className="custom-control-label" htmlFor="switch-repeat"/>
                    </div>
                  </div>
                )
              }
              {this.calendarRender()}
            </div>
            <div className="tab-pane fade" id="tab-datepicker-time">
              {this.clockRender()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {inputProps, field, isShowPicker, onClickInput, onHide} = this.props;

    return (
      <>
        <button
          ref={this.inputRef}
          type="button"
          {...inputProps}
          onClick={onClickInput}
        >
          {utils.formatDate(field.value) || inputProps.placeholder}
        </button>
        <Overlay
          rootClose
          target={this.inputRef.current}
          placement="bottom-start"
          show={isShowPicker}
          onEntered={this.onEnteredPicker}
          onExit={this.onExitPicker}
          onHide={onHide}
        >
          {this.pickerRender}
        </Overlay>
      </>
    );
  }
};
