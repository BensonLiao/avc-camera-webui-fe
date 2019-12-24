const PubSub = require('pubsub-js');
const constants = require('./constants');

const _data = {};

module.exports = {
  /**
   * Subscribe to the store.
   * @param {String} key
   * @param {Function} func
   * @returns {Function} Unsubscribe from the store.
   */
  subscribe: (key, func) => {
    const token = PubSub.subscribe(`${constants.store.CHANGE}${key}`, func);
    return () => PubSub.unsubscribe(token);
  },
  /**
   * Add or update key-value mapping to the store.
   * @param {String} key
   * @param {any} value
   * @returns {Boolean} Publish status.
   */
  set: (key, value) => {
    _data[key] = value;
    return PubSub.publishSync(`${constants.store.CHANGE}${key}`, value);
  },
  /**
   * Get value from the store.
   * @param {String} key
   * @returns {any}
   */
  get: key => _data[key]
};
