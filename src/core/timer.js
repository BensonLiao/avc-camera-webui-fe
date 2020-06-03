module.exports = class Timer {
  constructor(callback, delay) {
    var timerId;
    var start;
    var remaining = delay;

    this.pause = () => {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    this.resume = () => {
      start = new Date();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
    };

    this.start = () => {
      this.resume();
    };
  }
};
