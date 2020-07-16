const classNames = require('classnames');
const {Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const {NOTIFY_CARDS_EMAIL_MAX} = require('../../../core/constants');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const CustomTooltip = require('../../../core/components/tooltip');
const SelectField = require('../../../core/components/fields/select-field');

module.exports = class CardsFormSubject extends React.PureComponent {
  static get propTypes() {
    return {
      values: PropTypes.shape({
        type: PropTypes.string.isRequired,
        isEnableGPIO: PropTypes.bool.isRequired,
        $email: PropTypes.string.isRequired,
        emails: PropTypes.array.isRequired
      }).isRequired,
      setFieldValue: PropTypes.func.isRequired,
      validateField: PropTypes.func.isRequired,
      errors: PropTypes.object.isRequired,
      touched: PropTypes.object.isRequired};
  }

    onClickAddEmail = event => {
      const {setFieldValue, values, validateField} = this.props;
      event.preventDefault();
      validateField('$email').then(value => {
        if (!value) {
          const emails = [...values.emails];
          emails.push(values.$email);
          setFieldValue('emails', emails);
          setFieldValue('$email', '');
        }
      });
    };

   validateEmail = () => {
     const {values} = this.props;
     if (values.$email) {
       if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.$email)) {
         return _('Invalid email address');
       }

       const emails = [...values.emails];
       if (emails.length > NOTIFY_CARDS_EMAIL_MAX - 1) {
         return _('Number of receiver E-mails limit is 64');
       }

       return utils.duplicateCheck(emails, values.$email, _('Duplicate E-mail found'));
     }
   };

   generateDeleteEmailHandler = index => event => {
     const {setFieldValue, values} = this.props;
     event.preventDefault();
     const emails = [...values.emails];
     emails.splice(index, 1);
     setFieldValue('emails', emails);
   };

   render() {
     const {values, errors, touched} = this.props;
     return (
       <>
         {/* I/O Notification */}
         <div className="form-group d-flex justify-content-between align-items-center">
           <label className="mb-0">I/O</label>
           <div className="custom-control custom-switch">
             <Field name="isEnableGPIO" type="checkbox" className="custom-control-input" id="switch-notification-target-io"/>
             <label className="custom-control-label" htmlFor="switch-notification-target-io">
               <span>{_('ON')}</span>
               <span>{_('OFF')}</span>
             </label>
           </div>
         </div>
         <div className={classNames('form-group', values.isEnableGPIO ? '' : 'd-none')}>
           <div className="card">
             <div className="card-body">
               <div className="form-group d-flex justify-content-between align-items-center">
                 <label className="mb-0">{_('Output {0}', ['1'])}</label>
                 <div className="custom-control custom-switch">
                   <Field name="isEnableGPIO1" type="checkbox" className="custom-control-input" id="switch-notification-target-output-1"/>
                   <label className="custom-control-label" htmlFor="switch-notification-target-output-1">
                     <span>{_('ON')}</span>
                     <span>{_('OFF')}</span>
                   </label>
                 </div>
               </div>
               <div className="d-flex justify-content-between align-items-center">
                 <label className="mb-0">{_('Output {0}', ['2'])}</label>
                 <div className="custom-control custom-switch">
                   <Field name="isEnableGPIO2" type="checkbox" className="custom-control-input" id="switch-notification-target-output-2"/>
                   <label className="custom-control-label" htmlFor="switch-notification-target-output-2">
                     <span>{_('ON')}</span>
                     <span>{_('OFF')}</span>
                   </label>
                 </div>
               </div>
             </div>
           </div>
         </div>
         <hr/>
         {/* E-mail Notification */}
         <div className="form-group d-flex justify-content-between align-items-center">
           <label className="mb-0">{_('Email')}</label>
           <div className="custom-control custom-switch">
             <Field name="isEnableEmail" type="checkbox" className="custom-control-input" id="switch-notification-target-mail"/>
             <label className="custom-control-label" htmlFor="switch-notification-target-mail">
               <span>{_('ON')}</span>
               <span>{_('OFF')}</span>
             </label>
           </div>
         </div>
         <div className="form-group">
           <div className="card">
             <div className="card-body">
               <SelectField hide={values.type === NotificationCardType.digitalInput} labelName={_('Email Attachment')} labelClassName="text-size-16 mb-3" name="emailAttachmentType">
                 {NotificationEmailAttachmentType.all().map(attachmentType => (
                   !(values.type === NotificationCardType.motionDetection && attachmentType === NotificationEmailAttachmentType.faceThumbnail) && (
                     <option
                       key={attachmentType}
                       value={attachmentType}
                     >{_(`email-attachment-type-${attachmentType}`)}
                     </option>)
                 ))}
               </SelectField>
               <hr/>
               <div className="form-group mb-4">
                 <label className="text-size-16">Subject :</label>
                 <Field
                   name="senderSubject"
                   type="text"
                   className="form-control"
                   placeholder={_('Specify the subject of notification emails.')}/>
               </div>
               <div className="form-group mb-4">
                 <label className="text-size-16">Content :</label>
                 <Field
                   name="senderContent"
                   type="text"
                   className="form-control"
                   placeholder={_('Append your message to notification emails.')}/>
               </div>
               <div className="form-group mb-3">
                 <label className="text-size-16 mb-0">{_('Receiver')} :</label>
                 <div className="form-row">
                   <div className="col-auto my-1">
                     <div className="input-group">
                       <div className="input-group-prepend">
                         <span
                           className="input-group-text"
                           style={{borderColor: (errors.$email && touched.$email) && '#dc3545'}}
                         >
                           <i className="fas fa-envelope"/>
                         </span>
                       </div>
                       <Field
                         name="$email"
                         type="text"
                         className={classNames('form-control', 'notification-email', {'is-invalid': errors.$email && touched.$email})}
                         validate={this.validateEmail}
                         placeholder={_('Enter email address')}/>
                     </div>
                   </div>
                   <CustomTooltip show={!values.$email} title={_('Please Enter an Email Address')}>
                     <div className="col-auto my-1">
                       <button
                         disabled={!values.$email}
                         style={values.$email ? {} : {pointerEvents: 'none'}}

                         type="button"
                         className="btn btn-primary rounded-circle"
                         onClick={this.onClickAddEmail}
                       >
                         <i className="fas fa-plus"/>
                       </button>
                     </div>
                   </CustomTooltip>
                 </div>
                 <div className={classNames({'is-invalid': errors.$email && touched.$email})}>
                   {
                     errors.$email && touched.$email && (
                       <div
                         style={{display: (errors.$email && touched.$email) && 'block'}}
                         className="invalid-feedback form-row"
                       >
                         {errors.$email}
                       </div>
                     )
                   }
                 </div>
               </div>
               {
                 values.emails.map((email, index) => {
                   const key = `${index}${email}`;
                   return (
                     <div key={key} className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item mb-3">
                       <div>{email}</div>
                       <a href="#" onClick={this.generateDeleteEmailHandler(index)}>
                         <i className="fas fa-times-circle fa-lg"/>
                       </a>
                     </div>
                   );
                 })
               }
             </div>
           </div>
         </div>
       </>
     );
   }
};
