const axios = require('axios');
const constants = require('../constants');
const store = require('../store');
const notify = require('../notify');
const i18nUtils = require('../../i18n/utils');

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

  return new Promise((resolve, _) => {
    // config.delay = Math.round(Math.random() * 1000);
    // config.timeout = 2000;
    setTimeout(() => {
      resolve();
    }, config.delay || 0);
  }).then(() => {
    return axios(config)
      .catch(error => {
        if (error.response && error.response.status === 401) {
          store.set(constants.store.IS_NOT_CALL_UNLOAD_ALERT, true);
          location.href = '/login';
          return new Promise(() => {}); // Lock the promise chain.
        }

        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
          console.error('Error on Response Error Status: ', error.response);
          notify.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ?
              i18nUtils.getApiErrorMessageI18N(error.response.data.message || null) :
              null
          });
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
          console.error('Error on No Response Was Received: ', error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
          console.error('Error on Setting up The Request: ', error.message);
        }

        throw error;
      })
      .finally(() => {
        delete _pool[id];
        _updateApiStatus();
        if (expiresTimer && typeof expiresTimer.resetAndResume === 'function') {
          expiresTimer.resetAndResume();
        }
      });
  });
};
