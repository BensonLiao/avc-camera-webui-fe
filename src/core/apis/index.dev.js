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
  .onGet(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    const data = db.get('groups').find({id: itemId}).value();
    return [200, data];
  })
  .onPut(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    const data = db.get('groups').find({id: itemId}).assign(newItem).write();
    return [200, data];
  })
  .onPost('/api/groups').reply(config => {
    const newItem = JSON.parse(config.data);
    const newId = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060780';
    newItem.id = newId;
    db.get('groups').push(newItem).write();
    delete newItem[newId];
    return [200, newItem];
  })
  .onDelete(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    db.get('groups').remove({id: itemId}).write();
    return [204, {}];
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
  .onGet(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const data = db.get('members').find({id: itemId}).value();
    return [200, data];
  })
  .onPut(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    const data = db.get('members').find({id: itemId}).assign(newItem).write();
    return [200, data];
  })
  .onPost('/api/members').reply(config => {
    const newItem = JSON.parse(config.data);
    const newId = '40d1e5fd-3dd7-4ad1-a4c8-0ca928060788';
    newItem.id = newId;
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
