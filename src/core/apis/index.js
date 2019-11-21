const axios = require('axios');
const constants = require('../constants');
const store = require('../store');
try {
  // This module will be ignored when `env.disablemockserver` is true.
  // Go to webpack.config.js find "webpack.IgnorePlugin".
  require('../dev/index.js');
} catch (_) {}

const _pool = {};
const _updateApiStatus = () => {
  /*
  Update store.$isApiProcessing.
   */
  if (Object.keys(_pool).length) {
    if (!store.get(constants.store.IS_API_PROCESSING)) {
      store.set(constants.store.IS_API_PROCESSING, true);
    }
  } else if (store.get(constants.store.IS_API_PROCESSING)) {
    store.set(constants.store.IS_API_PROCESSING, false);
  }
};

module.exports = args => {
  const id = Math.random().toString(36).substr(2);
  _pool[id] = args;
  _updateApiStatus();
  return axios(args).finally(() => {
    delete _pool[id];
    _updateApiStatus();
  });
};
