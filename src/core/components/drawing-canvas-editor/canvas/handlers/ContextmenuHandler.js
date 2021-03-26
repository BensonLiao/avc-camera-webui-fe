/* eslint-disable valid-jsdoc */
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';

class ContextmenuHandler {
  handler;

  contextmenuEl;

  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  /**
   * Initialize contextmenu
   *
   */
  initialize() {
    this.contextmenuEl = document.createElement('div');
    this.contextmenuEl.id = `${this.handler.id}_contextmenu`;
    this.contextmenuEl.className = 'rde-contextmenu contextmenu-hidden';
    document.body.appendChild(this.contextmenuEl);
  }

  /**
   * Destroy contextmenu
   *
   */
  destory() {
    if (this.contextmenuEl) {
      document.body.removeChild(this.contextmenuEl);
    }
  }

  /**
   * Show context menu
   *
   */
    show = debounce(async (e, target) => {
      const {onContext} = this.handler;
      while (this.contextmenuEl.hasChildNodes()) {
        this.contextmenuEl.removeChild(this.contextmenuEl.firstChild);
      }

      const contextmenu = document.createElement('div');
      contextmenu.className = 'rde-contextmenu-right';
      const element = await onContext(this.contextmenuEl, e, target);
      if (!element) {
        return;
      }

      contextmenu.innerHTML = element;
      this.contextmenuEl.appendChild(contextmenu);
      ReactDOM.render(element, contextmenu);
      this.contextmenuEl.classList.remove('contextmenu-hidden');
      const {clientX: left, clientY: top} = e;
      this.contextmenuEl.style.left = `${left}px`;
      this.contextmenuEl.style.top = `${top}px`;
    }, 100);

    /**
   * Hide context menu
   *
   */
    hide = debounce(() => {
      if (this.contextmenuEl) {
        this.contextmenuEl.classList.add('contextmenu-hidden');
      }
    }, 100);
}

export default ContextmenuHandler;
