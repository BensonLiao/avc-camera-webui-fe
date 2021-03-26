const {validator} = require('../../../core/validations');
const SDSettingsSchema = require('webserver-form-schema/sd-settings-schema');

module.exports = validator.compile({snapshotMaxNumber: SDSettingsSchema.snapshotMaxNumber});
