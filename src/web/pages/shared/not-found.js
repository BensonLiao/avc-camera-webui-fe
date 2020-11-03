const ErrorPage = require('./error-page');

module.exports = class NotFound extends ErrorPage {
  constructor(props) {
    super(props);
    this.state.status = 404;
    this.state.message = 'Not Found';
  }
};
