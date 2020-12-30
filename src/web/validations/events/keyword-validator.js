const {validator} = require('../../../core/validations');
const EventSchema = require('webserver-form-schema/event-schema');

module.exports = validator.compile({keyword: EventSchema.keyword});
