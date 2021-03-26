/* eslint-disable valid-jsdoc */
import {fabric} from 'fabric';

class InteractionHandler {
  handler;

  constructor(handler) {
    this.handler = handler;
    if (this.handler.editable) {
      this.selection();
    }
  }

  /**
   * Change selection mode
   * @param {(obj: FabricObject) => IReturnType} [callback]
   */
  selection = callback => {
    if (this.handler.interactionMode === 'selection') {
      return;
    }

    this.handler.interactionMode = 'selection';
    if (typeof this.handler.canvasOption.selection === 'undefined') {
      this.handler.canvas.selection = true;
    } else {
      this.handler.canvas.selection = this.handler.canvasOption.selection;
    }

    this.handler.canvas.defaultCursor = 'default';
    this.handler.workarea.hoverCursor = 'default';
    this.handler.getObjects().forEach(obj => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        // When typeof selection is ActiveSelection, ignoring selectable, because link position left: 0, top: 0
        if (obj.superType === 'link' || obj.superType === 'port') {
          obj.selectable = false;
          obj.evented = true;
          obj.hoverCursor = 'pointer';
          return;
        }

        obj.hoverCursor = 'move';
        obj.selectable = true;
        obj.evented = true;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Change grab mode
   * @param {(obj: FabricObject) => IReturnType} [callback]
   */
  grab = callback => {
    if (this.handler.interactionMode === 'grab') {
      return;
    }

    this.handler.interactionMode = 'grab';
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = 'grab';
    this.handler.workarea.hoverCursor = 'grab';
    this.handler.getObjects().forEach(obj => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        obj.selectable = false;
        obj.evented = !this.handler.editable;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Change drawing mode
   * @param {InteractionMode} [type]
   * @param {(obj: FabricObject) => IReturnType} [callback]
   */
  drawing = (type, callback) => {
    if (this.isDrawingMode()) {
      return;
    }

    this.handler.interactionMode = type;
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = 'pointer';
    this.handler.workarea.hoverCursor = 'pointer';
    this.handler.getObjects().forEach(obj => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        obj.selectable = false;
        obj.evented = !this.handler.editable;
      }
    });
    this.handler.canvas.renderAll();
  };

  linking = callback => {
    if (this.isDrawingMode()) {
      return;
    }

    this.handler.interactionMode = 'link';
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = 'default';
    this.handler.workarea.hoverCursor = 'default';
    this.handler.getObjects().forEach(obj => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        if (obj.superType === 'node' || obj.superType === 'port') {
          obj.hoverCursor = 'pointer';
          obj.selectable = false;
          obj.evented = true;
          return;
        }

        obj.selectable = false;
        obj.evented = !this.handler.editable;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Moving objects in grap mode
   * @param {MouseEvent} e
   */
  moving = e => {
    if (this.isDrawingMode()) {
      return;
    }

    const delta = new fabric.Point(e.movementX, e.movementY);
    this.handler.canvas.relativePan(delta);
    this.handler.canvas.requestRenderAll();
    this.handler.objects.forEach(obj => {
      if (obj.superType === 'element') {
        const {id} = obj;
        const el = this.handler.elementHandler.findById(id);
        // update the element
        this.handler.elementHandler.setPosition(el, obj);
      }
    });
  };

  /**
   * Whether is drawing mode
   * @returns
   */
  isDrawingMode = () => {
    return (
      this.handler.interactionMode === 'link' ||
      this.handler.interactionMode === 'arrow' ||
      this.handler.interactionMode === 'line' ||
      this.handler.interactionMode === 'polygon' ||
      this.handler.interactionMode === 'directionalLine'
    );
  };

  /**
   * Interaction callback
   *
   * @param {FabricObject} obj
   * @param {(obj: FabricObject) => void} [callback]
   */
  interactionCallback = (obj, callback) => {
    callback(obj);
  };
}

export default InteractionHandler;
