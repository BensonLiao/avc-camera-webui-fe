const {validator} = require('../../../core/validations');
const DeviceSyncScheduleSchema = require('webserver-form-schema/device-sync-schedule-schema');

module.exports = validator.compile({
  interval: DeviceSyncScheduleSchema.interval,
  deviceList: DeviceSyncScheduleSchema.deviceList
});
