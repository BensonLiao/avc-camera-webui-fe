const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const uuidv4 = require('uuid/v4');
const {mockResponseWithLog} = require('../utils');
const mockDB = require('./db');
const db = mockDB.init();
const mockAxios = new MockAdapter(axios);
mockAxios.onGet('/api/video/settings').reply(config => {
  return mockResponseWithLog(config, [200, db.get('video').value()]
  );
})
  .onPut('/api/video/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('video').assign(newItem).write()]);
  })
  .onPost('/api/video/settings/_reset').reply(config => {
    const defaultItem = db.get('videoDefault').value();
    return mockResponseWithLog(config, [200, db.get('video').assign(defaultItem).write()]);
  })
  .onGet('/api/system/information').reply(config => {
    return mockResponseWithLog(config, [200, db.get('system').value()]);
  })
  .onPut('/api/system/device-name').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('system').assign(newItem).write()]);
  })
  .onGet('/api/groups').reply(config => {
    return mockResponseWithLog(config, [200, {
      items: db.get('groups').value()
    }]);
  })
  .onGet(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    return mockResponseWithLog(config, [200, db.get('groups').find({id: itemId}).value()]);
  })
  .onPut(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    return mockResponseWithLog(config, [200, db.get('groups').find({id: itemId}).assign(newItem).write()]);
  })
  .onPost('/api/groups').reply(config => {
    const newItem = JSON.parse(config.data);
    newItem.id = uuidv4();
    return mockResponseWithLog(config, [200, db.get('groups').push(newItem).write()]);
  })
  .onDelete(/api\/groups\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/groups/', '');
    db.get('groups').remove({id: itemId}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onGet('/api/members').reply(config => {
    const data = db.get('members').value();
    return mockResponseWithLog(config, [200, {
      index: 0,
      size: 20,
      total: data.length,
      items: data
    }]);
  })
  .onGet(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    return mockResponseWithLog(config, [200, db.get('members').find({id: itemId}).value()]);
  })
  .onPut(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    return mockResponseWithLog(config, [200, db.get('members').find({id: itemId}).assign(newItem).write()]);
  })
  .onPost('/api/members').reply(config => {
    const newItem = JSON.parse(config.data);
    newItem.id = uuidv4();
    return mockResponseWithLog(config, [200, db.get('members').push(newItem).write()]);
  })
  .onDelete(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    db.get('members').remove({id: itemId}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onGet('/api/face-events').reply(config => {
    const data = db.get('faceEvents').value();
    return mockResponseWithLog(config, [200, {
      index: 0,
      size: 20,
      total: data.length,
      items: data
    }]);
  })
  .onGet('/api/users').reply(config => {
    const data = db.get('users').value();
    delete data.birthday;
    return mockResponseWithLog(config, [200, {
      total: data.length,
      items: data
    }]);
  })
  .onGet(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    return mockResponseWithLog(config, [200, db.get('users').find({id: itemId}).value()]);
  })
  .onPut(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    const currentItem = db.get('users').find({id: itemId}).value();
    const newItem = JSON.parse(config.data);
    if (currentItem.password !== '' && currentItem.password !== newItem.password) {
      return mockResponseWithLog(config, [204, {messsage: 'Your old password is incorrect.'}]);
    }

    newItem.id = itemId;
    newItem.permission = parseInt(newItem.permission, 10);
    newItem.password = newItem.newPassword;
    delete newItem.newPassword;
    return mockResponseWithLog(config, [200, db.get('users').find({id: itemId}).assign(newItem).write()]);
  })
  .onPost('/api/users').reply(config => {
    const newItem = JSON.parse(config.data);
    const maxId = db.get('users').sortBy('id').takeRight(1).value()[0].id;
    newItem.id = maxId + 1;
    newItem.permission = parseInt(newItem.permission, 10);
    return mockResponseWithLog(config, [200, db.get('users').push(newItem).write()]);
  })
  .onDelete(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    db.get('users').remove({id: itemId}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onGet('/api/auth-keys').reply(config => {
    const data = db.get('authKeys').value();
    return mockResponseWithLog(config, [200, {
      total: data.length,
      items: data
    }]);
  })
  .onPost('/api/auth-keys').reply(config => {
    const authKey = JSON.parse(config.data).authKey;
    const enabledFunctions = {
      isEnableFaceRecognition: true,
      isEnableAgeGender: false,
      isEnableHumanoidDetection: false
    };
    const newItem = {
      authKey,
      user: {
        id: window.user.id,
        name: window.user.account
      },
      isEnable: 1,
      ...enabledFunctions
    };
    newItem.time = new Date();
    db.get('authKeys').push(newItem).write();
    return mockResponseWithLog(config, [200, enabledFunctions]);
  })
  .onAny().passThrough(); // Pass other request to normal axios
