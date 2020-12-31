const low = require('lowdb');
const uuidv4 = require('uuid/v4');
const LocalStorage = require('lowdb/adapters/LocalStorage');
const ShutterSpeed = require('webserver-form-schema/constants/shutter-speed');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const ApertureType = require('webserver-form-schema/constants/aperture-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const OrientationType = require('webserver-form-schema/constants/orientation-type');
const RefreshRate = require('webserver-form-schema/constants/refresh-rate');
const StreamCodec = require('webserver-form-schema/constants/stream-codec');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const userPhotos = require('./photos/users/_photos');
const eventPhotos = require('./photos/events/_photos');
const triggerAreaRawData = require('./trigger-area').default;

const adapter = new LocalStorage('db');
const db = low(adapter);
const memberGroups = [
  {
    id: uuidv4(),
    name: 'Avengers',
    note: 'Marvels'
  },
  {
    id: uuidv4(),
    name: 'Infinity Inc.',
    note: ''
  },
  {
    id: uuidv4(),
    name: 'Mystic Arts',
    note: 'Kathmandu'
  },
  {
    id: uuidv4(),
    name: 'Asgard',
    note: 'Home of Odin'
  }
];

const members = [
  {
    id: uuidv4(),
    name: 'Scarlett Johannson',
    organization: 'Godess',
    groupId: memberGroups[0].id,
    note: '"Let me put you on hold."',
    pictures: [
      userPhotos.scarlett1
    ],
    picture: userPhotos.scarlett1
  },
  {
    id: uuidv4(),
    name: 'Tom Holland',
    organization: 'Bronx High School',
    groupId: memberGroups[0].id,
    note: 'I rock!',
    pictures: [
      userPhotos.tom1,
      userPhotos.tom2,
      userPhotos.tom3,
      userPhotos.tom4
    ],
    picture: userPhotos.tom1
  },
  {
    id: uuidv4(),
    name: 'Tom Hiddleston',
    organization: 'God',
    groupId: memberGroups[3].id,
    note: 'There are no men like me.',
    pictures: [
      userPhotos.hiddleston1,
      userPhotos.hiddleston2,
      userPhotos.hiddleston3,
      userPhotos.hiddleston4,
      userPhotos.hiddleston5
    ],
    picture: userPhotos.hiddleston1
  },
  {
    id: uuidv4(),
    name: 'Jeremy Renners',
    organization: 'Bird Watching Society',
    groupId: memberGroups[0].id,
    note: 'The City Is Flying, We\'re Fighting An Army Of Robots, And I Have A Bow And Arrow. None Of This Makes Sense.',
    pictures: [
      userPhotos.renner1,
      userPhotos.renner2
    ],
    picture: userPhotos.renner1
  },
  {
    id: uuidv4(),
    name: 'Benedict Cumberbatch',
    organization: '',
    groupId: memberGroups[2].id,
    note: 'Dormammu, I\'ve Come To Bargain.',
    pictures: [
      userPhotos.cumberbatch1,
      userPhotos.cumberbatch2,
      userPhotos.cumberbatch3,
      userPhotos.cumberbatch4
    ],
    picture: userPhotos.cumberbatch1
  },
  {
    id: uuidv4(),
    name: 'Chris Hemsworth',
    organization: 'God^2',
    groupId: memberGroups[3].id,
    note: 'I notice you\'ve copied my beard.',
    pictures: [
      userPhotos.hemsworth1,
      userPhotos.hemsworth2
    ],
    picture: userPhotos.hemsworth1
  },
  {
    id: uuidv4(),
    name: 'Thanos',
    organization: 'Titan',
    groupId: memberGroups[1].id,
    note: 'You should have gone for the head.',
    pictures: [
      userPhotos.thanos1
    ],
    picture: userPhotos.thanos1
  },
  {
    id: uuidv4(),
    name: 'Rocket',
    organization: 'Zoo',
    groupId: memberGroups[0].id,
    note: 'Ain\'t nothin\' like me, cept\' me.',
    pictures: [
      userPhotos.rocket1
    ],
    picture: userPhotos.rocket1
  },
  {
    id: uuidv4(),
    name: 'Chris Evans',
    organization: 'Best Ass in America',
    groupId: memberGroups[0].id,
    note: 'I can do this all day.',
    pictures: [
      userPhotos.evans1
    ],
    picture: userPhotos.evans1
  },
  {
    id: uuidv4(),
    name: 'Iron Man',
    organization: 'Stark Industries',
    groupId: memberGroups[0].id,
    note: 'I am Iron Man.',
    pictures: [
      userPhotos.downey1,
      userPhotos.downey2,
      userPhotos.downey3
    ],
    picture: userPhotos.downey1
  },
  {
    id: uuidv4(),
    name: 'Chris Pratt',
    organization: 'Star Lord',
    groupId: memberGroups[0].id,
    note: 'Let\'s talk about this plan of yours.',
    pictures: [
      userPhotos.pratt1
    ],
    picture: userPhotos.pratt1
  }
];

module.exports = {
  init: () => {
    db.defaults({
      adbConfig: {
        isEnable: false,
        isPersist: false,
        port: 5555
      },
      videoDefault: {
        defoggingEnabled: false,
        irEnabled: '0',
        brightness: 0,
        contrast: 6,
        hdrEnabled: 'false',
        shutterSpeed: ShutterSpeed.auto,
        aperture: ApertureType.auto,
        saturation: 5,
        whiteblanceMode: WhiteBalanceType.auto,
        whiteblanceManual: 5000,
        daynightMode: DaynightType.auto,
        timePeriodStart: 0,
        timePeriodEnd: 0,
        sharpness: 2,
        orientation: OrientationType.normal,
        refreshRate: RefreshRate.auto,
        sensitivity: 0,
        isAutoFocus: false,
        focalLength: 5,
        mockFocalProcessTime: 0,
        mockFocalProcessFinished: true,
        mockOriginalFocalLength: 500,
        mocklastRefreshed: 0,
        zoom: 1,
        irBrightness: 1,
        focusType: '0',
        isAutoFocusAfterZoom: false
      },
      video: {
        defoggingEnabled: false,
        irEnabled: '0',
        brightness: 0,
        contrast: 6,
        hdrEnabled: 'false',
        shutterSpeed: ShutterSpeed.auto,
        aperture: ApertureType.auto,
        saturation: 5,
        whiteblanceMode: WhiteBalanceType.auto,
        whiteblanceManual: 5000,
        daynightMode: DaynightType.auto,
        timePeriodStart: 0,
        timePeriodEnd: 0,
        sharpness: 2,
        orientation: OrientationType.normal,
        refreshRate: RefreshRate.auto,
        sensitivity: 0,
        isAutoFocus: false,
        focalLength: 5,
        mockFocalProcessTime: 0,
        mockFocalProcessFinished: true,
        mockOriginalFocalLength: 500,
        mocklastRefreshed: 0,
        zoom: 1,
        irBrightness: 1,
        focusType: '0',
        isAutoFocusAfterZoom: false
      },
      system: {
        languageCode: 'en',
        deviceName: 'IP Camera',
        deviceStatus: 1,
        sensorResolution: 1,
        serialNumber: '181000723',
        modelName: 'MD2',
        projectId: 'MD2',
        firmware: '35110.4',
        sdEnabled: false,
        sdStatus: 0,
        sdFormat: 'FAT32',
        sdTotal: 10000000,
        sdUsage: 3200000,
        sdAlertEnabled: false
      },
      sdCardRecordingSettings: {
        sdRecordingStatus: 1,
        sdRecordingEnabled: true,
        sdRecordingStream: 1,
        sdRecordingType: 0,
        sdRecordingDuration: 0,
        sdRecordingLimit: true
      },
      sdCardStorage: {
        files: Array.from({length: 30}, (_, i) => {
          return (
            {
              id: uuidv4(),
              bytes: Math.random() * 1024,
              name: `file${i}.txt`,
              path: `/sdcard/test/folder1/file${i}.txt`,
              type: 'file',
              // Add a date field to mock backend filter
              date: `2020-12-${i <= 5 ? '20' : Math.floor(Math.random() * 23)}`
            }
          );
        }),
        filesDateList: ['2020-12-20', '2020-12-22', '2020-12-23']
      },
      systemDateTime: {
        deviceTime: new Date().getTime(),
        ntpTimeZone: 'Asia/Taipei',
        ntpIP: 'tw.pool.ntp.org',
        syncTimeOption: '0',
        ntpTimeOption: '0',
        ntpUpdateTime: 157737600000,
        ntpUpdateTimeRate: '10',
        manualTime: 0
      },
      networkSettings: {
        networkInterface: '0',
        ipType: '0',
        mac: '00-1a-07-18-c5-58',
        ipAddress: '192.168.20.229',
        primaryDNS: '192.169.20.1',
        secondaryDNS: '192.169.20.123',
        subnetMask: '225.225.225.0',
        gateway: '192.169.20.1'
      },
      ddnsSettings: {
        isEnableDDNS: false,
        ddnsProvider: '0',
        ddnsHost: 'aa',
        ddnsAccount: 'aa',
        ddnsPassword: 'aa',
        ddnsRefreshStatus: false,
        ddnsHostStatus: true
      },
      httpSettings: {port: '8080'},
      httpsSettings: {
        isEnable: true,
        port: '8443',
        certificateType: '0'
      },
      streamDefault: {
        channelA: {
          codec: StreamCodec.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          maximumBitrate: '4096',
          constantBitrate: '4096',
          gov: StreamGOV['60']
        },
        channelB: {
          codec: StreamCodec.h264,
          resolution: StreamResolution['1'],
          frameRate: '29',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          maximumBitrate: '4096',
          constantBitrate: '4096',
          gov: StreamGOV['60']
        }
      },
      stream: {
        channelA: {
          codec: StreamCodec.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.mbr,
          bitRate: '4096',
          gov: StreamGOV['60']
        },
        channelB: {
          codec: StreamCodec.mjpeg,
          resolution: StreamResolution['1'],
          frameRate: '29',
          bandwidthManagement: StreamBandwidthManagement.mbr,
          bitRate: '4096',
          gov: StreamGOV['60'],
          quality: '15'
        }
      },
      hdmiSettings: {
        isEnableHDMI: true,
        resolution: StreamResolution['0'],
        frameRate: '30'
      },
      audioSettings: {
        isEnableInput: true,
        isEnableOutput: false,
        inputQuality: '1',
        inputSource: 'LINEIN'
      },
      rtspSettings: {
        isEnableAudioToStream: true,
        isEnablePassword: true,
        tcpPort: '8554',
        udpPort: '17300',
        connectionLimit: '4'
      },
      privacyMaskSettings: {
        isEnable: true,
        maskAreas: [
          {
            x: 10,
            y: 10,
            width: 20,
            height: 30
          }
        ]
      },
      osdSettings: {
        isEnable: true,
        fontSize: '1',
        color: '0',
        position: '1',
        type: '0'
      },
      faceRecognitionStatus: {isEnable: true},
      faceRecognitionSettings: {
        isEnable: true,
        isEnableSpoofing: false,
        confidenceLevel: '0',
        isShowMember: true,
        isShowGroup: false,
        isShowUnknown: false,
        isShowFake: true,
        triggerArea: triggerAreaRawData,
        isEnableFaceFrame: true,
        faceFrame: {
          x: 10,
          y: 5,
          width: 20,
          height: 30
        }
      },
      motionDetectionSettings: {
        isEnable: false,
        sensibility: 1,
        areas: []
      },
      notificationIOInSettings: {
        isEnable: false,
        ioType: '0'
      },
      notificationIOOutSettings: [
        {
          isEnable: false,
          ioType: '0',
          gateType: '0',
          pulse: '',
          delay: ''
        },
        {
          isEnable: false,
          ioType: '0',
          gateType: '0',
          pulse: '',
          delay: ''
        }
      ],
      notificationSMTPSettings: {
        host: '',
        account: '',
        password: '',
        senderName: '',
        senderEmail: '',
        interval: '',
        isEnableLoginNotification: false,
        isEnableAuth: true
      },
      notificationCards: [{
        id: 1,
        type: '0',
        title: 'FR',
        isTop: false,
        isEnableTime: true,
        timePeriods: [{
          id: 'xx9urlxa87q',
          start: '2020-06-01T02:01:43.172Z',
          end: '2020-06-04T02:01:43.172Z',
          isRepeat: false
        }],
        isEnableGPIO: false,
        isEnableGPIO1: false,
        isEnableGPIO2: false,
        isEnableApp: false,
        isEnableEmail: false,
        isEnableVMS: true,
        faceRecognitionVMSEvent: '0',
        emails: ['test@a.com'],
        emailAttachmentType: '0',
        groups: [],
        isEnableFaceRecognition: false,
        faceRecognitionCondition: '1',
        senderSubject: '',
        senderContent: '',
        emailContentPosition: '0'
      },
      {
        id: 2,
        type: '3',
        title: 'Motion Detection',
        isTop: true,
        isEnableTime: true,
        timePeriods: [{
          id: 'u14iphxq2n',
          start: '2020-06-03T02:04:09.439Z',
          end: '2020-06-23T02:04:09.440Z',
          isRepeat: false
        }, {
          id: '82n5o8kcmf3',
          start: '2020-06-10T02:04:09.439Z',
          end: '2020-06-16T02:04:09.440Z',
          isRepeat: false
        }, {
          id: 'zbvd5d2hywt',
          start: '2020-08-07T02:04:09.439Z',
          end: '2020-09-18T02:04:09.440Z',
          isRepeat: false
        }, {
          id: 'fsri48cr4n',
          start: '2020-08-05T02:04:09.439Z',
          end: '2020-09-03T02:04:09.440Z',
          isRepeat: false
        }, {
          id: 'xovlkrg8so',
          start: '2020-08-05T02:04:09.439Z',
          end: '2020-09-29T02:04:09.440Z',
          isRepeat: false
        }],
        isEnableGPIO: true,
        isEnableGPIO1: true,
        isEnableGPIO2: false,
        isEnableApp: false,
        isEnableEmail: true,
        isEnableVMS: true,
        faceRecognitionVMSEvent: '0',
        emails: ['test1@b.com', 'test2@c.com'],
        emailAttachmentType: '0',
        groups: [],
        isEnableFaceRecognition: false,
        faceRecognitionCondition: '0',
        senderSubject: '',
        senderContent: '',
        emailContentPosition: '1'
      },
      {
        id: 3,
        type: '0',
        title: 'FR2',
        isTop: true,
        isEnableTime: true,
        timePeriods: [{
          id: 'vam1qo63kb',
          start: '2020-06-09T02:06:17.274Z',
          end: '2020-06-12T02:06:17.275Z',
          isRepeat: false
        }],
        isEnableGPIO: true,
        isEnableGPIO1: true,
        isEnableGPIO2: true,
        isEnableApp: false,
        isEnableEmail: true,
        isEnableVMS: true,
        faceRecognitionVMSEvent: '0',
        emails: ['testd@abc.com'],
        emailAttachmentType: '0',
        groups: [memberGroups[3].id],
        isEnableFaceRecognition: true,
        faceRecognitionCondition: '0',
        senderSubject: '',
        senderContent: '',
        emailContentPosition: '0'
      }],
      groups: memberGroups,
      members,
      deviceSync: {
        devices: Array.from({length: 20}, (_, i) => {
          const connectionStatus = Math.random() * 5 > 1 ? 1 : 0;
          return {
            id: i,
            ip: `192.168.0.${i + 1}`,
            port: 8080,
            name: `${i + 1}: MD2 [${Math.random().toString(36).substring(7).toUpperCase()}]`,
            account: 'admin',
            connectionStatus: connectionStatus, // Generate failed connection with 50% chance
            lastUpdateTime: connectionStatus && (Math.random() * 2 > 1) ? 1608888327067 : 0,
            syncStatus: 0
          };
        }),
        syncStatus: 0
      },
      deviceSyncProcess: {
        devices: [],
        sourceStatus: 0,
        lastUpdateTime: 0
      },
      faceEvents: [
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.scarlett,
          pictureLargeUrl: eventPhotos.scarlett,
          time: '2019-10-02T12:00:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[0],
          confidences: {
            score: '50',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.cumberbatch,
          pictureLargeUrl: eventPhotos.cumberbatch,
          time: '2020-03-21T09:42:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[4],
          confidences: {
            score: '89',
            similarity: Similarity.high
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.hemsworth,
          pictureLargeUrl: eventPhotos.hemsworth,
          time: '2020-09-04T11:03:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[5],
          confidences: {
            score: '72',
            similarity: Similarity.high
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.renner,
          pictureLargeUrl: eventPhotos.renner,
          time: '2020-05-21T19:40:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[3],
          confidences: {
            score: '21',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.rocket,
          pictureLargeUrl: eventPhotos.rocket,
          time: '2020-07-31T04:12:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[7],
          confidences: {
            score: '61',
            similarity: Similarity.medium
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.thanos,
          pictureLargeUrl: eventPhotos.thanos,
          time: '2020-02-28T21:40:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[6],
          confidences: {
            score: '99',
            similarity: Similarity.high
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.pratt,
          pictureLargeUrl: eventPhotos.pratt,
          time: '2020-06-18T06:20:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[10],
          confidences: {
            score: '84',
            similarity: Similarity.high
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.evans,
          pictureLargeUrl: eventPhotos.evans,
          time: '2020-01-25T16:12:00.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[8],
          confidences: {
            score: '10',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.downey,
          pictureLargeUrl: eventPhotos.downey,
          time: '2020-09-11T11:11:11.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[9],
          confidences: {
            score: '16',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.fury,
          pictureLargeUrl: eventPhotos.fury,
          time: '2020-05-09T09:11:00.000Z',
          recognitionType: RecognitionType.unknown,
          confidences: {
            score: '43',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.potts,
          pictureLargeUrl: eventPhotos.potts,
          time: '2020-02-14T14:12:00.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[0],
          confidences: {
            score: '10',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.nebula,
          pictureLargeUrl: eventPhotos.nebula,
          time: '2020-06-30T19:52:00.000Z',
          recognitionType: RecognitionType.fake,
          confidences: {
            score: '24',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.hulk,
          pictureLargeUrl: eventPhotos.hulk,
          time: '2020-08-22T22:08:00.000Z',
          recognitionType: RecognitionType.fake,
          confidences: {
            score: '52',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.groot,
          pictureLargeUrl: eventPhotos.groot,
          time: '2020-04-23T02:38:00.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[10],
          confidences: {
            score: '64',
            similarity: Similarity.medium
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.coulson,
          pictureLargeUrl: eventPhotos.coulson,
          time: '2020-07-12T12:27:00.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[3],
          confidences: {
            score: '43',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: eventPhotos.ant,
          pictureLargeUrl: eventPhotos.ant,
          time: '2020-01-22T15:47:00.000Z',
          recognitionType: RecognitionType.unknown,
          member: members[9],
          confidences: {
            score: '62',
            similarity: Similarity.medium
          }
        }
      ],
      users: [
        {
          id: 1,
          account: 'abby',
          birthday: '19860221',
          permission: '0',
          password: 'aA12345678'
        },
        {
          id: 2,
          account: 'minchien',
          birthday: '19860221',
          permission: '0',
          password: 'bB12345678'
        },
        {
          id: 3,
          account: 'barry123',
          birthday: '19860221',
          permission: '1',
          password: 'cC12345678'
        }
      ],
      authKeys: [
        {
          time: '2019-10-02T12:00:00.000Z',
          user: {
            id: 1,
            name: 'ChiChi'
          },
          authKey: 'GVHBNJLKBHVYIUON:KJLBNK',
          isEnableFaceRecognitionKey: '1',
          isEnableAgeGenderKey: true,
          isEnableHumanoidDetectionKey: false,
          isEnable: true
        },
        {
          time: '2019-10-05T12:00:00.000Z',
          user: {
            id: 1,
            name: 'ChiChi'
          },
          authKey: 'GVHBNJLKBHVYIUON:KJLBNK',
          isEnableFaceRecognitionKey: '2',
          isEnableAgeGenderKey: true,
          isEnableHumanoidDetectionKey: false,
          isEnable: true
        },
        {
          time: '2020-03-21T08:00:00.000Z',
          user: {
            id: 2,
            name: 'Ben'
          },
          authKey: 'VGHBJNKBIVHBKJLNK:MPOIBJ',
          isEnableFaceRecognitionKey: '0',
          isEnableAgeGenderKey: false,
          isEnableHumanoidDetectionKey: true,
          isEnable: true
        }
      ],
      authStatus: {
        isEnableFaceRecognitionKey: true,
        isEnableAgeGenderKey: false,
        isEnableHumanoidDetectionKey: false
      },
      upgrade: {upgradeProgress: 0},
      ping: {
        lastPinged: new Date(),
        count: 0
      }
    }).write();
    return db;
  }
};
