const {validator} = require('../../../core/validations');
const NotificationAppSettingsSchema = require('webserver-form-schema/notification-app-settings-schema');

module.exports = validator.compile({
  deviceToken: NotificationAppSettingsSchema.deviceToken,
  deviceId: NotificationAppSettingsSchema.deviceId,
  interval: NotificationAppSettingsSchema.interval
});
