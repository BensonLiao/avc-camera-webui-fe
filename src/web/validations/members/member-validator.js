const {validator} = require('../../../core/validations');
const MemberSchema = require('webserver-form-schema/member-schema');

module.exports = validator.compile({
  name: MemberSchema.name,
  organization: MemberSchema.organization,
  note: MemberSchema.note
});
