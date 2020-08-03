const React = require('react');
const PropTypes = require('prop-types');

module.exports = class OneTimeRender extends React.Component {
  static get propTypes() {
    return {children: PropTypes.any.isRequired};
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <>{this.props.children}</>;
  }
};
