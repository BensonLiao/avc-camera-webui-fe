const $ = require('jquery');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Nav, Tab} = require('react-bootstrap');
const Overlay = require('react-bootstrap/Overlay').default;
const dayjs = require('dayjs');
const utils = require('../../utils');

const CLOCK_ITEM_HEIGHT = 40;
const isOneOfDateTime = props => {
  if (!props.dateTabText && !props.timeTabText) {
    return new Error('At least dateTabText or timeTabText prop must be provided');
  }
};

module.exports = class DatePicker extends React.PureComponent {
  static get propTypes() {
    return {
      inputProps: PropTypes.object,
      isShowRepeatSwitch: PropTypes.bool,
      dateTabText: isOneOfDateTime,
      dateFormat: PropTypes.string,
      timeTabText: isOneOfDateTime,
      timeFormat: PropTypes.string,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number])
      }).isRequired,
      form: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired
      }).isRequired,
      startDateFieldName: PropTypes.string,
      endDateFieldName: PropTypes.string,
      isShowPicker: PropTypes.bool,
      onClickInput: PropTypes.func.isRequired,
      onHide: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {
      inputProps: {},
      isShowRepeatSwitch: false,
      dateTabText: undefined,
      dateFormat: 'MM/DD/YYYY',
      timeTabText: undefined,
      timeFormat: 'HH:mm',
      isShowPicker: false,
      startDateFieldName: '',
      endDateFieldName: ''
    };
  }

  state = {
    tabKey: null,
    displayDate: null,
    currentMeridiem: 'AM'
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.clockData = {
      hours: [null, null, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, null, null],
      minutes: [null, null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, null, null],
      meridiemItems: [null, null, 'PM', 'AM', null, null],
      hoursRef: React.createRef(),
      currentHourItem: 12,
      minutesRef: React.createRef(),
      currentMinuteItem: 0,
      meridiemItemsRef: React.createRef(),
      tuneHoursScrollTimeout: null,
      tuneMinutesScrollTimeout: null,
      tuneMeridiemItemsScrollTimeout: null
    };
  }

  componentDidMount() {
    const {field, dateTabText} = this.props;
    this.setTabKey(dateTabText ? 'tab-datepicker-date' : 'tab-datepicker-time', () => {
      if (field.value && utils.isDate(field.value)) {
        this.setState({displayDate: new Date(field.value)}, () => {
          this.state.displayDate.setDate(1);
          if (this.state.displayDate.getHours() >= 12) {
            this.setState({currentMeridiem: 'PM'});
          }
        });
      } else {
        this.setState({displayDate: new Date()}, () => {
          this.state.displayDate.setDate(1);
          if (this.state.displayDate.getHours() >= 12) {
            this.setState({currentMeridiem: 'PM'});
          }
        });
      }
    });
  }

  /**
   * Set the current tab state.
   * @param {string} key - The tab key. either be `tab-datepicker-date` or `tab-datepicker-time`
   * @param {function|null} callback The function to execure after state update. default is `null`
   * @returns {void}
   */
  setTabKey = (key, callback = null) => {
    if (typeof callback === 'function') {
      this.setState({tabKey: key}, callback);
    } else {
      this.setState({tabKey: key});
    }
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

  scrollTopAnimatePromise = (target, scrollPos) => {
    return $(target).animate({scrollTop: scrollPos}, 200).promise();
  }

  /**
   * Check if hour are less than start date's hour or greater than end date's hour.
   * @param {Number} hour
   * @returns {Boolean}
   */
  isInvalidHour = hour => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
    const {currentMeridiem} = this.state;

    if (startDate) {
      return dayjs(startDate).isSame(dayjs(field.value), 'date') &&
        dayjs(startDate).hour() > (currentMeridiem === 'PM' ?
          (hour === 12 ? hour : hour + 12) :
          (hour === 12 ? hour - 12 : hour));
    }

    if (endDate) {
      return dayjs(endDate).isSame(dayjs(field.value), 'date') &&
        dayjs(endDate).hour() < (currentMeridiem === 'PM' ?
          (hour === 12 ? hour : hour + 12) :
          (hour === 12 ? hour - 12 : hour));
    }

    return false;
  };

  /**
   * Get the valid hour item index, for scroll positioning.
   * @param {String} meridiem - AM/PM
   * @param {String|Date|Number} date - Date to check
   * @returns {Number}
   */
  getValidHourItemIdx = (meridiem, date) => {
    return meridiem === 'PM' ?
      dayjs(date).hour() - 12 :
      dayjs(date).hour();
  };

  /**
   * Check if minute are less than start date's minute or greater than end date's minute.
   * @param {Number} minute
   * @returns {Boolean}
   */
  isInvalidMinute = minute => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;

    if (startDate) {
      return dayjs(startDate).isSame(dayjs(field.value), 'date') &&
        dayjs(startDate).isSame(dayjs(field.value), 'hour') &&
        dayjs(startDate).minute() > minute;
    }

    if (endDate) {
      return dayjs(endDate).isSame(dayjs(field.value), 'date') &&
        dayjs(endDate).isSame(dayjs(field.value), 'hour') &&
        dayjs(endDate).minute() < minute;
    }

    return false;
  };

  /**
   * Check if meridiem are invalid. e.g. start date hour is greater than 12 and end date picker's meridiem is `AM`
   * @param {Number} meridiem
   * @returns {Boolean}
   */
  isInvalidMeridiem = meridiem => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;

    if (startDate) {
      return dayjs(startDate).isSame(dayjs(field.value), 'date') &&
        (meridiem === 'AM' && dayjs(startDate).hour() >= 12);
    }

    if (endDate) {
      return dayjs(endDate).isSame(dayjs(field.value), 'date') &&
        (meridiem === 'PM' && dayjs(endDate).hour() < 12);
    }

    return false;
  };

  checkAndUpdateValue = date => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName,
      dateTabText
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
    const isDate = utils.isDate(date);
    if (dateTabText) {
      let clockDatetime = isDate ? date : (field.value ? field.value : new Date());
      if (startDate && dayjs(startDate).isAfter(clockDatetime)) {
        clockDatetime = dayjs(startDate);
      } else if (endDate && dayjs(endDate).isBefore(clockDatetime)) {
        clockDatetime = dayjs(endDate);
      }

      this.setDateValue(new Date(clockDatetime), {skipTime: isDate});
    }
  }

  setDateValue = (date = new Date(), {skipTime} = {}) => {
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

  onSwitchToClock = date => {
    const {dateTabText} = this.props;
    this.checkAndUpdateValue(date);

    setTimeout(() => {
      const isHourDisabled = this.isInvalidHour(this.clockData.currentHourItem);
      this.scrollTopAnimatePromise(
        this.clockData.hoursRef.current,
        (this.props.field.value.getHours() % 12) * CLOCK_ITEM_HEIGHT
      )
        .then(() => {
          if (dateTabText && isHourDisabled) {
            const meridiemScrollPos = $(this.clockData.meridiemItemsRef.current).scrollTop();
            this.scrollTopAnimatePromise(
              this.clockData.meridiemItemsRef.current,
              meridiemScrollPos + (meridiemScrollPos === 0 ? 1 : -1)
            );
          }
        });

      const isMinuteDisabled = this.isInvalidMinute(this.clockData.currentMinuteItem);
      this.scrollTopAnimatePromise(
        this.clockData.minutesRef.current,
        this.props.field.value.getMinutes() * CLOCK_ITEM_HEIGHT
      )
        .then(() => {
          const minuteScrollPos = $(this.clockData.minutesRef.current).scrollTop();
          if (dateTabText && !isHourDisabled && isMinuteDisabled) {
            this.scrollTopAnimatePromise(
              this.clockData.minutesRef.current,
              minuteScrollPos + (minuteScrollPos === 0 ? 1 : -1)
            );
          }
        });
      this.scrollTopAnimatePromise(
        this.clockData.meridiemItemsRef.current,
        (this.props.field.value.getHours() >= 12 ? 0 : 1) * CLOCK_ITEM_HEIGHT
      );
    }, 200);
  };

  hoursScrollHandler = event => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
    const {currentMeridiem} = this.state;
    const positionY = $(event.target).scrollTop();
    let index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    this.clockData.currentHourItem = this.clockData.hours[index + 2];
    const isDisabled = this.isInvalidHour(this.clockData.currentHourItem);
    let validItemIdx = 0;
    if (startDate) {
      validItemIdx = this.getValidHourItemIdx(currentMeridiem, startDate);
    } else if (endDate) {
      validItemIdx = this.getValidHourItemIdx(currentMeridiem, endDate);
    }

    if (isDisabled) {
      index = validItemIdx;
    }

    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneHoursScrollTimeout);

    if (expectPositionY === positionY && !isDisabled) {
      const date = new Date(field.value);
      if (this.clockData.currentHourItem === 12) {
        date.setHours(currentMeridiem === 'PM' ? this.clockData.currentHourItem : this.clockData.currentHourItem - 12);
      } else {
        date.setHours(currentMeridiem === 'PM' ? this.clockData.currentHourItem + 12 : this.clockData.currentHourItem);
      }

      this.setDateValue(date);
    } else {
      this.clockData.tuneHoursScrollTimeout = setTimeout(() => {
        $(this.clockData.hoursRef.current).animate({scrollTop: expectPositionY}, 200);
        const minuteScrollPos = $(this.clockData.minutesRef.current).scrollTop();
        $(this.clockData.minutesRef.current).animate({scrollTop: minuteScrollPos + (minuteScrollPos === 0 ? 1 : -1)}, 200);
      }, 300);
    }
  };

  minutesScrollHandler = event => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
    const positionY = $(event.target).scrollTop();
    let index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    this.clockData.currentMinuteItem = this.clockData.minutes[index + 2];
    let isDisabled = this.isInvalidMinute(this.clockData.currentMinuteItem);
    let validItemIdx = 0;
    if (startDate) {
      validItemIdx = dayjs(startDate).minute();
    } else if (endDate) {
      validItemIdx = dayjs(endDate).minute();
    }

    if (isDisabled) {
      index = validItemIdx;
    }

    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneMinutesScrollTimeout);
    if (expectPositionY === positionY && !isDisabled) {
      const date = new Date(field.value);
      if (field.value.getMinutes() !== this.clockData.currentMinuteItem) {
        date.setMinutes(this.clockData.currentMinuteItem);
      }

      this.setDateValue(date);
    } else {
      this.clockData.tuneMinutesScrollTimeout = setTimeout(() => {
        $(this.clockData.minutesRef.current).animate({scrollTop: expectPositionY}, 200);
      }, 300);
    }
  };

  meridiemItemsScrollHandler = event => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
    const positionY = $(event.target).scrollTop();
    let index = Math.round(positionY / CLOCK_ITEM_HEIGHT);
    const meridiem = this.clockData.meridiemItems[index + 2];
    const isDisabled = this.isInvalidMeridiem(meridiem);
    if (isDisabled) {
      index = meridiem === 'PM' ? 1 : 0;
    }

    const expectPositionY = index * CLOCK_ITEM_HEIGHT;
    clearTimeout(this.clockData.tuneMeridiemItemsScrollTimeout);
    if (expectPositionY === positionY && !isDisabled) {
      const date = new Date(field.value);
      if (meridiem === 'AM' && field.value.getHours() >= 12) {
        date.setHours(date.getHours() - 12);
      } else if (meridiem === 'PM' && field.value.getHours() < 12) {
        date.setHours(date.getHours() + 12);
      }

      this.setDateValue(date);
      this.setState({currentMeridiem: meridiem}, () => {
        // Do cross validation between hour and meridiem scroller
        const isHourDisabled = this.isInvalidHour(this.clockData.currentHourItem);
        let validHourItemIdx = 0;
        if (startDate) {
          validHourItemIdx = this.getValidHourItemIdx(meridiem, startDate);
        } else if (endDate) {
          validHourItemIdx = this.getValidHourItemIdx(meridiem, endDate);
        }

        if (isHourDisabled) {
          this.clockData.tuneHoursScrollTimeout = setTimeout(() => {
            this.scrollTopAnimatePromise(
              this.clockData.hoursRef.current,
              validHourItemIdx * CLOCK_ITEM_HEIGHT
            )
              .then(() => {
                // Scroll minute a little bit to get minute scroll helper works
                const minuteScrollPos = $(this.clockData.minutesRef.current).scrollTop();
                return this.scrollTopAnimatePromise(
                  this.clockData.minutesRef.current,
                  minuteScrollPos + (minuteScrollPos === 0 ? 1 : -1)
                );
              });
          }, 300);
        }

        // Do cross validation between minute and meridiem scroller
        const isMinuteDisabled = this.isInvalidMinute(this.clockData.currentMinuteItem);
        let validMinuteItemIdx = 0;
        if (startDate) {
          validMinuteItemIdx = dayjs(startDate).minute();
        } else if (endDate) {
          validMinuteItemIdx = dayjs(endDate).minute();
        }

        if (isMinuteDisabled) {
          this.clockData.tuneMinutesScrollTimeout = setTimeout(() => {
            $(this.clockData.minutesRef.current).animate({scrollTop: validMinuteItemIdx * CLOCK_ITEM_HEIGHT}, 200);
          }, 300);
        }
      });
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
    if (!this.props.dateTabText) {
      this.onSwitchToClock();
    }
  };

  onExitPicker = () => {
    $(this.clockData.hoursRef.current).off('scroll', this.hoursScrollHandler);
    $(this.clockData.minutesRef.current).off('scroll', this.minutesScrollHandler);
    $(this.clockData.meridiemItemsRef.current).off('scroll', this.meridiemItemsScrollHandler);
    if (this.props.dateTabText) {
      this.setTabKey('tab-datepicker-date');
    }
  };

  generateClickDateHandler = date => event => {
    event.preventDefault();
    if (this.props.timeTabText) {
      this.setTabKey('tab-datepicker-time');
      this.onSwitchToClock(date);
    } else {
      this.checkAndUpdateValue(date);
    }
  };

  generateChangeDisplayMonthHandler = date => event => {
    event.preventDefault();
    this.setState({displayDate: date});
  };

  calendarRender = () => {
    const {
      field,
      form: {values},
      endDateFieldName,
      startDateFieldName
    } = this.props;
    const {
      [startDateFieldName]: startDate,
      [endDateFieldName]: endDate
    } = values;
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
                    <a
                      key={key}
                      href={`#${key}`}
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
            <button
              className="btn btn-link previous-month"
              type="button"
              onClick={this.generateChangeDisplayMonthHandler(previousMonthDisplayDate)}
            >
              <i className="fas fa-chevron-left"/>
            </button>
            <button
              className="btn btn-link next-month"
              type="button"
              onClick={this.generateChangeDisplayMonthHandler(nextMonthDisplayDate)}
            >
              <i className="fas fa-chevron-right"/>
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              {
                [0, 1, 2, 3, 4, 5, 6].map(weekday => {
                  return (
                    <th key={weekday}>{dayjs().day(weekday).format('dd').replace(/\.$/, '')}</th>
                  );
                })
              }
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
                        let isDateDisabled = false;
                        if (startDate) {
                          isDateDisabled = dayjs(item.date).isBefore(dayjs(startDate), 'date');
                        } else if (endDate) {
                          isDateDisabled = dayjs(item.date).isAfter(dayjs(endDate), 'date');
                        }

                        if (item.isDisplayMonth && !isDateDisabled) {
                          return (
                            <td
                              key={key}
                              className={classNames({active: item.isSelected})}
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
              hours.map((hour, index) => {
                return (
                  <a key={hour || `none-${index}`} className={classNames('item', {disabled: this.isInvalidHour(hour)})}>
                    {hour == null ? '' : `${hour}`.padStart(2, '0')}
                  </a>
                );
              })
            }
          </div>
        </div>
        <div className="col-4">
          <div className="divider"/>
          <div ref={this.clockData.minutesRef} className="item-container">
            {
              minutes.map((minute, index) => {
                return (
                  <a key={minute || `none-${index}`} className={classNames('item', {disabled: this.isInvalidMinute(minute)})}>
                    {minute == null ? '' : `${minute}`.padStart(2, '0')}
                  </a>
                );
              })
            }
          </div>
        </div>
        <div className="col-4">
          <div className="divider"/>
          <div ref={this.clockData.meridiemItemsRef} className="item-container">
            {
              meridiemItems.map((meridiem, index) => {
                return (
                  <a key={meridiem || `none-${index}`} className={classNames('item', {disabled: this.isInvalidMeridiem(meridiem)})}>
                    {meridiem || ''}
                  </a>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  };

  pickerRender = ({
    placement,
    scheduleUpdate,
    arrowProps,
    outOfBoundaries,
    show: _show,
    ...props
  }) => {
    const {isShowRepeatSwitch, dateTabText, timeTabText, onClickInput} = this.props;
    return (
      <div className="datepicker-wrapper">
        <div className="datepicker" {...props}>

          <Tab.Container
            activeKey={this.state.tabKey}
            onSelect={key => this.setTabKey(key)}
          >
            <Nav>
              {dateTabText && (
                <Nav.Item className="flex-fill">
                  <Nav.Link
                    className="text-center ml-0"
                    eventKey="tab-datepicker-date"
                  >
                    {dateTabText}
                  </Nav.Link>
                </Nav.Item>
              )}
              {timeTabText && (
                <Nav.Item className="flex-fill">
                  <Nav.Link
                    className="text-center mr-0"
                    eventKey="tab-datepicker-time"
                    onClick={dateTabText ? this.onSwitchToClock : onClickInput}
                  >
                    {timeTabText}
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="tab-datepicker-date">
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
                {dateTabText && this.calendarRender()}
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="tab-datepicker-time" className={classNames('tab-pane', {'active show': dateTabText === undefined})}>
                {this.clockRender()}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

        </div>
      </div>
    );
  };

  render() {
    const {
      inputProps, field, isShowPicker, onClickInput, onHide, dateTabText, dateFormat, timeTabText, timeFormat
    } = this.props;
    return (
      <>
        <button
          ref={this.inputRef}
          type="button"
          {...inputProps}
          onClick={onClickInput}
        >
          {utils.formatDate(
            field.value,
            dateTabText && timeTabText ? {} :
              dateTabText ? {format: dateFormat} : {format: timeFormat}
          ) || inputProps.placeholder}
        </button>
        <Overlay
          rootClose
          target={this.inputRef.current}
          placement="auto-start"
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
