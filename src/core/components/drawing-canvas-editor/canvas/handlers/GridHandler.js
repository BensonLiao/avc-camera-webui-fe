/* eslint-disable no-mixed-operators */
/* eslint-disable valid-jsdoc */
import {fabric} from 'fabric';

class GridHandler {
  handler;

  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  /**
   * Init grid
   *
   */
  initialize = () => {
    const {grid, lineColor, borderColor, enabled} = this.handler.gridOption;
    if (enabled && grid) {
      const width = 5000;
      const gridLength = width / grid;
      const lineOptions = {
        stroke: lineColor,
        selectable: false,
        evented: false,
        id: 'grid'
      };
      for (let i = 0; i < gridLength; i++) {
        const distance = i * grid;
        const fhorizontal = new fabric.Line([distance, -width, distance, width], lineOptions);
        const shorizontal = new fabric.Line([distance - width, -width, distance - width, width], lineOptions);
        this.handler.canvas.add(fhorizontal);
        this.handler.canvas.add(shorizontal);
        const fvertical = new fabric.Line([-width, distance - width, width, distance - width], lineOptions);
        const svertical = new fabric.Line([-width, distance, width, distance], lineOptions);
        this.handler.canvas.add(fvertical);
        this.handler.canvas.add(svertical);
        if (i % 5 === 0) {
          fhorizontal.set({stroke: borderColor});
          shorizontal.set({stroke: borderColor});
          fvertical.set({stroke: borderColor});
          svertical.set({stroke: borderColor});
        }
      }
    }
  };

  /**
   * Set coords in grid
   * @param {(FabricObject | fabric.ActiveSelection)} target
   * @returns
   */
  setCoords = target => {
    const {gridOption: {enabled, grid, snapToGrid}} = this.handler;
    if (enabled && grid && snapToGrid) {
      if (target.type === 'activeSelection') {
        const activeSelection = target.ActiveSelection;
        activeSelection.set({
          left: Math.round(target.left / grid) * grid,
          top: Math.round(target.top / grid) * grid
        });
        activeSelection.setCoords();
        activeSelection.getObjects().forEach(obj => {
          if (obj.superType === 'node') {
            const left = target.left + obj.left + target.width / 2;
            const top = target.top + obj.top + target.height / 2;
            this.handler.portHandler.setCoords({
              ...obj,
              left,
              top
            });
          }
        });
        return;
      }

      const obj = target;
      obj.set({
        left: Math.round(target.left / grid) * grid,
        top: Math.round(target.top / grid) * grid
      });
      target.setCoords();
      this.handler.portHandler.setCoords(target);
    }
  };
}

export default GridHandler;
