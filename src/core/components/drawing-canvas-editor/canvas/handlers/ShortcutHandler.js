/* eslint-disable valid-jsdoc */

/**
 * Shortcut Handler Class
 *
 * @author salgum1114
 * @class ShortcutHandler
 */
class ShortcutHandler {
    handler;

    keyEvent;

    constructor(handler) {
      this.handler = handler;
      this.keyEvent = handler.keyEvent;
    }

    /**
     * Whether keydown Escape
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isEscape = e => {
      return e.keyCode === 27 && this.keyEvent.esc;
    }

    /**
     * Whether keydown Q
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isQ = e => {
      return e.keyCode === 81;
    }

    /**
     * Whether keydown W
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isW = e => {
      return e.keyCode === 87;
    }

    /**
     * Whether keydown Delete or Backpsace
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isDelete = e => {
      return (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 127) && this.keyEvent.del;
    }

    /**
     * Whether keydown Arrow
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isArrow = e => {
      return e.code.includes('Arrow') && this.keyEvent.move;
    }

    /**
     * Whether keydown Ctrl + A
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlA = e => {
      return e.ctrlKey && e.keyCode === 65 && this.keyEvent.all;
    }

    /**
     * Whether keydown Ctrl + C
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlC = e => {
      return e.ctrlKey && e.keyCode === 67 && this.keyEvent.copy;
    }

    /**
     * Whether keydown Ctrl + V
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlV = e => {
      return e.ctrlKey && e.keyCode === 86 && this.keyEvent.paste;
    }

    /**
     * Whether keydown Ctrl + Z
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlZ = e => {
      return e.ctrlKey && e.keyCode === 90 && this.keyEvent.transaction;
    }

    /**
     * Whether keydown Ctrl + Y
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlY = e => {
      return e.ctrlKey && e.keyCode === 89 && this.keyEvent.transaction;
    }

    /**
     * Whether keydown Plus Or Equal
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isPlus = e => {
      return e.keyCode === 187 && this.keyEvent.zoom;
    }

    /**
     * Whether keydown Minus
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isMinus = e => {
      return e.keyCode === 189 && this.keyEvent.zoom;
    }

    /**
     * Whether keydown O
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isO = e => {
      return e.keyCode === 79 && this.keyEvent.zoom;
    }

    /**
     * Whether keydown P
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isP = e => {
      return e.keyCode === 80 && this.keyEvent.zoom;
    }

    /**
     * Whether keydown Ctrl + X
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlX = e => {
      return e.ctrlKey && e.keyCode === 88 && this.keyEvent.cut;
    }
}

export default ShortcutHandler;
