const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const uuidv4 = require('uuid/v4');
const {mockResponseWithLog} = require('../utils');
const mockDB = require('./db');
const db = mockDB.init();
const mockAxios = new MockAdapter(axios);
let mockResponse;
mockAxios.onGet('/api/video/settings').reply(config => {
  mockResponse = [200, db.get('video').value()];
  return mockResponseWithLog(config, mockResponse);
})
  .onPut('/api/video/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    mockResponse = [200, db.get('video').assign(newItem).write()];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPost('/api/video/settings/_reset').reply(config => {
    const defaultItem = db.get('videoDefault').value();
    mockResponse = [200, db.get('video').assign(defaultItem).write()];
    return mockResponseWithLog(config, mockResponse);
  })
  .onGet('/api/system/information').reply(config => {
    mockResponse = [200, db.get('system').value()];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPut('/api/system/device-name').reply(config => {
    const newItem = JSON.parse(config.data);
    mockResponse = [200, db.get('system').assign(newItem).write()];
    return mockResponseWithLog(config, mockResponse);
  })
  .onGet('/api/groups').reply(config => {
    mockResponse = [200, {
      items: db.get('groups').value()
    }];
    return mockResponseWithLog(config, mockResponse);
  })
  .onGet(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    const data = db.get('groups').find({id: itemId}).value();
    mockResponse = [200, data];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPut(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    const data = db.get('groups').find({id: itemId}).assign(newItem).write();
    mockResponse = [200, data];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPost('/api/groups').reply(config => {
    const newItem = JSON.parse(config.data);
    newItem.id = uuidv4();
    db.get('groups').push(newItem).write();
    mockResponse = [200, newItem];
    return mockResponseWithLog(config, mockResponse);
  })
  .onDelete(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    db.get('groups').remove({id: itemId}).write();
    mockResponse = [204, {}];
    return mockResponseWithLog(config, mockResponse);
  })
  .onGet('/api/members').reply(config => {
    const data = db.get('members').value();
    mockResponse = [200, {
      index: 0,
      size: 20,
      total: data.length,
      items: data
    }];
    return mockResponseWithLog(config, mockResponse);
  })
  .onGet(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const data = db.get('members').find({id: itemId}).value();
    mockResponse = [200, data];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPut(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    const data = db.get('members').find({id: itemId}).assign(newItem).write();
    mockResponse = [200, data];
    return mockResponseWithLog(config, mockResponse);
  })
  .onPost('/api/members').reply(config => {
    const newItem = JSON.parse(config.data);
    newItem.id = uuidv4();
    db.get('members').push(newItem).write();
    mockResponse = [200, newItem];
    return mockResponseWithLog(config, mockResponse);
  })
  .onDelete(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    db.get('members').remove({id: itemId}).write();
    mockResponse = [204, {}];
    return mockResponseWithLog(config, mockResponse);
  })
  .onAny().passThrough(); // Pass other request to normal axios
