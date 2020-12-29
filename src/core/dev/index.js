const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const uuidv4 = require('uuid/v4');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const utils = require('./utils');

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

/**
 * Delay a function for a determined time to simulate server process time
 * @param {function} func - function to exeute and return
 * @param {number} delay - in ms
 * @return {Promise}
 */
const setDelay = (func, delay) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(func);
    }, delay);
  });
};

const mockDB = require('./db');
const db = mockDB.init();
const mockAxios = new MockAdapter(axios);

mockAxios
  .onGet('/api/ping/web').reply(config => {
    // Condition to mock server restart (unreachable) is determined by if two pings are within 1200 ms of each other
    // All device restart ping checks are set to 1000 ms interval
    let ping = db.get('ping').value();
    if (new Date() - new Date(ping.lastPinged) > 1200) {
      db.get('ping').assign({
        count: 0,
        lastPinged: new Date()
      }).write();
      return mockResponseWithLog(config, [config.params.mock ? 500 : 200]);
    }

    db.get('ping').assign({
      lastPinged: new Date(),
      count: ++ping.count
    }).write();
    // Simulate pinging web x times until server is unreachable (mock restarting)
    if (ping.count >= 2) {
      db.get('ping').assign({
        ...ping,
        lastPinged: new Date()
      }).write();
      return;
    }

    // Return OK response if ping is not used for device restart check
    return mockResponseWithLog(config, [config.params.mock ? 500 : 200]);
  })
  .onGet('/api/ping/app').reply(config => {
    // Length of time for mock restarting device (seconds)
    const restartTimeLength = 2;

    let {count} = db.get('ping').value();
    // Count is to simulate process has finished pinging 'web' x times
    if (count >= 2) {
      return setDelay(mockResponseWithLog(config, [200]), restartTimeLength * 1000);
    }

    return mockResponseWithLog(config, [200]);
  })
  .onGet('/api/system/adbconfig').reply(config => mockResponseWithLog(config, [200, db.get('adbConfig').value()]))
  .onPut('/api/system/adbconfig').reply(config => mockResponseWithLog(config, [200, db.get('adbConfig').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/video/settings').reply(config => mockResponseWithLog(config, [200, db.get('video').value()]))
  .onPut('/api/video/settings').reply(config => mockResponseWithLog(config, [200, db.get('video').assign(JSON.parse(config.data)).write()]))
  .onPut('/api/video/settings/focus').reply(config => {
    const data = {
      ...db.get('video').value(),
      ...JSON.parse(config.data)
    };
    return setDelay(mockResponseWithLog(config, [200, db.get('video').assign(data).write()]), 1000);
  })
  .onGet('/api/video/focusposition').reply(config => {
    let data = db.get('video').value();

    data.mockFocalProcessFinished = false;

    // If process terminated, reset values
    if ((new Date() - new Date(data.mocklastRefreshed) > 1200 && data.mockFocalProcessTime !== 0) ||
     (data.mockFocalProcessTime < 0 && data.mockFocalProcessFinished === false)) {
      data = {
        ...data,
        mocklastRefreshed: Date.now(),
        mockFocalProcessFinished: true,
        mockFocalProcessTime: 0,
        mockOriginalFocalLength: data.focalLength
      };
    }

    // Send same focal length again to trigger VideoSetting matchFocalLength terminate condition
    if (data.mockFocalProcessFinished && data.mockFocalProcessTime < 0) {
      data.mockFocalProcessTime = ++data.mockFocalProcessTime;
    }

    if (!data.mockFocalProcessFinished && data.mockFocalProcessTime >= 0) {
      // ** Variables
      // Time function
      let time = data.mockFocalProcessTime;
      // Max amplitude, also starting value
      const maxOscillatingFocalLength = 100;
      // The larger the value, the quicker it reaches final focal length
      const dampingCoefficient = 0.5;
      // Period of sine wave, the larger the value, the smaller the wave period, i.e. higher frequency
      const angularFrequency = 5;

      // ** Function
      // Damping oscillating function to mimick oscillating focus position
      const dampingOscillatingFunction = ((maxOscillatingFocalLength * (Math.E ** (-dampingCoefficient * time))) / Math.cos(angularFrequency * time));

      // Calculate mock focal length with oscillating difference
      const mockFocalLength = Math.round(data.mockOriginalFocalLength + dampingOscillatingFunction);
      data = {
        ...data,
        mockFocalProcessTime: ++time,
        focalLength: mockFocalLength,
        mocklastRefreshed: Date.now()
      };

      // Mock focus finished
      if (Math.abs(Math.round(data.mockOriginalFocalLength - mockFocalLength)) < 5 && data.mockFocalProcessTime >= 0) {
        data = {
          ...data,
          mockFocalProcessFinished: true,
          mockFocalProcessTime: -1,
          focalLength: mockFocalLength,
          mockOriginalFocalLength: mockFocalLength
        };
      }
    }

    db.get('video').assign(data).write();
    return mockResponseWithLog(config, [200, data]);
  })
  .onPost('/api/video/settings/_reset').reply(config => mockResponseWithLog(config, [200, db.get('video').assign(db.get('videoDefault').value()).write()]))
  .onPost('/api/video/settings/_auto-focus').reply(config => setDelay(mockResponseWithLog(config, [204, {}]), 1000))
  .onPost('/api/system/_setup').reply(config => mockResponseWithLog(config, [200, {}]))
  .onGet('/api/system/information').reply(config => mockResponseWithLog(config, [200, db.get('system').value()]))
  .onGet('/api/system/datetime').reply(config => mockResponseWithLog(config, [200, db.get('systemDateTime').value()]))
  .onPut('/api/system/datetime').reply(config => setDelay(mockResponseWithLog(config, [200, db.get('systemDateTime').assign(JSON.parse(config.data)).write()]), 1000))
  .onGet('/api/system/network').reply(config => mockResponseWithLog(config, [200, db.get('networkSettings').value()]))
  .onPut('/api/system/network').reply(config => mockResponseWithLog(config, [200, db.get('networkSettings').assign(JSON.parse(config.data)).write()]))
  .onPost('/api/system/network/testdhcp').reply(config => {
    const result = mockResponseWithLog(config, [200, {
      success: 1,
      resultIP: '192.168.88.99'
    }]);
    return setDelay(result, 1000);
  })
  .onGet('/api/system/network/tcpip/ddns').reply(config => mockResponseWithLog(config, [200, db.get('ddnsSettings').value()]))
  .onPut('/api/system/network/tcpip/ddns').reply(config => mockResponseWithLog(config, [200, db.get('ddnsSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/system/network/tcpip/http').reply(config => mockResponseWithLog(config, [200, db.get('httpSettings').value()]))
  .onPut('/api/system/network/tcpip/http').reply(config => setDelay(mockResponseWithLog(config, [200, db.get('httpSettings').assign(JSON.parse(config.data)).write()]), 2000))
  .onGet('/api/system/https').reply(config => mockResponseWithLog(config, [200, db.get('httpsSettings').value()]))
  .onPost('/api/system/systeminfo/sdcard').reply(config => {
    const data = {
      ...db.get('system').value(),
      ...JSON.parse(config.data)
    };
    return mockResponseWithLog(config, [200, db.get('system').assign(data).write()]);
  })
  .onPost('/api/system/systeminfo/sdcardalert').reply(config => {
    const data = {
      ...db.get('system').value(),
      ...JSON.parse(config.data)
    };
    return (mockResponseWithLog(config, [200, db.get('system').assign(data).write()]));
  })
  .onPost('/api/system/systeminfo/sdcard/format').reply(config => mockResponseWithLog(config, [200]))
  .onPost('/api/system/systeminfo/sdcard/unmount').reply(config => {
    const systemSettings = db.get('system').value();
    systemSettings.sdStatus = 1;
    const data = {...systemSettings};
    return (mockResponseWithLog(config, [200, db.get('system').assign(data).write()]));
  })
  .onPost('/api/system/systeminfo/sdcard/mount').reply(config => {
    const systemSettings = db.get('system').value();
    systemSettings.sdStatus = 0;
    const data = {...systemSettings};
    return (mockResponseWithLog(config, [200, db.get('system').assign(data).write()]));
  })
  .onPut('/api/system/https').reply(config => mockResponseWithLog(config, [200, db.get('httpsSettings').assign(JSON.parse(config.data)).write()]))
  .onPost('/api/system/reboot').reply(config => mockResponseWithLog(config, [204, {}]))
  .onPost('/api/system/resetdefault').reply(config => mockResponseWithLog(config, [204, {}]))
  .onPost('/api/system/importsettings').reply(config => mockResponseWithLog(config, [204, {}]))
  .onPost('/api/system/firmware').reply(config => {
    return new Promise(resolve => {
      // Length of time for mocking uploading firmware (seconds)
      const timeToFinish = 2;

      let count = 0;
      // Set progress bar indicator
      let interval = setInterval(() => {
        config.onUploadProgress({
          loaded: count,
          total: 100
        });
        if (++count === 101) {
          clearInterval(interval);
          resolve();
        }
      }, Math.round(timeToFinish * 10));
    })
      .then(() => {
        return mockResponseWithLog(config, [204, {}]);
      });
  })
  .onPost('/api/system/firmware/upgrade').reply(config => {
    // Number of steps to 100% upgrade
    const stepsToFinish = 3;

    const progress = db.get('upgrade').value();

    // Respond with finished status if upgrade finished
    if (progress.upgradeProgress === stepsToFinish || progress.upgradeProgress > 100) {
      db.get('upgrade').assign({upgradeProgress: 0}).write();
      return mockResponseWithLog(config, [200, {
        updateStatus: 2,
        upgradeProgress: 100
      }]);
    }

    // Respond with upgrade progress percentage
    db.get('upgrade').assign({upgradeProgress: ++progress.upgradeProgress}).write();
    return mockResponseWithLog(config, [200, {
      updateStatus: 0,
      updateProgress: Math.round((progress.upgradeProgress - 1) * 100 / stepsToFinish)
    }]);
  })
  .onPut('/api/system/device-name').reply(config => mockResponseWithLog(config, [200, db.get('system').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/system/systeminfo/log.zip').reply(config => {
    return new Promise(resolve => {
      // Length of time for mocking uploading firmware (seconds)
      const timeToFinish = 2;

      let count = 0;
      // Set progress bar indicator
      let interval = setInterval(() => {
        config.onDownloadProgress({
          loaded: count,
          total: 100
        });
        if (++count === 101) {
          clearInterval(interval);
          resolve();
        }
      }, Math.round(timeToFinish * 10));
    })
      .then(() => {
        return mockResponseWithLog(config, [200, new Blob()]);
      });
  })
  .onPost('/api/system/systeminfo/clearLog').reply(config => mockResponseWithLog(config, [204, {}]))
  .onGet('/api/multimedia/stream/settings').reply(config => mockResponseWithLog(config, [200, db.get('stream').value()]))
  .onPut('/api/multimedia/stream/settings').reply(config => setDelay(mockResponseWithLog(config, [200, db.get('stream').assign(JSON.parse(config.data)).write()]), 1000))
  .onPost('/api/multimedia/stream/settings/_reset').reply(config => mockResponseWithLog(config, [200, db.get('stream').assign(db.get('streamDefault').value()).write()]))
  .onGet('/api/multimedia/audio/settings').reply(config => mockResponseWithLog(config, [200, db.get('audioSettings').value()]))
  .onGet('/api/multimedia/hdmi/settings').reply(config => mockResponseWithLog(config, [200, db.get('hdmiSettings').value()]))
  .onPut('/api/multimedia/hdmi/settings').reply(config => setDelay(mockResponseWithLog(config, [200, db.get('hdmiSettings').assign(JSON.parse(config.data)).write()]), 1000))
  .onPut('/api/multimedia/audio/settings').reply(config => mockResponseWithLog(config, [200, db.get('audioSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/multimedia/rtsp/settings').reply(config => mockResponseWithLog(config, [200, db.get('rtspSettings').value()]))
  .onPut('/api/multimedia/rtsp/settings').reply(config => mockResponseWithLog(config, [200, db.get('rtspSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/multimedia/privacy-mask/settings').reply(config => mockResponseWithLog(config, [200, db.get('privacyMaskSettings').value()]))
  .onPut('/api/multimedia/privacy-mask/settings').reply(config => mockResponseWithLog(config, [200, db.get('privacyMaskSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/multimedia/osd/settings').reply(config => mockResponseWithLog(config, [200, db.get('osdSettings').value()]))
  .onPut('/api/multimedia/osd/settings').reply(config => mockResponseWithLog(config, [200, db.get('osdSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/notification/io-in/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationIOInSettings').value()]))
  .onPut('/api/notification/io-in/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationIOInSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/notification/io-out/0/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').value()[0]]))
  .onPut('/api/notification/io-out/0/settings').reply(config => {
    const data = [
      JSON.parse(config.data),
      db.get('notificationIOOutSettings').value()[1]
    ];
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').assign(data).write()]);
  })
  .onGet('/api/notification/io-out/1/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').value()[1]]))
  .onPut('/api/notification/io-out/1/settings').reply(config => {
    const data = [
      db.get('notificationIOOutSettings').value()[0],
      JSON.parse(config.data)
    ];
    return mockResponseWithLog(config, [200, db.get('notificationIOOutSettings').assign(data).write()]);
  })
  .onGet('/api/notification/smtp/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationSMTPSettings').value()]))
  .onPut('/api/notification/smtp/settings').reply(config => mockResponseWithLog(config, [200, db.get('notificationSMTPSettings').assign(JSON.parse(config.data)).write()]))
  .onGet('/api/notification/cards').reply(config => mockResponseWithLog(config, [200, {items: db.get('notificationCards').value()}]))
  .onPost('/api/notification/cards').reply(config => {
    const cards = db.get('notificationCards').value();
    const data = JSON.parse(config.data);
    const card = {
      id: (cards.sort((a, b) => b.id - a.id)[0] || {id: 0}).id + 1,
      ...data,
      emailContentPosition: `${data.emailContentPosition}`
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
  .onGet('/api/groups').reply(config => mockResponseWithLog(config, [200, {items: db.get('groups').value()}]))
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
      const {index, size, group, keyword, sort} = config.params;
      const itemChunkIndex = Number(index) || 0;
      const itemChunkSize = Number(size) || 10;
      let data = db.get('members').value();
      if (group) {
        data = data.filter(value => value.groupId === group);
      }

      if (keyword) {
        data = data.filter(value => {
          const groups = db.get('groups').find({id: value.groupId}).value();
          return value.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                 value.organization.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                 (groups && groups.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) ||
                 value.note.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
        });
      }

      if (!sort || sort === '-name') {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (sort) {
        if (sort.indexOf('organization') >= 0) {
          data.sort((a, b) => a.organization.localeCompare(b.organization));
        } else if ((sort.indexOf('group')) >= 0) {
          const groups = db.get('groups').value();
          data.forEach((member, index) => {
            data[index].groupName = (groups.find(x => x.id === member.groupId) || {}).name || '';
            return data[index];
          });
          data.sort((a, b) => a.groupName.localeCompare(b.groupName));
        }

        if (sort.indexOf('-') === 0) {
          data.reverse();
        }
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
      }, 0);
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
  .onPost('/api/members/validate-picture').reply(config => {
    const vector = {vectors: '-1.5556641|0.6513672|0.98339844|1.7167969|0.31469727|1.0039062|1.2324219|-1.2900391|-1.1025391|-0.06774902|-0.18640137|-0.2388916|0.98876953|1.1708984|0.46679688|0.33325195|-0.54345703|1.1679688|-1.3925781|-0.29174805|1.2333984|0.33618164|0.27563477|0.68603516|1.0507812|-0.82958984|1.1220703|-0.92578125|-1.0791016|0.8652344|1.1513672|-0.05999756|-0.031707764|-0.39208984|0.62060547|-0.71240234|1.2998047|-0.38549805|-0.6254883|-0.359375|1.0605469|-0.69384766|1.9082031|0.31445312|1.3095703|0.48291016|1.8291016|-0.32861328|-0.6567383|0.078063965|-0.52197266|-2.1015625|-1.4453125|-0.80371094|-0.1665039|1.4375|-2.4394531|0.5449219|-1.6035156|0.5317383|0.6411133|0.3203125|-0.35595703|1.0898438|-0.95996094|-0.7402344|-0.4765625|0.38134766|0.26611328|0.17626953|-0.11102295|0.8515625|1.5234375|0.9892578|1.6708984|-0.3564453|-0.55615234|0.5288086|1.4619141|-0.1640625|-1.0332031|-0.0014228821|1.0800781|0.2788086|0.31640625|-1.4296875|-0.8125|-1.6435547|0.97558594|0.9394531|0.8100586|0.52685547|-0.5361328|0.107299805|-0.9482422|-2.0664062|0.42773438|-1.1542969|-0.80810547|1.1025391|0.6010742|0.74902344|0.19067383|-0.25927734|-0.80566406|-1.5957031|0.4230957|-0.36572266|-0.55566406|0.38916016|0.7861328|0.7001953|-0.64208984|0.4489746|0.3762207|0.37646484|-1.0|0.6508789|-0.20788574|-1.0849609|0.6430664|1.2910156|0.9926758|0.5888672|-1.4609375|0.071777344|-1.0644531|0.22192383|'};
    return setDelay(mockResponseWithLog(config, [200, vector]), 2000);
  })
  .onPost('/api/members/add-photo').reply(config => {
    const data = JSON.parse(config.data);
    const member = db.get('members').find({id: data.id}).value();
    member.pictures.push(data.picture.replace('data:image/jpeg;base64,', ''));
    return setDelay(mockResponseWithLog(config, [200, db.get('members').find({id: config.data.id}).assign(member).write()]), 2000);
  })
  .onGet('/api/members/total-count').reply(config => {
    const totalPhotos = db.get('members').value().reduce((total, elem) => total + elem.pictures.length, 0);
    return mockResponseWithLog(config, [200, {totalCount: totalPhotos}]);
  })
  .onGet('/api/members/remaining-picture-count').reply(config => mockResponseWithLog(config, [200, 3000]))
  .onGet('/api/face-events').reply(config => {
    const {index, size, keyword, sort, start, end} = config.params;
    const itemChunkIndex = Number(index) || 0;
    const itemChunkSize = Number(size) || 10;

    let data = db.get('faceEvents')
    // filter by similarity
      .filter(value => {
        if (config.params.confidence && config.params.confidence.length > 0) {
          // Remove fake for any similarity filter
          if (value.recognitionType === RecognitionType.fake) {
            return false;
          }

          if (typeof config.params.confidence === 'string') {
            switch (config.params.confidence) {
              default:
                return true;
              case Similarity.low:
                return value.confidences.score < 55;
              case Similarity.medium:
                return value.confidences.score >= 55 && value.confidences.score < 65;
              case Similarity.high:
                return value.confidences.score >= 65;
            }
          }

          if (isArray(config.params.confidence)) {
            if (config.params.confidence.length === Similarity.all().length) {
              return true;
            }

            if (config.params.confidence.indexOf(Similarity.low) >= 0 &&
            config.params.confidence.indexOf(Similarity.medium) > 0) {
              return value.confidences.score < 65;
            }

            if (config.params.confidence.indexOf(Similarity.low) >= 0 &&
            config.params.confidence.indexOf(Similarity.high) > 0) {
              return value.confidences.score < 55 || value.confidences.score >= 65;
            }

            if (config.params.confidence.indexOf(Similarity.medium) >= 0 &&
            config.params.confidence.indexOf(Similarity.high) > 0) {
              return value.confidences.score >= 55;
            }

            if (config.params.confidence.indexOf(Similarity.low) >= 0) {
              return value.confidences.score < 55;
            }

            if (config.params.confidence.indexOf(Similarity.medium) >= 0) {
              return value.confidences.score >= 55 && value.confidences.score < 65;
            }

            if (config.params.confidence.indexOf(Similarity.high) >= 0) {
              return value.confidences.score >= 65;
            }
          }
        }

        return true;
      })
      // filter by status
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
      }).value();

    // filter by time
    if (start || end) {
      // assign default time if not given
      const endTime = end ? new Date(end) : new Date();
      const startTime = start ? new Date(start) : new Date(0);
      data = data.filter(event => (new Date(event.time) >= startTime) && (new Date(event.time) <= endTime));
    }

    // filter by keyword
    if (keyword) {
      data = data.filter(value => {
        if (value.member) {
          const groups = db.get('groups').find({id: value.member.groupId}).value();
          return value.member.name.indexOf(keyword) >= 0 ||
                   value.member.organization.indexOf(keyword) >= 0 ||
                   (groups && groups.name.indexOf(keyword) >= 0) ||
                   value.member.note.indexOf(keyword) >= 0;
        }

        return false;
      });
    }

    // populate group names for member details
    const groups = db.get('groups').value();
    data.forEach((event, index) => {
      if (event.member) {
        data[index].member.group = (groups.find(x => x.id === event.member.groupId) || {}).name || '';
        return data[index];
      }
    });

    // sort time by default
    data.sort((a, b) => new Date(b.time) - new Date(a.time));

    // sort by selected category
    if (sort) {
      if (sort.indexOf('organization') >= 0) {
        data.sort((a, b) => a.member ? a.member.organization.localeCompare(b.member && b.member.organization) : 1);
      } else if ((sort.indexOf('group')) >= 0) {
        data.sort((a, b) => a.member ? a.member.group.localeCompare(b.member && b.member.group) : 1);
      } else if (sort.indexOf('name') >= 0) {
        data.sort((a, b) => {
          return a.member ? a.member.name.localeCompare(b.member && b.member.name) : 1;
        });
      }

      // reverse sort if required
      if (sort.indexOf('-') === 0 || sort === 'time') {
        data = data.slice().reverse();
      }
    }

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
  .onGet('/api/users').reply(config => {
    const data = db.get('users').value();
    delete data.birthday;
    return mockResponseWithLog(config, [200, {items: data}]);
  })
  .onGet(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    return mockResponseWithLog(config, [200, db.get('users').find({id: itemId}).value()]);
  })
  .onPut(/api\/users\/\d+$/).reply(config => {
    const itemId = parseInt(config.url.replace('/api/users/', ''), 10);
    const currentItem = db.get('users').find({id: itemId}).value();
    const newItem = JSON.parse(config.data);
    if (currentItem.password !== '' && currentItem.password !== newItem.newPassword) {
      return mockResponseWithLog(config, [204, {messsage: 'Your current password is incorrect.'}]);
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
  .onGet('/api/members/database-encryption-settings').reply(config => mockResponseWithLog(config, [200, {password: '0000'}]))
  .onPut('/api/members/database-encryption-settings').reply(config => mockResponseWithLog(config, [200, {password: '0000'}]))
  .onPost('/api/members/database').reply(config => setDelay(mockResponseWithLog(config, [204]), 2000))
  .onGet('/api/members/device-sync').reply(config => mockResponseWithLog(config, [200, db.get('deviceSync').value()]))
  .onPut('/api/members/device-sync').reply(config => {
    const newItem = JSON.parse(config.data);
    return setDelay(mockResponseWithLog(config, [200, db.get('deviceSync.devices').find({id: newItem.id}).assign(newItem).write()]), 500);
  })
  .onPost('/api/members/device-sync').reply(config => {
    const list = db.get('deviceSync.devices').value();
    const item = JSON.parse(config.data);
    const newItem = {
      id: list[list.length - 1].id + 1,
      ip: item.ip,
      port: Number(item.port),
      // randomly generated device ID
      name: `MD2 [${Math.random().toString(36).substring(7).toUpperCase()}]`,
      account: item.account,
      connectionStatus: Math.random() * 5 > 1 ? 1 : 0, // Generate failed connection with 50% chance
      lastUpdateTime: 0,
      syncStatus: 0
    };
    return setDelay(mockResponseWithLog(config, [200, db.get('deviceSync.devices').push(newItem).write()]), 500);
  })
  .onDelete('/api/members/device-sync').reply(config => {
    const devices = JSON.parse(config.data);
    devices.devices.forEach(deviceID => db.get('deviceSync.devices').remove({id: deviceID}).write());
    return setDelay(mockResponseWithLog(config, [204, {}]), 500);
  })
  .onPost('/api/members/sync-db').reply(config => {
    const {devices, syncStatus} = db.get('deviceSync').value();
    const devicesToSync = JSON.parse(config.data).devices;
    let syncProcess = db.get('deviceSyncProcess').value();

    // Start sync process
    if (!syncStatus) {
      // Set sync process indicator on
      db.get('deviceSync').assign({syncStatus: 1}).write();
      const itemsSyncing = devices.filter(device => devicesToSync.includes(device.id))
        .map(device => ({
          ...device,
          syncStatus: 1
        }));
      syncProcess.devices = itemsSyncing;
      db.get('deviceSyncProcess').assign(syncProcess).write();
      return setDelay(mockResponseWithLog(config, [200, itemsSyncing]), 500);
    }

    const processingDevice = syncProcess.devices.find(device => device.syncStatus === 1);
    if (processingDevice) {
      syncProcess.devices[syncProcess.devices.indexOf(processingDevice)].syncStatus = 2;
    } else {
      db.get('deviceSync').assign({syncStatus: 0}).write();
      db.get('deviceSyncProcess').assign({
        devices: [],
        sourceStatus: 0
      }).write();
    }

    return setDelay(mockResponseWithLog(config, [200, syncProcess]), 500);
  })
  .onGet('/api/face-recognition/settings').reply(config => {
    const faceRecognitionSettings = db.get('faceRecognitionSettings').value();
    // get with converMapping to percentage util function (mocking real server)
    const triggerArea = utils.convertMappingToPercentage(faceRecognitionSettings.triggerArea);
    return mockResponseWithLog(config, [200, {
      ...faceRecognitionSettings,
      triggerArea: triggerArea
    }]);
  })
  .onGet('/api/face-recognition/fr').reply(config => mockResponseWithLog(config, [200, db.get('faceRecognitionStatus').value()]))
  .onPut('/api/face-recognition/fr').reply(config => mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(JSON.parse(config.data)).write()]))
  .onPut('/api/face-recognition/spoofing').reply(config => mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(JSON.parse(config.data)).write()]))
  .onPut('/api/face-recognition/confidencelevel').reply(config => mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(JSON.parse(config.data)).write()]))
  .onPut('/api/face-recognition/enrolldisplay').reply(config => mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(JSON.parse(config.data)).write()]))
  .onPut('/api/face-recognition/roi').reply(config => {
    const newROI = JSON.parse(config.data);
    // update with convertPercentage to mapping util function (mocking real server)
    newROI.triggerArea = utils.convertPercentageToMapping(newROI.triggerArea);
    return mockResponseWithLog(config, [200, db.get('faceRecognitionSettings').assign(newROI).write()]);
  })
  .onGet('/api/motion-detection/settings').reply(config => mockResponseWithLog(config, [200, db.get('motionDetectionSettings').value()]))
  .onPut('/api/motion-detection/settings').reply(config => mockResponseWithLog(config, [200, db.get('motionDetectionSettings').assign(JSON.parse(config.data)).write()]))
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
      isEnableFaceRecognitionKey: '1',
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
  .onGet('/api/auth-status').reply(config => mockResponseWithLog(config, [200, db.get('authStatus').value()]))
  .onAny().passThrough(); // Pass other request to normal axios
