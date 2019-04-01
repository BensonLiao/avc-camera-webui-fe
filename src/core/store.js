const PubSub = require('pubsub-js');
const constants = require('./constants');

const data = {};

module.exports = {
  unsubscribe: token => PubSub.unsubscribe(token),
  subscribe: (key, func) =>
    PubSub.subscribe(`${constants.TOPIC_PREFIX_STORE_CHANGE}${key}`, (msg, data) => func(msg, data)),
  set: (key, value) => {
    data[key] = value;
    return PubSub.publish(`${constants.TOPIC_PREFIX_STORE_CHANGE}${key}`, value);
  },
  get: key => data[key]
};
