const React = require('react');
const PropTypes = require('prop-types');
const $ = require('jquery');

module.exports = class Tooltip extends React.PureComponent {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
      delay: PropTypes.any,
      offset: PropTypes.any,
      boundary: PropTypes.oneOf(['viewport', 'window', 'scrollParent']),
      children: PropTypes.any.isRequired
    };
  }

  static get defaultProps() {
    return {
      placement: 'top',
      delay: 0,
      offset: 0,
      boundary: 'scrollParent'
    };
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    $(this.ref.current).tooltip({
      title: this.props.title,
      placement: this.props.placement,
      delay: this.props.delay,
      offset: this.props.offset,
      boundary: this.props.boundary
    });
  }

  componentDidUpdate() {
    this.componentWillUnmount();
    this.componentDidMount();
  }

  componentWillUnmount() {
    $(this.ref.current).tooltip('dispose');
  }

  render() {
    return <span ref={this.ref}>{this.props.children}</span>;
  }
};
