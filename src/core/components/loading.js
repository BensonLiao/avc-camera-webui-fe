const React = require('react');

module.exports = class Loading extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <p className="text-center text-muted py-5 h3">
        <i className="fas fa-spinner fa-pulse fa-fw"/> Loading...
      </p>
    );
  }
};
