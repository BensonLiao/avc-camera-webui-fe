const {validator} = require('../../../core/validations');
const NotificationSMTPSettingsSchema = require('webserver-form-schema/notification-smtp-settings-schema');

module.exports = validator.compile({
  host: NotificationSMTPSettingsSchema.host,
  senderName: NotificationSMTPSettingsSchema.senderName,
  senderEmail: NotificationSMTPSettingsSchema.senderEmail,
  interval: NotificationSMTPSettingsSchema.interval
});
