export const canvasOption = {
  preserveObjectStacking: true,
  width: 300,
  height: 150,
  selection: true,
  defaultCursor: 'default',
  backgroundColor: '#f3f3f3'
};

export const keyEvent = {
  move: true,
  all: true,
  copy: true,
  paste: true,
  esc: true,
  del: true,
  clipboard: false,
  transaction: true,
  zoom: true,
  cut: true
};

export const gridOption = {
  enabled: false,
  grid: 10,
  snapToGrid: false,
  lineColor: '#ebebeb',
  borderColor: '#cccccc'
};

export const workareaOption = {
  width: 600,
  height: 400,

  // We use the following size to do calculation between canvas and actual screen
  workareaWidth: 1920,
  workareaHeight: 1080,

  lockScalingX: true,
  lockScalingY: true,
  scaleX: 1,
  scaleY: 1,
  backgroundColor: '#fff',
  hasBorders: false,
  hasControls: false,
  selectable: false,
  lockMovementX: true,
  lockMovementY: true,
  hoverCursor: 'default',
  name: '',
  id: 'workarea',
  type: 'image',
  layout: 'fixed', // fixed, responsive, fullscreen
  link: {},
  tooltip: {enabled: false},
  isElement: false
};

export const objectOption = {
  rotation: 0,
  centeredRotation: true,
  strokeUniform: true,
  padding: 6,
  cornerSize: 16,
  cornerStrokeColor: 'white',
  cornerStyle: 'circle',
  opacity: 1,
  line: {
    stroke: 'white',
    strokeWidth: 2,
    arrow: {
      borderColor: 'white',
      borderWidth: 2
    }
  },
  lines: {
    0: {
      stroke: 'red',
      strokeWidth: 2
    },
    1: {
      stroke: 'yellow',
      strokeWidth: 2
    },
    2: {
      stroke: 'green',
      strokeWidth: 2
    },
    arrow: {
      borderColor: {
        default: 'white',
        yellow: 'black'
      },
      borderWidth: 2
    }
  }
};

export const guidelineOption = {enabled: true};

// Multiple selection
export const activeSelectionOption = {
  ...objectOption,
  hasControls: true
};

export const propertiesToInclude = ['id', 'name', 'locked', 'editable'];
