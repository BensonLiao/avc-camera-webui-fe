
const {validator} = require('../../../core/validations');
const HttpSettingsSchema = require('webserver-form-schema/http-settings-schema');

module.exports = validator.compile({port: HttpSettingsSchema.port});
