const {validator} = require('../../../core/validations');
const NotificationCardSchema = require('webserver-form-schema/notification-card-schema');

module.exports = validator.compile({hdCapacity: NotificationCardSchema.hdCapacity});
