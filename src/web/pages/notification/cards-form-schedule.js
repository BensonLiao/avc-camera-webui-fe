const classNames = require('classnames');
const {Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const i18n = require('../../../i18n').default;
const CustomTooltip = require('../../../core/components/tooltip');
const DateTimePicker = require('../../../core/components/fields/datetime-picker');
const utils = require('../../../core/utils');

module.exports = class CardsFormSchedule extends React.PureComponent {
  static get propTypes() {
    return {
      values: PropTypes.shape({
        isEnableTime: PropTypes.bool.isRequired,
        $start: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
        $end: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.instanceOf(Date)]),
        timePeriods: PropTypes.array.isRequired
      }).isRequired,
      setFieldValue: PropTypes.func.isRequired
    };
  }

  state = {
    isShowStartDatePicker: false,
    isShowEndDatePicker: false
  };

  toggleStartDatePicker = () => this.setState(prevState => ({
    isShowStartDatePicker: !prevState.isShowStartDatePicker,
    isShowEndDatePicker: false
  }));

  toggleEndDatePicker = () => this.setState(prevState => ({
    isShowEndDatePicker: !prevState.isShowEndDatePicker,
    isShowStartDatePicker: false
  }));

  onHideStartDatePicker = () => this.setState({isShowStartDatePicker: false});

  onHideEndDatePicker = () => this.setState({isShowEndDatePicker: false});

   onClickAddTimePeriod = event => {
     const {values, setFieldValue} = this.props;
     event.preventDefault();
     const timePeriods = [...values.timePeriods];
     timePeriods.push({
       id: Math.random().toString(36).substr(2),
       start: values.$start,
       end: values.$end,
       isRepeat: false
     });
     setFieldValue('timePeriods', timePeriods);
     setFieldValue('$start', null);
     setFieldValue('$end', null);
   };

   generateDeleteTimePeriodHandler = index => event => {
     const {values, setFieldValue} = this.props;
     event.preventDefault();
     const timePeriods = [...values.timePeriods];
     timePeriods.splice(index, 1);
     setFieldValue('timePeriods', timePeriods);
   };

   render() {
     const {values} = this.props;
     const {isShowStartDatePicker, isShowEndDatePicker} = this.state;
     return (
       <>
         {/* face-recognition */}
         <div className="form-group d-flex justify-content-between align-items-center">
           <label className="mb-0">{i18n.t('Enable Schedule')}</label>
           <div className="custom-control custom-switch">
             <Field name="isEnableTime" checked={values.isEnableTime} type="checkbox" className="custom-control-input" id="switch-notification-time"/>
             <label className="custom-control-label" htmlFor="switch-notification-time">
               <span>{i18n.t('ON')}</span>
               <span>{i18n.t('OFF')}</span>
             </label>
           </div>
         </div>
         <div className="form-group pl-4 datepicker-wrapper">
           <div className="form-row">
             <div className="col-auto my-1 btn-group datepicker-group">
               <Field
                 name="$start"
                 component={DateTimePicker}
                 dateTabText={i18n.t('Start Date')}
                 timeTabText={i18n.t('Start Time')}
                 inputProps={{
                   className: classNames(
                     'btn start-date px-4',
                     {active: isShowStartDatePicker}
                   ),
                   placeholder: i18n.t('Start Datetime'),
                   style: {whiteSpace: 'nowrap'}
                 }}
                 endDateFieldName="$end"
                 isShowPicker={isShowStartDatePicker}
                 onClickInput={this.toggleStartDatePicker}
                 onHide={this.onHideStartDatePicker}
               />
               <Field
                 name="$end"
                 component={DateTimePicker}
                 dateTabText={i18n.t('End Date')}
                 timeTabText={i18n.t('End Time')}
                 inputProps={{
                   className: classNames(
                     'btn end-date px-4',
                     {active: isShowEndDatePicker}
                   ),
                   placeholder: i18n.t('End Datetime'),
                   style: {whiteSpace: 'nowrap'}
                 }}
                 startDateFieldName="$start"
                 isShowPicker={isShowEndDatePicker}
                 onClickInput={this.toggleEndDatePicker}
                 onHide={this.onHideEndDatePicker}
               />
             </div>
             {(() => {
               let statusCheck = !values.$start || !values.$end || values.timePeriods.length >= 5;
               return (
                 <CustomTooltip
                   show={statusCheck}
                   title={values.timePeriods.length >= 5 ? i18n.t('The maximum number of allowed schedules is 5.') : i18n.t('Please enter start and end time.')}
                 >
                   <div className="col-auto my-1">
                     <button
                       disabled={statusCheck}
                       className="btn btn-primary rounded-circle"
                       type="button"
                       style={statusCheck ? {pointerEvents: 'none'} : {}}
                       onClick={this.onClickAddTimePeriod}
                     >
                       <i className="fas fa-plus"/>
                     </button>
                   </div>
                 </CustomTooltip>
               );
             })()}
           </div>
           {
             values.timePeriods.map((timePeriod, index) => (
               <div key={timePeriod.id} className="form-row my-3">
                 <div className="col-12">
                   <div className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item">
                     <div>
                       {`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}
                     </div>
                     <a href="#" onClick={this.generateDeleteTimePeriodHandler(index)}><i className="fas fa-times-circle fa-lg"/></a>
                   </div>
                 </div>
               </div>
             ))
           }
         </div>
       </>
     );
   }
};
