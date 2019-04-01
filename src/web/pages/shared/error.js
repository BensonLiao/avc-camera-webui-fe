const React = require('react');
const PropTypes = require('prop-types');

module.exports = class ErrorPage extends React.Component {
  static get propTypes() {
    return {
      error: PropTypes.object // {Error}
    };
  }

  static get defaultProps() {
    return {
      error: null
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: {
        status: 500,
        message: 'server error'
      }
    };
    if (props.error && props.error.response) {
      if (props.error.response.status) {
        this.state.error.status = props.error.response.status;
      }

      if (props.error.response.data && props.error.response.data.message) {
        this.state.error.message = props.error.response.data.message;
      }
    }
  }

  componentWillMount() {
    document.title = 'Error';
  }

  render() {
    return (
      // eslint-disable-next-line react/jsx-fragments
      <React.Fragment>
        <div className="warning">!</div>
        <div className="status_background">
          <div className="status">{this.state.error.status}</div>
          <div className="exception">{this.state.error.message}</div>
        </div>
      </React.Fragment>
    );
  }
};
