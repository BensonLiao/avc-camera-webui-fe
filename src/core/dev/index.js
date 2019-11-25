const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const uuidv4 = require('uuid/v4');
const mockDB = require('./db');
const db = mockDB.init();
const mockAxios = new MockAdapter(axios);
mockAxios.onGet('/api/video/settings').reply(() => {
  return [200, db.get('video').value()];
})
  .onPut('/api/video/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return [200, db.get('video').assign(newItem).write()];
  })
  .onPost('/api/video/settings/_reset').reply(() => {
    const defaultItem = db.get('videoDefault').value();
    return [204, db.get('video').assign(defaultItem).write()];
  })
  .onGet('/api/system/information').reply(() => {
    return [200, db.get('system').value()];
  })
  .onPut('/api/system/device-name').reply(config => {
    const newItem = JSON.parse(config.data);
    return [200, db.get('system').assign(newItem).write()];
  })
  .onGet('/api/groups').reply(() => {
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
    newItem.id = uuidv4();
    db.get('groups').push(newItem).write();
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
    newItem.id = uuidv4();
    db.get('members').push(newItem).write();
    return [200, newItem];
  })
  .onDelete(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    db.get('members').remove({id: itemId}).write();
    return [204, {}];
  })
  .onGet('/api/users').reply(() => {
    const data = db.get('users').value();
    delete data.birthday;
    return [200, {
      total: data.length,
      items: data
    }];
  })
  .onGet(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    const data = db.get('users').find({id: itemId}).value();
    return [200, data];
  })
  .onPut(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    const currentItem = db.get('users').find({id: itemId}).value();
    const newItem = JSON.parse(config.data);
    if (currentItem.password !== '' && currentItem.password !== newItem.password) {
      return [204, {messsage: 'Your old password is incorrect.'}];
    }

    newItem.id = itemId;
    newItem.permission = parseInt(newItem.permission, 10);
    newItem.password = newItem.newPassword;
    delete newItem.newPassword;
    db.get('users').find({id: itemId}).assign(newItem).write();
    return [200, newItem];
  })
  .onPost('/api/users').reply(config => {
    const newItem = JSON.parse(config.data);
    const maxId = db.get('users').sortBy('id').takeRight(1).value()[0].id;
    newItem.id = maxId + 1;
    newItem.permission = parseInt(newItem.permission, 10);
    db.get('users').push(newItem).write();
    return [200, newItem];
  })
  .onDelete(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    db.get('users').remove({id: itemId}).write();
    return [204, {}];
  })
  .onAny().passThrough(); // Pass other request to normal axios
