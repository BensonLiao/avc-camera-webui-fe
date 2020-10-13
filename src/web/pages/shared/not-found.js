const ErrorPage = require('./error-page');

module.exports = class NotFound extends ErrorPage {
  constructor() {
    super();
    this.state.status = 404;
    this.state.message = 'resource not found';
  }
};
