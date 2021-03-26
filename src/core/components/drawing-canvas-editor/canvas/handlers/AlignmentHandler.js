/* eslint-disable valid-jsdoc */
class AlignmentHandler {
    handler;

    constructor(handler) {
      this.handler = handler;
    }

    /**
     * Align left at selection
     */
    left = () => {
      const activeObject = this.handler.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
        const activeSelection = activeObject;
        const activeObjectLeft = -(activeObject.width / 2);
        activeSelection.forEachObject(obj => {
          obj.set({left: activeObjectLeft});
          obj.setCoords();
          this.handler.canvas.renderAll();
        });
      }
    }

    /**
     * Align center at selection
     */
    center = () => {
      const activeObject = this.handler.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
        const activeSelection = activeObject;
        activeSelection.forEachObject(obj => {
          obj.set({left: 0 - ((obj.width * obj.scaleX) / 2)});
          obj.setCoords();
          this.handler.canvas.renderAll();
        });
      }
    }

    /**
     * Align right at selection
     */
    right = () => {
      const activeObject = this.handler.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
        const activeSelection = activeObject;
        const activeObjectLeft = (activeObject.width / 2);
        activeSelection.forEachObject(obj => {
          obj.set({left: activeObjectLeft - (obj.width * obj.scaleX)});
          obj.setCoords();
          this.handler.canvas.renderAll();
        });
      }
    }
}

export default AlignmentHandler;
