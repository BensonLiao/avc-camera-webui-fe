const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const OverlayTrigger = require('react-bootstrap/OverlayTrigger').default;
const Tooltip = require('react-bootstrap/Tooltip').default;

module.exports = class CustomTooltip extends React.PureComponent {
  static get propTypes() {
    return {
      title: PropTypes.string,
      placement: PropTypes.oneOf(['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']),
      delay: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      children: PropTypes.element.isRequired
    };
  }

  static get defaultProps() {
    return {
      title: null,
      placement: 'top',
      delay: {show: 250, hide: 0}
    };
  }

  render() {
    const {title, placement, delay, children} = this.props;
    return (
      <OverlayTrigger
        placement={placement}
        delay={delay}
        popperConfig={{
          modifiers: {
            preventOverflow: {
              boundariesElement: 'window'
            }
          }
        }}
        overlay={<Tooltip className={classNames({'d-none': !title})}>{title}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    );
  }
};
