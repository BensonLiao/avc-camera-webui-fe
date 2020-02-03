const {validator} = require('../../../core/validations');
const NotificationIOOutSettingsSchema = require('webserver-form-schema/notification-io-out-schema');

module.exports = validator.compile({
  pulse: NotificationIOOutSettingsSchema.pulse,
  delay: NotificationIOOutSettingsSchema.delay
});
