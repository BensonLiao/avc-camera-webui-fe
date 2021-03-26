import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Canvas} from '../drawing-canvas-editor/canvas/index';
import {transformLineCoordinates,
  convertToCanvasLineCoordinate,
  convertToCanvasRectCoordinate,
  hexToRGBA} from '../../utils';
import {objectOption, workareaOption} from '../drawing-canvas-editor/canvas/constants/defaults';
import {HUMAN_DETECTION_TYPE} from '../../constants';

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
const primaryColorRGBA = hexToRGBA(primaryColor.trim(), 0.5);

const propertiesToInclude = [
  'id',
  'name',
  'locked',
  'file',
  'src',
  'link',
  'tooltip',
  'animation',
  'layout',
  'workareaWidth',
  'workareaHeight',
  'videoLoadType',
  'autoplay',
  'shadow',
  'muted',
  'loop',
  'code',
  'icon',
  'userProperty',
  'trigger',
  'configuration',
  'superType',
  'points',
  'svg',
  'loadType'
];

const defaultCanvasOption = {backgroundColor: 'black'};

const defaultOption = {
  fill: 'rgba(0, 0, 0, 1)',
  stroke: 'rgba(255, 255, 255, 0)',
  strokeUniform: true,
  resource: {},
  link: {
    enabled: false,
    type: 'resource',
    state: 'new',
    dashboard: {}
  },
  tooltip: {
    enabled: true,
    type: 'resource',
    template: '<div>{{message.name}}</div>'
  },
  animation: {
    type: 'none',
    loop: true,
    autoplay: true,
    duration: 1000
  },
  userProperty: {},
  trigger: {
    enabled: false,
    type: 'alarm',
    script: 'return message.value > 0;',
    effect: 'style'
  }
};

