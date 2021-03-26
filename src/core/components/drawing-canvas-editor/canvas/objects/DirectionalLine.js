import {fabric} from 'fabric';
import swapIcon from '../../styles/resource/swapIcon';
import {objectOption} from '../constants/defaults';

function renderSwapControl(ctx, left, top, styleOverride, fabricObject) {
  const img = document.createElement('img');
  img.src = swapIcon;

  let size;
  const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize;
  const ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize;
  const transparentCorners = typeof styleOverride.transparentCorners === 'undefined' ?
    this.transparentCorners : styleOverride.transparentCorners;
  const methodName = transparentCorners ? 'stroke' : 'fill';
  const stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
  let myLeft = left;
  let myTop = top;
  ctx.save();
  ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
  ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
  // as soon as fabric react v5, remove ie11, use proper ellipse code.
  if (xSize > ySize) {
    size = xSize;
    ctx.scale(1.0, ySize / xSize);
    myTop = top * xSize / ySize;
  } else if (ySize > xSize) {
    size = ySize;
    ctx.scale(xSize / ySize, 1.0);
    myLeft = left * ySize / xSize;
  } else {
    size = xSize;
  }

  // this is still wrong
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(myLeft, myTop, size / 2, 0, 2 * Math.PI, false);
  ctx[methodName]();
  if (stroke) {
    ctx.stroke();
  }

  // render swap icon image
  const iconSize = size * 1.5;
  ctx.translate(left, top);
  ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
  ctx.restore();
}

const DirectionalLineControlMT = new fabric.Control({
  x: fabric.Object.prototype.controls.mtr.x,
  y: fabric.Object.prototype.controls.mtr.y / 2,
  offsetY: fabric.Object.prototype.controls.mtr.offsetY / 2,
  cursorStyle: 'pointer',
  actionName: 'swapDirection',
  render: renderSwapControl
});

const DirectionalLine = fabric.util.createClass(fabric.Line, {
  type: 'directionalLine',
  superType: 'drawing',
  initialize(points, options) {
    if (!points) {
      const {x1, x2, y1, y2} = options;
      points = [x1, y1, x2, y2];
    }

    this.minLen = options.minLen || 50; // minimum length of the line, we need to set this thing in px now

    const a = new fabric.Point(points[0], points[1]);
    const b = new fabric.Point(points[2], points[3]);
    // find this line's vector
    const vectorB = b.subtract(a);
    // find angle between line's vector and x axis
    let angleRad = Math.atan2(vectorB.y, vectorB.x);
    if (angleRad < 0) {
      angleRad = (2 * Math.PI) + angleRad;
    }

    const angleDeg = fabric.util.radiansToDegrees(angleRad);
    // find initial horizontal position by rotating the tip back
    const c = fabric.util.rotatePoint(b.clone(), a, -angleRad);
    options = options || {};
    // finally, initialize using transform points to make a horizontal line
    this.callSuper('initialize', [a.x, a.y, c.x, c.y], {
      noScaleCache: false, // false to force cache update while scaling (doesn't redraw parts of line otherwise)
      selectable: true,
      evented: true, // true because you want to select line on click
      // minScaleLimit: 0.25, // has no effect now because we're resetting scale on each scale event
      lockRotation: false,
      hasRotatingPoint: false, // to disable rotation control
      centeredRotation: false,
      centeredScaling: false,

      originX: 'left', // origin of rotation/transformation.
      originY: 'bottom', // origin of rotation/transformation.

      lockMovementX: true,
      lockMovementY: true,
      lockScalingFlip: true,
      lockScalingX: false,
      lockScalingY: false,
      lockSkewingX: false,
      lockSkewingY: false,
      lockUniScaling: true,
      ...options,
      angle: angleDeg // note that we use the calculated angle no matter what
    });

    this.setControlsVisibility({
      tr: false,
      tl: false,
      bl: false,
      br: false,
      // middle top
      // mt: false,
      // midle bottom
      mb: false
      // middle left
      // ml: false
      // middle top right (the rotation control)
      // mtr: false
      // middle right
      // mr: false
    });

    // Disables group selection.
    // this.on('selection:created', e => {
    //   if (e.target.type === 'activeSelection') {
    //     this.canvas.discardActiveObject();
    //   } else {
    //     // do nothing
    //   }
    // });

    // Keeps objects inside canvas. undos move/rotate/scale out of canvas.
    // this.on('object:modified', function (options) {
    //   let obj = options.target;
    //   let boundingRect = obj.getBoundingRect(true);
    //   if (boundingRect.left < 0 ||
    //     boundingRect.top < 0 ||
    //     boundingRect.left + boundingRect.width > this.canvas.getWidth() ||
    //     boundingRect.top + boundingRect.height > this.canvas.getHeight()) {
    //     obj.top = obj._stateProperties.top;
    //     obj.left = obj._stateProperties.left;
    //     obj.angle = obj._stateProperties.angle;
    //     obj.scaleX = obj._stateProperties.scaleX;
    //     obj.scaleY = obj._stateProperties.scaleY;
    //     obj.setCoords();
    //     obj.saveState();
    //   }
    // });
  },
  _render(ctx) {
    this.callSuper('_render', ctx);
    ctx.save();
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff) - (Math.PI / 2);
    // Arrow drawing part
    ctx.rotate(angle);
    ctx.beginPath();
    // Move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    const arrowHeight = 30;
    ctx.moveTo(this.strokeWidth, -arrowHeight / 2);
    ctx.lineTo(arrowHeight, 0);
    ctx.lineTo(this.strokeWidth, arrowHeight / 2);
    // Line border drawing part
    ctx.lineTo(this.strokeWidth, xDiff / 2);
    ctx.lineTo(-this.strokeWidth, (xDiff / 2));
    ctx.lineTo(-this.strokeWidth, -(xDiff / 2));
    ctx.lineTo(this.strokeWidth, -(xDiff / 2));
    ctx.lineTo(this.strokeWidth, -arrowHeight / 2);
    ctx.closePath();
    // Stroke and arrow styling part
    ctx.fillStyle = this.stroke;
    ctx.fill();
    ctx.strokeStyle = objectOption.lines.arrow.borderColor[this.stroke] ?
      objectOption.lines.arrow.borderColor[this.stroke] :
      objectOption.lines.arrow.borderColor.default;
    ctx.lineWidth = objectOption.line.arrow.borderWidth;
    ctx.stroke();
    ctx.restore();
  },
  controls: {
    ...fabric.Object.prototype.controls,
    mt: DirectionalLineControlMT
  }
});

DirectionalLine.fromObject = (options, callback) => {
  const {x1, x2, y1, y2} = options;
  return callback(new DirectionalLine([x1, y1, x2, y2], options));
};

// @ts-ignore
window.fabric.DirectionalLine = DirectionalLine;

export default DirectionalLine;
