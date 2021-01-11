const {validator} = require('../../../core/validations');
const DeviceSyncSchema = require('webserver-form-schema/device-sync-schema');

module.exports = validator.compile({
  ip: DeviceSyncSchema.ip,
  port: DeviceSyncSchema.port,
  account: DeviceSyncSchema.account,
  password: DeviceSyncSchema.password
});
