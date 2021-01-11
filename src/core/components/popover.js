const React = require('react');
const PropTypes = require('prop-types');
const OverlayTrigger = require('react-bootstrap/OverlayTrigger').default;
const Popover = require('react-bootstrap/Popover').default;

module.exports = class CustomPopover extends React.PureComponent {
  static get propTypes() {
    return {
      title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      content: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      placement: PropTypes.oneOf([
        'auto-start',
        'auto',
        'auto-end',
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-end',
        'bottom',
        'bottom-start',
        'left-end',
        'left',
        'left-start'
      ]),
      delay: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      children: PropTypes.element.isRequired
    };
  }

  static get defaultProps() {
    return {
      placement: 'top',
      delay: {
        show: 250,
        hide: 0
      }
    };
  }

  render() {
    const {placement, delay, title, content, children} = this.props;
    const popover = (
      <Popover id={`popover-${title}`}>
        <Popover.Title as="h4">{title}</Popover.Title>
        <Popover.Content>
          {content}
        </Popover.Content>
      </Popover>
    );
    return (
      <OverlayTrigger
        rootClose
        placement={placement}
        delay={delay}
        trigger="hover"
        overlay={popover}
      >
        {children}
      </OverlayTrigger>
    );
  }
};
