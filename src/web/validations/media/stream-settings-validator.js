const {validator} = require('../../../core/validations');
const StreamSettingsSchema = require('webserver-form-schema/stream-settings-schema');

module.exports = validator.compile({
  format: StreamSettingsSchema.format,
  resolution: StreamSettingsSchema.resolution,
  frameRate: StreamSettingsSchema.frameRate,
  vbrBitRateLevel: StreamSettingsSchema.vbrBitRateLevel,
  vbrMaxBitRate: StreamSettingsSchema.vbrMaxBitRate,
  cbrBitRate: StreamSettingsSchema.cbrBitRate,
  gov: StreamSettingsSchema.gov,
  bandwidthManagement: StreamSettingsSchema.bandwidthManagement
});
