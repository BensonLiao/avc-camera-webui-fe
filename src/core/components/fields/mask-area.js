const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const Draggable = require('react-draggable').default;
const elementResizeDetectorMaker = require('element-resize-detector');

module.exports = class MaskArea extends React.PureComponent {
  static get propTypes() {
    return {
      parentElementId: PropTypes.string.isRequired,
      className: PropTypes.string,
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
      className: '',
      text: ''
    };
  }

  state = {
    parentSize: {width: 0, height: 0},
    maskAreaDragOffset: {x: 0, y: 0},
    leftTopCornerDragOffset: {x: 0, y: 0},
    leftBottomCornerDragOffset: {x: 0, y: 0},
    rightTopCornerDragOffset: {x: 0, y: 0},
    rightBottomCornerDragOffset: {x: 0, y: 0}
  };

  constructor(props) {
    super(props);
    this.erd = elementResizeDetectorMaker();
    this.draggingCorner = null; // "right-bottom", "right-top", "left-bottom", "left-top"
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

  /**
   * Calculate the mask area style without `maskAreaDragOffset`.
   * @returns {{left: number, top: number, width: number, height: number}}
   */
  calculateMaskAreaPosition = () => {
    const {field, form} = this.props;
    const {
      parentSize,
      leftTopCornerDragOffset,
      leftBottomCornerDragOffset,
      rightTopCornerDragOffset,
      rightBottomCornerDragOffset
    } = this.state;
    const maskAreaStyle = this.convertPercentageToPixel(parentSize, form.initialValues[field.name]);

    maskAreaStyle.left += leftTopCornerDragOffset.x;
    maskAreaStyle.width -= leftTopCornerDragOffset.x;
    maskAreaStyle.top += leftTopCornerDragOffset.y;
    maskAreaStyle.height -= leftTopCornerDragOffset.y;
    maskAreaStyle.left += leftBottomCornerDragOffset.x;
    maskAreaStyle.width -= leftBottomCornerDragOffset.x;
    maskAreaStyle.height += leftBottomCornerDragOffset.y;
    maskAreaStyle.width += rightTopCornerDragOffset.x;
    maskAreaStyle.top += rightTopCornerDragOffset.y;
    maskAreaStyle.height -= rightTopCornerDragOffset.y;
    maskAreaStyle.width += rightBottomCornerDragOffset.x;
    maskAreaStyle.height += rightBottomCornerDragOffset.y;
    return maskAreaStyle;
  };

  generateStartDraggingCornerHandler = corner => () => {
    this.draggingCorner = corner;
  };

  /**
   * @param {string} corner - "right-bottom", "right-top", "left-bottom", "left-top"
   * @returns {function(Event, {x: number, y: number})}
   */
  generateDraggingCornerHandler = corner => (event, data) => {
    switch (corner) {
      case 'right-bottom':
        this.setState({rightBottomCornerDragOffset: {x: data.x, y: data.y}});
        break;
      case 'right-top':
        this.setState({rightTopCornerDragOffset: {x: data.x, y: data.y}});
        break;
      case 'left-bottom':
        this.setState({leftBottomCornerDragOffset: {x: data.x, y: data.y}});
        break;
      case 'left-top':
        this.setState({leftTopCornerDragOffset: {x: data.x, y: data.y}});
        break;
      default:
        throw new Error(`unknown corner ${corner}`);
    }
  };

  onStopDraggingCorner = () => {
    this.draggingCorner = null;
    this.onStopDraggingMaskArea(); // Trigger `form.setFieldValue()`.
  };

  /**
   * @returns {boolean} - If `false` is returned any handler, the action will cancel.
   */
  onStartDraggingMaskArea = () => {
    return this.draggingCorner == null;
  };

  onDraggingMaskArea = (event, data) => {
    this.setState({maskAreaDragOffset: {x: data.x, y: data.y}});
  };

  onStopDraggingMaskArea = () => {
    const {field, form} = this.props;
    const {parentSize, maskAreaDragOffset} = this.state;
    const maskArea = this.calculateMaskAreaPosition();

    maskArea.left += maskAreaDragOffset.x;
    maskArea.top += maskAreaDragOffset.y;
    form.setFieldValue(field.name, this.convertPixelToPercentage(parentSize, maskArea));
  };

  render() {
    const {parentElementId, className, text} = this.props;
    const {
      parentSize,
      maskAreaDragOffset,
      leftTopCornerDragOffset,
      leftBottomCornerDragOffset,
      rightTopCornerDragOffset,
      rightBottomCornerDragOffset
    } = this.state;
    const maskAreaStyle = this.calculateMaskAreaPosition();
    const leftTopCornerOffset = {
      x: maskAreaStyle.left + maskAreaDragOffset.x - leftTopCornerDragOffset.x,
      y: maskAreaStyle.top + maskAreaDragOffset.y - leftTopCornerDragOffset.y
    };
    const leftTopCornerBounds = {
      left: -leftTopCornerOffset.x,
      top: -leftTopCornerOffset.y,
      right: maskAreaStyle.left + maskAreaStyle.width + maskAreaDragOffset.x - 20 - leftTopCornerOffset.x,
      bottom: maskAreaStyle.top + maskAreaStyle.height + maskAreaDragOffset.y - 20 - leftTopCornerOffset.y
    };
    const leftBottomCornerOffset = {
      x: maskAreaStyle.left + maskAreaDragOffset.x - leftBottomCornerDragOffset.x,
      y: maskAreaStyle.top + maskAreaStyle.height + maskAreaDragOffset.y - 10 - leftBottomCornerDragOffset.y
    };
    const leftBottomCornerBounds = {
      left: -leftBottomCornerOffset.x,
      top: -leftBottomCornerOffset.y + maskAreaStyle.top + maskAreaDragOffset.y + 10,
      right: maskAreaStyle.left + maskAreaStyle.width + maskAreaDragOffset.x - 20 - leftBottomCornerOffset.x,
      bottom: parentSize.height - leftBottomCornerOffset.y - 10
    };
    const rightTopCornerOffset = {
      x: maskAreaStyle.left + maskAreaStyle.width + maskAreaDragOffset.x - 10 - rightTopCornerDragOffset.x,
      y: maskAreaStyle.top + maskAreaDragOffset.y - rightTopCornerDragOffset.y
    };
    const rightTopCornerBounds = {
      left: -rightTopCornerOffset.x + maskAreaStyle.left + maskAreaDragOffset.x + 10,
      top: -rightTopCornerOffset.y,
      right: parentSize.width - rightTopCornerOffset.x - 10,
      bottom: maskAreaStyle.top + maskAreaStyle.height + maskAreaDragOffset.y - 20 - rightTopCornerOffset.y
    };
    const rightBottomCornerOffset = {
      x: maskAreaStyle.left + maskAreaStyle.width + maskAreaDragOffset.x - 10 - rightBottomCornerDragOffset.x,
      y: maskAreaStyle.top + maskAreaStyle.height + maskAreaDragOffset.y - 10 - rightBottomCornerDragOffset.y
    };
    const rightBottomCornerBounds = {
      left: -rightBottomCornerOffset.x + maskAreaStyle.left + maskAreaDragOffset.x + 10,
      top: -rightBottomCornerOffset.y + maskAreaStyle.top + maskAreaDragOffset.y + 10,
      right: parentSize.width - rightBottomCornerOffset.x - 10,
      bottom: parentSize.height - rightBottomCornerOffset.y - 10
    };

    return (
      <div className={classNames('draggable-wrapper', className)}>
        <Draggable
          bounds={`#${parentElementId}`}
          onStart={this.onStartDraggingMaskArea}
          onDrag={this.onDraggingMaskArea}
          onStop={this.onStopDraggingMaskArea}
        >
          <div className="draggable-cover" style={maskAreaStyle}>
            <p className="description text-size-16">{text}</p>
          </div>
        </Draggable>
        <Draggable
          bounds={leftTopCornerBounds}
          positionOffset={leftTopCornerOffset}
          onStart={this.generateStartDraggingCornerHandler('left-top')}
          onDrag={this.generateDraggingCornerHandler('left-top')}
          onStop={this.onStopDraggingCorner}
        >
          <div className="left-top-point" style={{left: 0, top: 0}}/>
        </Draggable>
        <Draggable
          bounds={leftBottomCornerBounds}
          positionOffset={leftBottomCornerOffset}
          onStart={this.generateStartDraggingCornerHandler('left-bottom')}
          onDrag={this.generateDraggingCornerHandler('left-bottom')}
          onStop={this.onStopDraggingCorner}
        >
          <div className="left-bottom-point" style={{left: 0, top: 0}}/>
        </Draggable>
        <Draggable
          bounds={rightTopCornerBounds}
          positionOffset={rightTopCornerOffset}
          onStart={this.generateStartDraggingCornerHandler('right-top')}
          onDrag={this.generateDraggingCornerHandler('right-top')}
          onStop={this.onStopDraggingCorner}
        >
          <div className="right-top-point" style={{left: 0, top: 0}}/>
        </Draggable>
        <Draggable
          bounds={rightBottomCornerBounds}
          positionOffset={rightBottomCornerOffset}
          onStart={this.generateStartDraggingCornerHandler('right-bottom')}
          onDrag={this.generateDraggingCornerHandler('right-bottom')}
          onStop={this.onStopDraggingCorner}
        >
          <div className="right-bottom-point" style={{left: 0, top: 0}}/>
        </Draggable>
      </div>
    );
  }
};
