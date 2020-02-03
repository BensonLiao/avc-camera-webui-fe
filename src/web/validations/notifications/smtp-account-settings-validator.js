const {validator} = require('../../../core/validations');
const NotificationSMTPSettingsSchema = require('webserver-form-schema/notification-smtp-settings-schema');

module.exports = validator.compile({
  account: NotificationSMTPSettingsSchema.account,
  password: NotificationSMTPSettingsSchema.password
});
