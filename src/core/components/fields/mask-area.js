const PropTypes = require('prop-types');
const React = require('react');
const Draggable = require('react-draggable').default;
const elementResizeDetectorMaker = require('element-resize-detector');

module.exports = class MaskArea extends React.PureComponent {
  static get propTypes() {
    return {
      parentElementId: PropTypes.string.isRequired,
      text: PropTypes.string,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.shape({
          x: PropTypes.number.isRequired, // The left in percentage.
          y: PropTypes.number.isRequired, // The top in percentage.
          width: PropTypes.number.isRequired, // The width in percentage.
          height: PropTypes.number.isRequired // The height in percentage.
        }).isRequired
      }).isRequired,
      form: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired,
        initialValues: PropTypes.object.isRequired
      }).isRequired
    };
  }

  static get defaultProps() {
    return {
      text: ''
    };
  }

  state = {
    parentSize: {
      width: 0,
      height: 0
    }
  };

  constructor(props) {
    super(props);
    this.erd = elementResizeDetectorMaker();
  }

  componentDidMount() {
    this.erd.listenTo(
      document.getElementById(this.props.parentElementId),
      element => {
        this.setState({
          parentSize: {
            width: element.offsetWidth,
            height: element.offsetHeight
          }
        });
      }
    );
  }

  componentWillUnmount() {
    this.erd.uninstall(document.getElementById(this.props.parentElementId));
  }

  /**
   * @param {{width: number, height: number}} parentSize
   * @param {{x: number, y: number, width: number, height: number}} position
   * @returns {{left: number, top: number, width: number, height: number}} - The style.
   */
  convertPercentageToPixel = (parentSize, position) => {
    return {
      left: Math.round(parentSize.width * position.x / 100),
      top: Math.round(parentSize.height * position.y / 100),
      width: Math.round(parentSize.width * position.width / 100),
      height: Math.round(parentSize.height * position.height / 100)
    };
  };

  /**
   * @param {{width: number, height: number}} parentSize
   * @param {{left: number, top: number, width: number, height: number}} position
   * @returns {{x: number, width: number, y: number, height: number}} - The position.
   */
  convertPixelToPercentage = (parentSize, position) => {
    return {
      x: Math.round(position.left / parentSize.width * 100),
      y: Math.round(position.top / parentSize.height * 100),
      width: Math.round(position.width / parentSize.width * 100),
      height: Math.round(position.height / parentSize.height * 100)
    };
  };

  onStopDraggingMaskArea = (event, data) => {
    const {field, form} = this.props;
    const {parentSize} = this.state;
    const initialStyle = this.convertPercentageToPixel(parentSize, form.initialValues[field.name]);
    const value = this.convertPixelToPercentage(parentSize, {
      left: initialStyle.left + data.x,
      top: initialStyle.top + data.y,
      width: initialStyle.width,
      height: initialStyle.height
    });

    form.setFieldValue(field.name, value);
  };

  render() {
    const {parentElementId, text, field, form} = this.props;
    const {parentSize} = this.state;
    const initialStyle = this.convertPercentageToPixel(parentSize, form.initialValues[field.name]);

    return (
      <Draggable bounds={`#${parentElementId}`} onStop={this.onStopDraggingMaskArea}>
        <div className="draggable-cover border-green" style={initialStyle}>
          <p className="description text-size-16">{text}</p>
          <div className="left-top-point"/>
          <div className="left-bottom-point"/>
          <div className="right-top-point"/>
          <div className="right-bottom-point"/>
        </div>
      </Draggable>
    );
  }
};
