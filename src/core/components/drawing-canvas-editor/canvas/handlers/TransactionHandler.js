/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
import {fabric} from 'fabric';
import throttle from 'lodash/throttle';

class TransactionHandler {
  handler;

  redos;

  undos;

  active = false;

  state = [];

  constructor(handler) {
    this.handler = handler;
    if (this.handler.editable) {
      this.initialize();
    }
  }

  /**
   * Initialize transaction handler
   *
   */
  initialize = () => {
    this.redos = [];
    this.undos = [];
    this.state = [];
    this.active = false;
  };

  /**
   * Save transaction
   *
   * @param {TransactionType} type
   * @param {*} [canvasJSON]
   * @param {boolean} [isWorkarea=true]
   */
  save = (type, canvasJSON, _isWorkarea = true) => {
    if (!this.handler.keyEvent.transaction) {
      return;
    }

    try {
      if (this.state) {
        const json = JSON.stringify(this.state);
        this.redos = [];
        this.undos.push({
          type,
          json
        });
      }

      const {objects} =
        canvasJSON || this.handler.canvas.toJSON(this.handler.propertiesToInclude);
      this.state = objects.filter(obj => {
        if (obj.id === 'workarea') {
          return false;
        }

        if (obj.id === 'grid') {
          return false;
        }

        if (obj.superType === 'port') {
          return false;
        }

        return true;
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Undo transaction
   *
   */
  undo = throttle(() => {
    const undo = this.undos.pop();
    if (!undo) {
      return;
    }

    this.redos.push({
      type: 'redo',
      json: JSON.stringify(this.state)
    });
    this.replay(undo);
  }, 100);

  /**
   * Redo transaction
   *
   */
  redo = throttle(() => {
    const redo = this.redos.pop();
    if (!redo) {
      return;
    }

    this.undos.push({
      type: 'undo',
      json: JSON.stringify(this.state)
    });
    this.replay(redo);
  }, 100);

  /**
   * Replay transaction
   *
   * @param {TransactionEvent} transaction
   */
  replay = transaction => {
    const objects = JSON.parse(transaction.json);
    this.state = objects;
    this.active = true;
    this.handler.canvas.renderOnAddRemove = false;
    this.handler.clear();
    this.handler.canvas.discardActiveObject();
    fabric.util.enlivenObjects(
      objects,
      enlivenObjects => {
        enlivenObjects.forEach(obj => {
          const targetIndex = this.handler.canvas._objects.length;
          if (obj.superType === 'node') {
            this.handler.canvas.insertAt(obj, targetIndex, false);
            this.handler.portHandler.create(obj);
          } else if (obj.superType === 'link') {
            const link = obj;
            this.handler.objects = this.handler.getObjects();
            this.handler.linkHandler.create({
              type: 'curvedLink',
              fromNodeId: link.fromNode?.id,
              fromPortId: link.fromPort?.id,
              toNodeId: link.toNode?.id,
              toPortId: link.toPort?.id
            });
          } else {
            this.handler.canvas.insertAt(obj, targetIndex, false);
          }
        });
        this.handler.canvas.renderOnAddRemove = true;
        this.active = false;
        this.handler.canvas.renderAll();
        this.handler.objects = this.handler.getObjects();
        if (this.handler.onTransaction) {
          this.handler.onTransaction(transaction);
        }
      },
      null
    );
  };
}

export default TransactionHandler;
