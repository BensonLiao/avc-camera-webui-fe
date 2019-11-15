const axios = require('axios');
const constants = require('../constants');
const store = require('../store');
if (process.env.NODE_ENV === 'development') {
  const mockDB = require('../db-mock');
  mockDB.init();
  const db = mockDB.get();
  console.log('db.getState()', db.getState());
  const MockAdapter = require('axios-mock-adapter');
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/groups').reply(config => {
    // `config` is the axios config and contains things like the url
    console.log('config', config);
    // Return an array in the form of [status, data, headers]
    return [200, {
      items: db.get('groups').value()
    }];
  })
    .onGet('/api/members').reply(() => {
      const data = db.get('members').value();
      return [200, {
        index: 0,
        size: 20,
        total: data.length,
        items: data
      }];
    })
    .onPost('/api/members').reply(config => {
      console.log('config', config);
      const newItem = JSON.parse(config.data);
      const newId = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060788';
      newItem.id = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060788';
      db.get('members').push(newItem).write();
      delete newItem[newId];
      return [200, newItem];
    })
    .onDelete('/api/members').reply(config => {
      // WIP: not working for now, need to find a correct way to access the uri
      console.log('config', config);
      return [204, {}];
    })
    .onAny().passThrough(); // Pass other request to normal axios
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
