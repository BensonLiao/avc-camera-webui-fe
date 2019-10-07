const {validator} = require('../../../core/validations');
const GroupSchema = require('webserver-form-schema/group-schema');

module.exports = validator.compile({
  name: GroupSchema.name,
  note: GroupSchema.note
});
