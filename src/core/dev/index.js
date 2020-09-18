const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const uuidv4 = require('uuid/v4');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');

/**
 * Log mock XHR like axios with console.groupCollapsed() and return mock response.
 * @param {Object} req XHR request instance,
 * or if we use library like axios then `req` is the axios request config and contains things like `url`.
 * @see https://github.com/axios/axios#request-config
 * @param {Array<Number, ?Object, ?Object>} res Accept any type of response,
 * or if we use library like axios-mock-adapter then this will be an array in the form of [status, data, headers].
 * @see https://github.com/ctimmerm/axios-mock-adapter
 * @returns {Array<Number, ?Object, ?Object>} Same object as `res`.
 */
const mockResponseWithLog = (req, res) => {
  console.groupCollapsed(`[${res[0]}] ${req.method} ${req.url}`);
  console.log('request config:', req);
  console.log('response: [status, data, headers]', res);
  console.groupEnd();
  return res;
};

const isArray = arg => Object.prototype.toString.call(arg) === '[object Array]';

const mockDB = require('./db');
const db = mockDB.init();
const mockAxios = new MockAdapter(axios);
mockAxios.onGet('/api/ping/web').reply(config => new Promise((resolve, _) => {
  setTimeout(() => {
    resolve(mockResponseWithLog(config, [config.params.mock ? 500 : 200]));
  }, 1000);
}))
  .onGet('/api/ping/app').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(mockResponseWithLog(config, [200]));
    }, 3000);
  }))
  .onGet('/api/system/adbconfig').reply(config => {
    return mockResponseWithLog(config, [200, db.get('adbConfig').value()]);
  })
  .onPut('/api/system/adbconfig').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('adbConfig').assign(newItem).write()]);
  })
  .onGet('/api/video/settings').reply(config => {
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
  .onPost('/api/_validate/account-birthday').reply(config => {
    return mockResponseWithLog(config, [200, {}]);
  })
  .onPost('/api/_validate/account-birthday').reply(config => {
    return mockResponseWithLog(config, [200, {}]);
  })
  .onPost('/api/account/_change-password').reply(config => {
    return mockResponseWithLog(config, [200, {}]);
  })
  .onGet('/api/system/information').reply(config => {
    return mockResponseWithLog(config, [200, db.get('system').value()]);
  })
  .onGet('/api/system/datetime').reply(config => {
    return mockResponseWithLog(config, [200, db.get('systemDateTime').value()]);
  })
  .onPut('/api/system/datetime').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('systemDateTime').assign(data).write()]);
  })
  .onPut('/api/system/language').reply(config => {
    const data = {
      ...db.get('system').value(),
      languageCode: JSON.parse(config.data).language
    };
    return mockResponseWithLog(config, [200, db.get('system').assign(data).write()]);
  })
  .onGet('/api/system/network').reply(config => {
    return mockResponseWithLog(config, [200, db.get('networkSettings').value()]);
  })
  .onPut('/api/system/network').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('networkSettings').assign(data).write()]);
  })
  .onPost('/api/system/network/testdhcp').reply(config => {
    return mockResponseWithLog(config, [200, {
      success: 1,
      resultIP: '19.168.88.99'
    }]);
  })
  .onGet('/api/system/network/tcpip/ddns').reply(config => {
    return mockResponseWithLog(config, [200, db.get('ddnsSettings').value()]);
  })
  .onPut('/api/system/network/tcpip/ddns').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('ddnsSettings').assign(data).write()]);
  })
  .onGet('/api/system/network/tcpip/http').reply(config => {
    return mockResponseWithLog(config, [200, db.get('httpSettings').value()]);
  })
  .onPut('/api/system/network/tcpip/http').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('httpSettings').assign(data).write()]);
  })
  .onGet('/api/system/https').reply(config => {
    return mockResponseWithLog(config, [200, db.get('httpsSettings').value()]);
  })
  .onPost('/api/system/systeminfo/sdcard').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      const data = {
        ...db.get('system').value(),
        ...JSON.parse(config.data)
      };
      resolve(mockResponseWithLog(config, [200, db.get('system').assign(data).write()]));
    }, 1000);
  }))
  .onPost('/api/system/systeminfo/sdcardalert').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      const data = {
        ...db.get('system').value(),
        ...JSON.parse(config.data)
      };
      resolve(mockResponseWithLog(config, [200, db.get('system').assign(data).write()]));
    }, 1000);
  }))
  .onPost('/api/system/systeminfo/sdcard/format').reply(config => {
    return mockResponseWithLog(config, [200]);
  })
  .onPost('/api/system/systeminfo/sdcard/unmount').reply(config => {
    return mockResponseWithLog(config, [200]);
  })
  .onPut('/api/system/https').reply(config => {
    const data = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('httpsSettings').assign(data).write()]);
  })
  .onPost('/api/system/reboot').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(mockResponseWithLog(config, [204, {}]));
    }, 3000);
  }))
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
  .onGet('/api/system/systeminfo/log.zip').reply(config => {
    return mockResponseWithLog(config, [200, new Blob()]
    );
  })
  .onPost('/api/system/systeminfo/clearLog').reply(config => {
    return mockResponseWithLog(config, [204, {}]);
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
  .onGet('/api/multimedia/hdmi/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('hdmiSettings').value()]
    );
  })
  .onPut('/api/multimedia/hdmi/settings').reply(config => {
    const newItem = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('hdmiSettings').assign(newItem).write()]);
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
    const card = {
      id: (cards.sort((a, b) => b.id - a.id)[0] || {id: 0}).id + 1,
      ...JSON.parse(config.data)
    };
    cards.push(card);
    db.get('notificationCards').assign(cards).write();
    return mockResponseWithLog(config, [200, card]);
  })
  .onPut(/api\/notification\/cards\/\d+$/).reply(config => {
    const id = parseInt(config.url.replace('/api/notification/cards/', ''), 10);
    const card = {
      id,
      ...JSON.parse(config.data)
    };
    return mockResponseWithLog(config, [200, db.get('notificationCards').find({id}).assign(card).write()]);
  })
  .onDelete(/api\/notification\/cards\/\d+$/).reply(config => {
    const id = config.url.replace('/api/notification/cards/', '');
    db.get('notificationCards').remove({id: parseInt(id, 10)}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onGet('/api/groups').reply(config => {
    return mockResponseWithLog(config, [200, {items: db.get('groups').value()}]);
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
  .onGet('/api/members').reply(config =>
    new Promise((resolve, _) => {
      const itemChunkIndex = Number(config.params.index) || 0;
      const itemChunkSize = Number(config.params.size) || 10;
      let data = db.get('members').value();
      if (config.params.keyword) {
        data = data.filter(value => {
          const groups = db.get('groups').find({id: value.groupId}).value();
          return value.name.indexOf(config.params.keyword) >= 0 ||
                 value.organization.indexOf(config.params.keyword) >= 0 ||
                 (groups && groups.name.indexOf(config.params.keyword) >= 0) ||
                 value.note.indexOf(config.params.keyword) >= 0;
        });
      }

      const pageData = data.slice(
        itemChunkIndex * itemChunkSize,
        (itemChunkIndex + 1) * itemChunkSize
      );
      setTimeout(() => {
        resolve(mockResponseWithLog(config, [200, {
          index: itemChunkIndex,
          size: itemChunkSize,
          total: data.length,
          items: pageData
        }]));
      }, 500);
    })
  )
  .onGet(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    return mockResponseWithLog(config, [200, db.get('members').find({id: itemId}).value()]);
  })
  .onPut(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    const newItem = JSON.parse(config.data);
    newItem.id = itemId;
    if (newItem.name === 'test400') {
      return mockResponseWithLog(config, [400, new Error('Bad Request')]);
    }

    if (newItem.name === 'test500') {
      return mockResponseWithLog(config, [500]);
    }

    return mockResponseWithLog(config, [200, db.get('members').find({id: itemId}).assign(newItem).write()]);
  })
  .onPost('/api/members').reply(config => {
    const newItem = JSON.parse(config.data);
    newItem.id = uuidv4();
    if (newItem.name === 'test400') {
      return mockResponseWithLog(config, [400, new Error('Bad Request')]);
    }

    if (newItem.name === 'test500') {
      return mockResponseWithLog(config, [500]);
    }

    return mockResponseWithLog(config, [200, db.get('members').push(newItem).write()]);
  })
  .onDelete(/api\/members\/[a-f0-9-]{36}$/).reply(config => {
    const itemId = config.url.replace('/api/members/', '');
    db.get('members').remove({id: itemId}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onPost('/api/members/validate-picture').reply(config => new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(mockResponseWithLog(config, [200, {vectors: '-1.5556641|0.6513672|0.98339844|1.7167969|0.31469727|1.0039062|1.2324219|-1.2900391|-1.1025391|-0.06774902|-0.18640137|-0.2388916|0.98876953|1.1708984|0.46679688|0.33325195|-0.54345703|1.1679688|-1.3925781|-0.29174805|1.2333984|0.33618164|0.27563477|0.68603516|1.0507812|-0.82958984|1.1220703|-0.92578125|-1.0791016|0.8652344|1.1513672|-0.05999756|-0.031707764|-0.39208984|0.62060547|-0.71240234|1.2998047|-0.38549805|-0.6254883|-0.359375|1.0605469|-0.69384766|1.9082031|0.31445312|1.3095703|0.48291016|1.8291016|-0.32861328|-0.6567383|0.078063965|-0.52197266|-2.1015625|-1.4453125|-0.80371094|-0.1665039|1.4375|-2.4394531|0.5449219|-1.6035156|0.5317383|0.6411133|0.3203125|-0.35595703|1.0898438|-0.95996094|-0.7402344|-0.4765625|0.38134766|0.26611328|0.17626953|-0.11102295|0.8515625|1.5234375|0.9892578|1.6708984|-0.3564453|-0.55615234|0.5288086|1.4619141|-0.1640625|-1.0332031|-0.0014228821|1.0800781|0.2788086|0.31640625|-1.4296875|-0.8125|-1.6435547|0.97558594|0.9394531|0.8100586|0.52685547|-0.5361328|0.107299805|-0.9482422|-2.0664062|0.42773438|-1.1542969|-0.80810547|1.1025391|0.6010742|0.74902344|0.19067383|-0.25927734|-0.80566406|-1.5957031|0.4230957|-0.36572266|-0.55566406|0.38916016|0.7861328|0.7001953|-0.64208984|0.4489746|0.3762207|0.37646484|-1.0|0.6508789|-0.20788574|-1.0849609|0.6430664|1.2910156|0.9926758|0.5888672|-1.4609375|0.071777344|-1.0644531|0.22192383|'}]));
    }, 2000);
  }))
  .onPost('/api/members/add-photo').reply(config => new Promise((resolve, _) => {
    const data = JSON.parse(config.data);
    const member = db.get('members').find({id: data.id}).value();
    member.pictures.push(data.picture.replace('data:image/jpeg;base64,', ''));
    setTimeout(() => {
      resolve(mockResponseWithLog(config, [200, db.get('members').find({id: config.data.id}).assign(member).write()]));
    }, 1500);
  }))
  .onGet('/api/members/total-count').reply(config => {
    const totalPhotos = db.get('members').value().reduce((total, elem) => {
      return total + elem.pictures.length;
    }, 0);

    return mockResponseWithLog(config, [200, {totalCount: totalPhotos}]);
  })
  .onGet('/api/members/remaining-picture-count').reply(config => mockResponseWithLog(config, [200, 3]))
  .onGet('/api/face-events').reply(config => {
    const data = db.get('faceEvents')
      .filter(value => {
        if (config.params.confidence && config.params.confidence.length > 0) {
          if (typeof config.params.confidence === 'string') {
            switch (config.params.confidence) {
              default:
                return true;
              case Similarity.low:
                return value.confidences[0].score < 55;
              case Similarity.medium:
                return value.confidences[0].score >= 55 && value.confidences[0].score < 65;
              case Similarity.high:
                return value.confidences[0].score >= 65;
            }
          }

          if (isArray(config.params.confidence)) {
            if (config.params.confidence.length === Similarity.all().length) {
              return true;
            }

            if (config.params.confidence.indexOf(Similarity.low) > 0 &&
            config.params.confidence.indexOf(Similarity.medium) > 0) {
              return value.confidences[0].score < 65;
            }

            if (config.params.confidence.indexOf(Similarity.low) > 0 &&
            config.params.confidence.indexOf(Similarity.high) > 0) {
              return value.confidences[0].score < 55 || value.confidences[0].score >= 65;
            }

            if (config.params.confidence.indexOf(Similarity.medium) > 0 &&
            config.params.confidence.indexOf(Similarity.high) > 0) {
              return value.confidences[0].score >= 55;
            }

            if (config.params.confidence.indexOf(Similarity.low) > 0) {
              return value.confidences[0].score < 55;
            }

            if (config.params.confidence.indexOf(Similarity.medium) > 0) {
              return value.confidences[0].score >= 55 && value.confidences[0].score < 65;
            }

            if (config.params.confidence.indexOf(Similarity.high) > 0) {
              return value.confidences[0].score >= 65;
            }
          }
        }

        return true;
      })
      .filter(value => {
        if (config.params.enrollStatus && config.params.enrollStatus.length > 0) {
          if (typeof config.params.enrollStatus === 'string') {
            return config.params.enrollStatus === value.recognitionType;
          }

          if (isArray(config.params.enrollStatus)) {
            if (config.params.enrollStatus.length === RecognitionType.all().length) {
              return true;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.registered) >= 0 &&
            config.params.enrollStatus.indexOf(RecognitionType.unknown) >= 0) {
              return RecognitionType.registered === value.recognitionType ||
                RecognitionType.unknown === value.recognitionType;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.registered) >= 0 &&
            config.params.enrollStatus.indexOf(RecognitionType.fake) >= 0) {
              return RecognitionType.registered === value.recognitionType ||
                RecognitionType.fake === value.recognitionType;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.fake) >= 0 &&
            config.params.enrollStatus.indexOf(RecognitionType.unknown) >= 0) {
              return RecognitionType.fake === value.recognitionType ||
                RecognitionType.unknown === value.recognitionType;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.registered) >= 0) {
              return RecognitionType.registered === value.recognitionType;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.unknown) >= 0) {
              return RecognitionType.unknown === value.recognitionType;
            }

            if (config.params.enrollStatus.indexOf(RecognitionType.fake) >= 0) {
              return RecognitionType.fake === value.recognitionType;
            }
          }
        }

        return true;
      })
      .value();
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
    return mockResponseWithLog(config, [200, db.get('users').push(newItem).write()]);
  })
  .onDelete(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    db.get('users').remove({id: itemId}).write();
    return mockResponseWithLog(config, [204, {}]);
  })
  .onGet('/api/members/database-encryption-settings').reply(config => {
    return mockResponseWithLog(config, [200, {password: '0000'}]);
  })
  .onPut('/api/members/database-encryption-settings').reply(config => {
    return mockResponseWithLog(config, [200, {password: '0000'}]);
  })
  .onPost('/api/members/database').reply(config => {
    return mockResponseWithLog(config, [204]);
  })
  .onGet('/api/face-recognition/settings').reply(config => {
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').value()]);
  })
  .onGet('/api/face-recognition/fr').reply(config => {
    return mockResponseWithLog(config, [200, db.get('faceRecognitionStatus').value()]);
  })
  .onPut('/api/face-recognition/fr').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(settings).write()]);
  })
  .onPut('/api/face-recognition/spoofing').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(settings).write()]);
  })
  .onPut('/api/face-recognition/confidencelevel').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(settings).write()]);
  })
  .onPut('/api/face-recognition/enrolldisplay').reply(config => {
    const settings = JSON.parse(config.data);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(settings).write()]);
  })
  .onPut('/api/face-recognition/roi').reply(config => {
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
    if (authKey === 'test') {
      return mockResponseWithLog(config, [500]);
    }

    const enabledFunctions = {
      isEnableFaceRecognitionKey: true,
      isEnableAgeGenderKey: false,
      isEnableHumanoidDetectionKey: false
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
  .onGet('/api/auth-status').reply(config => {
    return mockResponseWithLog(config, [200, db.get('authStatus').value()]);
  })
  .onAny().passThrough(); // Pass other request to normal axios
