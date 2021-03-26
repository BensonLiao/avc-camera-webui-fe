import {fabric} from 'fabric';
const computedStyle = getComputedStyle(document.documentElement);

const LabeledRect = fabric.util.createClass(fabric.Group, {
  type: 'labeledRect',
  superType: 'shape',
  initialize(options) {
    options = {
      name: 'Labeled Rect',
      width: 100,
      height: 100,
      fill: '#77AAFF',
      ...options
    };
    this.minLen = options.minLen || 50; // minimum length of the line, we need to set this thing in px now
    const items	= [
      new fabric.Rect(options),
      new fabric.Textbox(options.name, {
        textAlign: 'center',
        fontSize: 48,
        originX: 'center',
        originY: 'center',
        fill: 'white',
        stroke: 'black',
        fontFamily: computedStyle.fontFamily,
        left: options.width / 2,
        top: options.height / 2
      })
    ];
    this.setControlsVisibility({mtr: false});
    this.callSuper('initialize', items, options);
  },
  _render(ctx) {
    this.callSuper('_render', ctx);
  }
});

LabeledRect.fromObject = (options, callback) => {
  return callback(new LabeledRect(options));
};

window.fabric.LabeledRect = LabeledRect;

export default LabeledRect;
