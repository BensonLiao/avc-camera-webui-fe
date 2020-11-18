const classNames = require('classnames');
const {Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const NotificationCardSchema = require('webserver-form-schema/notification-card-schema');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationEmailAttachmentType = require('webserver-form-schema/constants/notification-email-attachment-type');
const NotificationEmailContentPosition = require('webserver-form-schema/constants/notification-email-content-position');
const {PRECISE_EMAIL_PATTERN} = require('../../../core/constants');
const i18n = require('../../../i18n').default;
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
      touched: PropTypes.object.isRequired
    };
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
       if (!PRECISE_EMAIL_PATTERN.test(values.$email)) {
         return i18n.t('Invalid email address.');
       }

       if (values.emails.length >= NotificationCardSchema.emails.max) {
         return i18n.t('The maximum number of recipients is 64.');
       }

       return utils.duplicateCheck(values.emails, values.$email, i18n.t('Duplicate email address.'));
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
           <label className="mb-0">{i18n.t('I/O')}</label>
           <div className="custom-control custom-switch">
             <Field name="isEnableGPIO" type="checkbox" className="custom-control-input" id="switch-notification-target-io"/>
             <label className="custom-control-label" htmlFor="switch-notification-target-io">
               <span>{i18n.t('ON')}</span>
               <span>{i18n.t('OFF')}</span>
             </label>
           </div>
         </div>
         <div className={classNames('form-group', values.isEnableGPIO ? '' : 'd-none')}>
           <div className="card">
             <div className="card-body">
               <div className="form-group d-flex justify-content-between align-items-center">
                 <label className="mb-0">{i18n.t('Output {{0}}', {0: '1'})}</label>
                 <div className="custom-control custom-switch">
                   <Field name="isEnableGPIO1" type="checkbox" className="custom-control-input" id="switch-notification-target-output-1"/>
                   <label className="custom-control-label" htmlFor="switch-notification-target-output-1">
                     <span>{i18n.t('ON')}</span>
                     <span>{i18n.t('OFF')}</span>
                   </label>
                 </div>
               </div>
               <div className="d-flex justify-content-between align-items-center">
                 <label className="mb-0">{i18n.t('Output {{0}}', {0: '2'})}</label>
                 <div className="custom-control custom-switch">
                   <Field name="isEnableGPIO2" type="checkbox" className="custom-control-input" id="switch-notification-target-output-2"/>
                   <label className="custom-control-label" htmlFor="switch-notification-target-output-2">
                     <span>{i18n.t('ON')}</span>
                     <span>{i18n.t('OFF')}</span>
                   </label>
                 </div>
               </div>
             </div>
           </div>
         </div>
         <hr/>
         {/* E-mail Notification */}
         <div className="form-group d-flex justify-content-between align-items-center">
           <label className="mb-0">{i18n.t('Email')}</label>
           <div className="custom-control custom-switch">
             <Field name="isEnableEmail" type="checkbox" className="custom-control-input" id="switch-notification-target-mail"/>
             <label className="custom-control-label" htmlFor="switch-notification-target-mail">
               <span>{i18n.t('ON')}</span>
               <span>{i18n.t('OFF')}</span>
             </label>
           </div>
         </div>
         <div className="form-group">
           <div className="card">
             <div className="card-body">
               <SelectField
                 hide={values.type === NotificationCardType.digitalInput}
                 labelName={i18n.t('Email Attachment')}
                 labelClassName="text-size-16 mb-3"
                 name="emailAttachmentType"
               >
                 {NotificationEmailAttachmentType.all().map(attachmentType => (
                   !(values.type === NotificationCardType.motionDetection && attachmentType === NotificationEmailAttachmentType.faceThumbnail) && (
                     <option
                       key={attachmentType}
                       value={attachmentType}
                     >{i18n.t(`email-attachment-type-${attachmentType}`)}
                     </option>
                   )
                 ))}
               </SelectField>
               <hr className={classNames({'d-none': values.type === NotificationCardType.digitalInput})}/>
               <div className="form-group mb-4">
                 <label className="text-size-16">{i18n.t('Subject :')}</label>
                 <Field
                   name="senderSubject"
                   type="text"
                   className="form-control"
                   maxLength={NotificationCardSchema.senderSubject.max}
                   placeholder={i18n.t('Specify the subject')}
                 />
               </div>
               <div className="form-group mb-4">
                 <label className="text-size-16">{i18n.t('Content :')}</label>
                 <Field
                   name="senderContent"
                   type="text"
                   className="form-control"
                   maxLength={NotificationCardSchema.senderContent.max}
                   placeholder={i18n.t('Add your message')}
                 />
               </div>
               <div className="form-group mb-4">
                 <SelectField
                   labelName={i18n.t('Content Placement')}
                   labelClassName="text-size-16"
                   name="emailContentPosition"
                 >
                   {NotificationEmailContentPosition.all().map(position => (
                     <option
                       key={position}
                       value={position}
                     >{i18n.t(`email-content-position-${position}`)}
                     </option>
                   ))}
                 </SelectField>
               </div>
               <div className="form-group mb-3">
                 <label className="text-size-16 mb-0">{i18n.t('Receiver')} :</label>
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
                         placeholder={i18n.t('Enter email address')}
                       />
                     </div>
                   </div>
                   <CustomTooltip show={!values.$email} title={i18n.t('Please enter an email address.')}>
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
                     <div
                       key={key}
                       className="border border-primary rounded-pill text-primary d-flex justify-content-between align-items-center filter-item mb-3"
                     >
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
