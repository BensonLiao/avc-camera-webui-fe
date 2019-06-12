const React = require('react');
const PropTypes = require('prop-types');
const _ = require('../../../languages');

module.exports = class ErrorPage extends React.Component {
  static get propTypes() {
    return {error: PropTypes.any};
  }

  static get defaultProps() {
    return {error: 'Error'};
  }

  constructor(props) {
    super(props);
    document.title = `${_('Error')} - [Camera name] Web-Manager`;
    this.state = {
      status: props.error.status || '',
      message: props.error.message ? props.error.message : `${props.error}`
    };
  }

  render() {
    return (
      <>
        <h2 className="text-center">{this.state.status}</h2>
        <p className="text-center">{this.state.message}</p>
      </>
    );
  }
};
