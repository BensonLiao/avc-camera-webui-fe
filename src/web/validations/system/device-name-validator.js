const {validator} = require('../../../core/validations');
const DeviceNameSchema = require('webserver-form-schema/device-name-schema');

module.exports = validator.compile(DeviceNameSchema);
