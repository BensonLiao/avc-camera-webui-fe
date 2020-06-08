const axios = require('axios');
const constants = require('../constants');
const store = require('../store');
try {
  // This module will be ignored when `env.disablemockserver` is true.
  // Go to webpack.config.js find "webpack.IgnorePlugin".
  require('../dev/index.js');
} catch (_) {}

const _pool = {};
/**
 * Update store.$isApiProcessing.
 * @private
 * @returns {undefined}
 */
const _updateApiStatus = () => {
  if (Object.keys(_pool).length) {
    if (!store.get(constants.store.IS_API_PROCESSING)) {
      store.set(constants.store.IS_API_PROCESSING, true);
    }
  } else if (store.get(constants.store.IS_API_PROCESSING)) {
    store.set(constants.store.IS_API_PROCESSING, false);
  }
};

/**
 * @param {Object} config - The axios request config.
 * @returns {Promise<AxiosResponse<any>>}
 */
module.exports = config => {
  const id = Math.random().toString(36).substr(2);
  _pool[id] = config;
  _updateApiStatus();
  const expiresTimer = store.get(constants.store.EXPIRES_TIMER);
  if (expiresTimer && typeof expiresTimer.pause === 'function') {
    expiresTimer.pause();
  }

  return axios(config)
    .catch(error => {
      if (error && error.response && error.response.status === 401) {
        location.href = '/login';
        return new Promise(() => {}); // Lock the promise chain.
      }

      throw error;
    })
    .finally(() => {
      delete _pool[id];
      _updateApiStatus();
      if (expiresTimer && typeof expiresTimer.resume === 'function') {
        expiresTimer.resetAndResume();
      }
    });
};
