module.exports = class Timer {
  constructor(callback, delay) {
    this.timerId = null;
    this.startTime = 0;
    this.remaining = delay;
    this.expires = delay;
    this.cb = callback;
  }

  pause = () => {
    window.clearTimeout(this.timerId);
    this.remaining -= new Date() - this.startTime;
  };

  resetAndResume = () => {
    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(this.cb, this.expires);
  };

  resume = () => {
    this.startTime = new Date();
    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(this.cb, this.remaining);
  };

  start = () => {
    this.timerId = window.setTimeout(this.cb, this.expires);
  };
};