export default class DrawingCanvas extends Component {
  static propTypes = {
    setValues: PropTypes.func.isRequired,
    values: PropTypes.shape({
      isEnable: PropTypes.bool.isRequired,
      triggerArea: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        isEnable: PropTypes.bool.isRequired,
        isDisplay: PropTypes.bool.isRequired,
        stayTime: PropTypes.number.isRequired,
        stayCountLimit: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        rect: PropTypes.shape({
          bottom: PropTypes.number,
          left: PropTypes.number,
          right: PropTypes.number,
          top: PropTypes.number
        }).isRequired
      }).isRequired).isRequired,
      triggerLine: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        isEnable: PropTypes.bool.isRequired,
        isDisplay: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        point: PropTypes.arrayOf(PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number
        })).isRequired
      }).isRequired)
    }).isRequired,
    triggerType: PropTypes.oneOf(Object.values(HUMAN_DETECTION_TYPE)),
    currentAreaId: PropTypes.string,
    setCurrentAreaId: PropTypes.func,
    currentLineId: PropTypes.string,
    setCurrentLineId: PropTypes.func
  };

  static defaultProps = {
    triggerType: null,
    currentAreaId: null,
    setCurrentAreaId: null,
    setCurrentLineId: null,
    currentLineId: null
  }

  state = {
    selectedItem: null,
    editing: false,
    descriptors: {}
  };

  componentDidMount() {
    this.shortcutHandlers.esc();
  }

  componentDidUpdate(prevProps) {
    const {values, triggerType, currentAreaId, currentLineId} = this.props;
    if (currentAreaId !== prevProps.currentAreaId) {
      this.canvasRef.handler.selectById(currentAreaId);
    }

    if (currentLineId !== prevProps.currentLineId) {
      this.canvasRef.handler.selectById(currentLineId);
    }

    if (triggerType !== prevProps.triggerType) {
      this.canvasRef.handler.clear();
      this.canvasRef.handler.setCanvasOption({
        ...defaultCanvasOption,
        selection: triggerType === HUMAN_DETECTION_TYPE.LINE
      });
      if (triggerType === HUMAN_DETECTION_TYPE.LINE) {
        this.loadDirectionalLineFromApi(this.canvasRef.handler, values[triggerType]);
      }

      if (triggerType === HUMAN_DETECTION_TYPE.AREA) {
        values[triggerType]
          .filter(area => area.isEnable)
          .map(area => {
            return {
              ...area,
              areaCoords: convertToCanvasRectCoordinate(
                area.rect,
                this.canvasRef.canvas.width,
                this.canvasRef.canvas.height,
                workareaOption.workareaWidth,
                workareaOption.workareaHeight
              )
            };
          })
          .forEach(({id, name, rect, areaCoords}) => {
            console.log(`Area${id} api axis: left=${rect.left} top=${rect.top} bottom=${rect.bottom} right=${rect.right}`);
            console.log(`Area${id} canvas axis: x=${areaCoords.x} y=${areaCoords.y} height=${areaCoords.height} width=${areaCoords.width}`);
            // The rectangle position must be manully set after added to canvas as of fabric@4.3.1
            this.canvasRef?.handler.add({
              id,
              name,
              type: 'labeledRect',
              height: areaCoords.height,
              width: areaCoords.width,
              stroke: 'white',
              strokeWidth: 4,
              fill: primaryColorRGBA
            }, false)
              .set({
                left: areaCoords.x,
                top: areaCoords.y
              })
              .setCoords();
          });
      }
    }
  }

  loadDirectionalLineFromApi = (target, data) => {
    data
      .filter(line => line.isEnable)
      .map(line => {
        return {
          id: line.id,
          lineCoords: transformLineCoordinates(line.point)
        };
      })
      .forEach(({id, lineCoords}) => {
        const canvasPoints = convertToCanvasLineCoordinate(
          lineCoords,
          target.canvas.width,
          target.canvas.height,
          workareaOption.workareaWidth,
          workareaOption.workareaHeight
        );
        console.log(`Line${id} api axis: ${lineCoords}, canvas axis: ${canvasPoints}`);
        target.add({
          id,
          points: canvasPoints,
          type: 'directionalLine',
          stroke: objectOption.lines[id].stroke,
          strokeWidth: 4,
          objectCaching: !target.editable,
          name: 'New line',
          superType: 'drawing'
        }, false);
      });
  }

  canvasHandlers = {
    onLoad: target => {
      const {values, triggerType} = this.props;
      target.workareaHandler.setImage(window.isDebug === 'y' ?
        require('../../../resource/video-liveview.png') :
        '/api/snapshot'
      );
      target.canvas.setZoom(target.canvas.width / workareaOption.workareaWidth);
      if (triggerType === HUMAN_DETECTION_TYPE.LINE) {
        this.loadDirectionalLineFromApi(target, values[triggerType]);
      }
    },
    onAdd: target => {
      // We don't have direct control on line length limit,
      // but we can limit the line minimum length via min scale limit
      // ref https://github.com/fabricjs/fabric.js/issues/6481
      if (target.minLen) {
        target.set({minScaleLimit: target.minLen / target.getScaledWidth()});
      }

      const {editing} = this.state;
      this.forceUpdate();
      if (!editing) {
        this.changeEditing(true);
      }

      if (target.type === 'activeSelection') {
        this.canvasHandlers.onSelect(null);
        return;
      }

      this.canvasRef.handler.select(target);
    },
    onSelect: target => {
      const {selectedItem} = this.state;
      if (target) {
        if (target.id !== 'workarea' && target.type !== 'activeSelection') {
          if (selectedItem && target.id === selectedItem.id) {
            return;
          }

          const {setCurrentAreaId, setCurrentLineId} = this.props;
          const setCurrentTargetId = target.type === 'labeledRect' ? setCurrentAreaId : setCurrentLineId;
          setCurrentTargetId(target.id);

          this.canvasRef.handler.getObjects().forEach(obj => {
            if (obj) {
              this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
            }
          });
          this.setState({selectedItem: target});
          return;
        }
      }

      this.canvasRef.handler.getObjects().forEach(obj => {
        if (obj) {
          this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
        }
      });
      this.setState({selectedItem: null});
    },
    onRemove: () => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }

      this.canvasHandlers.onSelect(null);
    },
    onModified: () => {
      const {editing} = this.state;
      this.forceUpdate();
      if (!editing) {
        this.changeEditing(true);
      }
    },
    onChange: (selectedItem, changedValues, allValues) => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }

      const changedKey = Object.keys(changedValues)[0];
      const changedValue = changedValues[changedKey];
      if (allValues.workarea) {
        this.canvasHandlers.onChangeWokarea(changedKey, changedValue, allValues.workarea);
        return;
      }

      if (changedKey === 'width' || changedKey === 'height') {
        this.canvasRef.handler.scaleToResize(allValues.width, allValues.height);
        return;
      }

      if (changedKey === 'angle') {
        this.canvasRef.handler.rotate(allValues.angle);
        return;
      }

      if (changedKey === 'locked') {
        this.canvasRef.handler.setObject({
          lockMovementX: changedValue,
          lockMovementY: changedValue,
          hasControls: !changedValue,
          hoverCursor: changedValue ? 'pointer' : 'move',
          editable: !changedValue,
          locked: changedValue
        });
        return;
      }

      if (changedKey === 'file' || changedKey === 'src' || changedKey === 'code') {
        if (selectedItem.type === 'image') {
          this.canvasRef.handler.setImageById(selectedItem.id, changedValue);
        } else if (selectedItem.superType === 'element') {
          this.canvasRef.handler.elementHandler.setById(selectedItem.id, changedValue);
        }

        return;
      }

      if (changedKey === 'link') {
        const link = Object.assign({}, defaultOption.link, allValues.link);
        this.canvasRef.handler.set(changedKey, link);
        return;
      }

      if (changedKey === 'tooltip') {
        const tooltip = Object.assign({}, defaultOption.tooltip, allValues.tooltip);
        this.canvasRef.handler.set(changedKey, tooltip);
        return;
      }

      if (changedKey === 'animation') {
        const animation = Object.assign({}, defaultOption.animation, allValues.animation);
        this.canvasRef.handler.set(changedKey, animation);
        return;
      }

      if (changedKey === 'icon') {
        const {unicode, styles} = changedValue[Object.keys(changedValue)[0]];
        const uni = parseInt(unicode, 16);
        if (styles[0] === 'brands') {
          this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Brands');
        } else if (styles[0] === 'regular') {
          this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Regular');
        } else {
          this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Free');
        }

        this.canvasRef.handler.set('text', String.fromCodePoint(uni));
        this.canvasRef.handler.set('icon', changedValue);
        return;
      }

      if (changedKey === 'shadow') {
        if (allValues.shadow.enabled) {
          if ('blur' in allValues.shadow) {
            this.canvasRef.handler.setShadow(allValues.shadow);
          } else {
            this.canvasRef.handler.setShadow({
              enabled: true,
              blur: 15,
              offsetX: 10,
              offsetY: 10
            });
          }
        } else {
          this.canvasRef.handler.setShadow(null);
        }

        return;
      }

      if (changedKey === 'fontWeight') {
        this.canvasRef.handler.set(changedKey, changedValue ? 'bold' : 'normal');
        return;
      }

      if (changedKey === 'fontStyle') {
        this.canvasRef.handler.set(changedKey, changedValue ? 'italic' : 'normal');
        return;
      }

      if (changedKey === 'textAlign') {
        this.canvasRef.handler.set(changedKey, Object.keys(changedValue)[0]);
        return;
      }

      if (changedKey === 'trigger') {
        const trigger = Object.assign({}, defaultOption.trigger, allValues.trigger);
        this.canvasRef.handler.set(changedKey, trigger);
        return;
      }

      if (changedKey === 'filters') {
        const filterKey = Object.keys(changedValue)[0];
        const filterValue = allValues.filters[filterKey];
        if (filterKey === 'gamma') {
          const rgb = [filterValue.r, filterValue.g, filterValue.b];
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {gamma: rgb});
          return;
        }

        if (filterKey === 'brightness') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {brightness: filterValue.brightness});
          return;
        }

        if (filterKey === 'contrast') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {contrast: filterValue.contrast});
          return;
        }

        if (filterKey === 'saturation') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {saturation: filterValue.saturation});
          return;
        }

        if (filterKey === 'hue') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {rotation: filterValue.rotation});
          return;
        }

        if (filterKey === 'noise') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {noise: filterValue.noise});
          return;
        }

        if (filterKey === 'pixelate') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {blocksize: filterValue.blocksize});
          return;
        }

        if (filterKey === 'blur') {
          this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {value: filterValue.value});
          return;
        }

        this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey]);
        return;
      }

      this.canvasRef.handler.set(changedKey, changedValue);
    },
    onChangeWokarea: (changedKey, changedValue, allValues) => {
      if (changedKey === 'layout') {
        this.canvasRef.handler.workareaHandler.setLayout(changedValue);
        return;
      }

      if (changedKey === 'file' || changedKey === 'src') {
        this.canvasRef.handler.workareaHandler.setImage(changedValue);
        return;
      }

      if (changedKey === 'width' || changedKey === 'height') {
        this.canvasRef.handler.originScaleToResize(
          this.canvasRef.handler.workarea,
          allValues.width,
          allValues.height
        );
        this.canvasRef.canvas.centerObject(this.canvasRef.handler.workarea);
        return;
      }

      this.canvasRef.handler.workarea.set(changedKey, changedValue);
      this.canvasRef.canvas.requestRenderAll();
    },
    onClick: (canvas, target) => {
      const {link} = target;
      if (link.state === 'current') {
        document.location.href = link.url;
        return;
      }

      window.open(link.url);
    }
  };

  shortcutHandlers = {
    esc: () => {
      document.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
          this.handlers.onChangePreview(false);
        }
      });
    }
  };

  transformList = () => {
    return Object.values(this.state.descriptors).reduce((prev, curr) => prev.concat(curr), []);
  };

  changeEditing = editing => {
    this.setState({editing});
  };

  render() {
    const {
      onLoad,
      onAdd,
      onRemove,
      onSelect,
      onModified,
      onClick
    } = this.canvasHandlers;
    const {values, setValues, triggerType} = this.props;
    return (
      <div
        ref={c => {
          this.container = c;
        }}
        className="drawing-canvas-editor"
      >
        <Canvas
          ref={c => {
            this.canvasRef = c;
          }}
          className="canvas-editor"
          minZoom={50}
          maxZoom={500}
          objectOption={defaultOption}
          canvasOption={defaultCanvasOption}
          workareaOption={{
            layout: 'fixed',
            width: workareaOption.workareaWidth,
            height: workareaOption.workareaHeight
          }}
          propertiesToInclude={propertiesToInclude}
          keyEvent={{transaction: true}}
          triggerType={triggerType}
          formValues={values}
          setFormValues={value => setValues(value)}
          onLoad={onLoad}
          onModified={onModified}
          onAdd={onAdd}
          onRemove={onRemove}
          onSelect={onSelect}
          onClick={onClick}
        />
      </div>
    );
  }
}
