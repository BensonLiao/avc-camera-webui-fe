const {validator} = require('../../../core/validations');
const RTSPSettingsSchema = require('webserver-form-schema/rtsp-settings-schema');

module.exports = validator.compile({
  tcpPort: RTSPSettingsSchema.tcpPort,
  udpPort: RTSPSettingsSchema.udpPort,
  connectionLimit: RTSPSettingsSchema.connectionLimit
});
