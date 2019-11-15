const axios = require('axios');
const constants = require('../constants');
const store = require('../store');
if (process.env.NODE_ENV === 'development') {
  require('./index.dev.js');
}

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
