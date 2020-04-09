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
  .onPut('/api/video/settings/focus').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      const data = {
        ...db.get('video').value(),
        ...JSON.parse(config.data)
      };
      resolve(mockResponseWithLog(config, [200, db.get('video').assign(data).write()]));
    }, 1000);
  }))
  .onPost('/api/video/settings/_reset').reply(config => {
    const defaultItem = db.get('videoDefault').value();
    return mockResponseWithLog(config, [200, db.get('video').assign(defaultItem).write()]);
  })
  .onPost('/api/video/settings/_auto-focus').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(mockResponseWithLog(config, [204, {}]));
    }, 3000); // The real api is delay 45s.
  }))
  .onPost('/api/system/_setup').reply(config => {
    return mockResponseWithLog(config, [200, {}]);
  })
  .onGet('/api/system/information').reply(config => {
    return mockResponseWithLog(config, [200, db.get('system').value()]);
  })
  .onGet('/api/system/datetime').reply(config => {
    return mockResponseWithLog(config, [200, db.get('systemDateTime').value()]);
  })
  .onPost('/api/system/datetime').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('systemDateTime').assign(data).write()]);
  })
  .onGet('/api/system/network').reply(config => {
    return mockResponseWithLog(config, [200, db.get('networkSettings').value()]);
  })
  .onGet('/api/system/https').reply(config => {
    return mockResponseWithLog(config, [200, db.get('httpsSettings').value()]);
  })
  .onPut('/api/system/https').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('httpsSettings').assign(data).write()]);
  })
  .onPost('/api/system/reboot').reply(config => {
    return mockResponseWithLog(config, [204, {}]);
  })
  .onPost('/api/system/resetdefault').reply(config => {
    return mockResponseWithLog(config, [204, {}]);
  })
  .onPost('/api/system/importsettings').reply(config => {
    return mockResponseWithLog(config, [204, {}]);
  })
  .onPut('/api/system/device-name').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('system').assign(newItem).write()]);
  })
  .onGet('/api/multimedia/stream/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('stream').value()]
    );
  })
  .onPut('/api/multimedia/stream/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('stream').assign(newItem).write()]);
  })
  .onPost('/api/multimedia/stream/settings/_reset').reply(config => {
    const defaultItem = db.get('streamDefault').value();
    return mockResponseWithLog(config, [200, db.get('stream').assign(defaultItem).write()]);
  })
  .onGet('/api/multimedia/audio/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('audioSettings').value()]);
  })
  .onPut('/api/multimedia/audio/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('audioSettings').assign(newItem).write()]);
  })
  .onGet('/api/multimedia/rtsp/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('rtspSettings').value()]);
  })
  .onPut('/api/multimedia/rtsp/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('rtspSettings').assign(newItem).write()]);
  })
  .onGet('/api/multimedia/privacy-mask/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('privacyMaskSettings').value()]);
  })
  .onPut('/api/multimedia/privacy-mask/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('privacyMaskSettings').assign(newItem).write()]);
  })
  .onGet('/api/multimedia/word/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('wordSettings').value()]);
  })
  .onPut('/api/multimedia/word/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('wordSettings').assign(newItem).write()]);
  })
  .onGet('/api/notification/app/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('notificationAppSettings').value()]);
  })
  .onPut('/api/notification/app/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('notificationAppSettings').assign(newItem).write()]);
  })
  .onGet('/api/notification/io-in/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('notificationIOInSettings').value()]);
  })
  .onPut('/api/notification/io-in/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('notificationIOInSettings').assign(newItem).write()]);
  })
  .onGet('/api/notification/io-out/0/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').value()[0]]);
  })
  .onPut('/api/notification/io-out/0/settings').reply(config => {
    const data = [
      JSON.parse(config.data),
      db.get('notificationIOOutSettings').value()[1]
    ];
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').assign(data).write()]);
  })
  .onGet('/api/notification/io-out/1/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').value()[1]]);
  })
  .onPut('/api/notification/io-out/1/settings').reply(config => {
    const data = [
      db.get('notificationIOOutSettings').value()[0],
      JSON.parse(config.data)
    ];
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').assign(data).write()]);
  })
  .onGet('/api/notification/smtp/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('notificationSMTPSettings').value()]);
  })
  .onPut('/api/notification/smtp/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('notificationSMTPSettings').assign(newItem).write()]);
  })
  .onGet('/api/notification/cards').reply(config => {
    return mockResponseWithLog(config, [200, {items: db.get('notificationCards').value()}]);
  })
  .onPost('/api/notification/cards').reply(config => {
    const cards = db.get('notificationCards').value();
    const card = {id: (cards.sort((a, b) => b.id - a.id)[0] || {id: 0}).id + 1, ...JSON.parse(config.data)};
    cards.push(card);
    db.get('notificationCards').assign(cards).write();
    return mockResponseWithLog(config, [200, card]);
  })
  .onPut(/api\/notification\/cards\/\d+$/).reply(config => {
    const id = parseInt(config.url.replace('/api/notification/cards/', ''), 10);
    const card = {id, ...JSON.parse(config.data)};
    return mockResponseWithLog(config, [200, db.get('notificationCards').find({id}).assign(card).write()]);
  })
  .onDelete(/api\/notification\/cards\/\d+$/).reply(config => {
    const id = config.url.replace('/api/notification/cards/', '');
    db.get('notificationCards').remove({id: parseInt(id, 10)}).write();
    return mockResponseWithLog(config, [204, {}]);
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
    const itemChunkIndex = Number(config.params.index) || 0;
    const itemChunkSize = 20;
    const data = db.get('members').value();
    const pageData = data.slice(
      itemChunkIndex * itemChunkSize,
      (itemChunkIndex + 1) * itemChunkSize
    );
    return mockResponseWithLog(config, [200, {
      index: itemChunkIndex,
      size: itemChunkSize,
      total: data.length,
      items: pageData
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
  .onGet('/api/members/database-encryption-settings').reply(config => {
    return mockResponseWithLog(config, [200, {
      password: '0000'
    }]);
  })
  .onPut('/api/members/database-encryption-settings').reply(config => {
    return mockResponseWithLog(config, [200, {
      password: '0000'
    }]);
  })
  .onPost('/api/members/database').reply(config => {
    return mockResponseWithLog(config, [204]);
  })
  .onGet('/api/face-recognition/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').value()]);
  })
  .onPut('/api/face-recognition/settings').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(settings).write()]);
  })
  .onGet('/api/motion-detection/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('motionDetectionSettings').value()]);
  })
  .onPut('/api/motion-detection/settings').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('motionDetectionSettings').assign(settings).write()]);
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
      isEnable: true,
      ...enabledFunctions
    };
    newItem.time = new Date();
    db.get('authKeys').push(newItem).write();
    return mockResponseWithLog(config, [200, enabledFunctions]);
  })
  .onAny().passThrough(); // Pass other request to normal axios
