import {fabric} from 'fabric';
import {Arrow,
  Line,
  LabeledRect,
  DirectionalLine} from './objects';

export const createCanvasObject = objectSchema => objectSchema;

const CanvasObject = {
  group: {create: ({objects, ...option}) => new fabric.Group(objects, option)},
  'i-text': {create: ({text, ...option}) => new fabric.IText(text, option)},
  textbox: {create: ({text, ...option}) => new fabric.Textbox(text, option)},
  triangle: {create: option => new fabric.Triangle(option)},
  circle: {create: option => new fabric.Circle(option)},
  rect: {create: option => new fabric.Rect(option)},
  labeledRect: {create: option => new LabeledRect(option)},
  image: {
    create: ({element = new Image(), ...option}) =>
      new fabric.Image(element, {
        ...option,
        crossOrigin: 'anonymous'
      })
  },
  polygon: {
    create: ({points, ...option}) =>
      new fabric.Polygon(points, {
        ...option,
        perPixelTargetFind: true
      })
  },
  line: {create: ({points, ...option}) => new Line(points, option)},
  directionalLine: {create: ({points, ...option}) => new DirectionalLine(points, option)},
  arrow: {create: ({points, ...option}) => new Arrow(points, option)}
};

export default CanvasObject;
