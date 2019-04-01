const ErrorPage = require('./error');

module.exports = class NotFound extends ErrorPage {
  constructor(props) {
    super(props);
    this.state.error.status = 404;
    this.state.error.message = 'resource not found';
  }
};
