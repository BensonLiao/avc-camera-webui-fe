const axios = require('axios');
const mockDB = require('../db-mock');
mockDB.init();
const db = mockDB.get();
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
mockAxios.onGet('/api/groups').reply(() => {
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
    const newItem = JSON.parse(config.data);
    const newId = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060788';
    newItem.id = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060788';
    db.get('members').push(newItem).write();
    delete newItem[newId];
    return [200, newItem];
  })
  .onDelete(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    db.get('members').remove({id: itemId}).write();
    return [204, {}];
  })
  .onAny().passThrough(); // Pass other request to normal axios
