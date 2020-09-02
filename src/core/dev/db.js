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
const defaultPhotos = require('./default-photos');

const adapter = new LocalStorage('db');
const db = low(adapter);
const memberGroups = [
  {
    id: uuidv4(),
    name: '暗殺部',
    note: '#主要執行AVC與AB的相關業務部門'
  },
  {
    id: uuidv4(),
    name: '精神病院',
    note: '#主要執行AVC與AB的研究開發'
  },
  {
    id: uuidv4(),
    name: '火星太空站',
    note: ''
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
      defaultPhotos.user.scarlett
    ],
    picture: defaultPhotos.user.scarlett
  },
  {
    id: uuidv4(),
    name: 'Kim Jung Un',
    organization: 'Psych Ward',
    groupId: memberGroups[1].id,
    note: 'Has No Nuclear Weapon',
    pictures: [
      defaultPhotos.user.kim
    ],
    picture: defaultPhotos.user.kim
  },
  {
    id: uuidv4(),
    name: 'Elon Musk',
    organization: 'SpaceX',
    groupId: memberGroups[2].id,
    note: 'Iron Man',
    pictures: [
      defaultPhotos.user.elon
    ],
    picture: defaultPhotos.user.elon
  },
  {
    id: uuidv4(),
    name: 'Tom',
    organization: 'Avengers',
    groupId: memberGroups[0].id,
    note: 'I rock!',
    pictures: [
      defaultPhotos.user.tom[0],
      defaultPhotos.user.tom[1],
      defaultPhotos.user.tom[2],
      defaultPhotos.user.tom[3]
    ]
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
        zoom: 1,
        irBrightness: 1,
        focusType: '0',
        isAutoFocusAfterZoom: false
      },
      system: {
        languageCode: 'en-us',
        deviceName: 'IP Camera',
        deviceStatus: 1,
        serialNumber: '181000723',
        modelName: 'AV02CLD-100',
        firmware: '35110.4',
        sdEnabled: false,
        sdStatus: 0,
        sdFormat: 'FAT32',
        sdTotal: 10000000,
        sdUsage: 3200000,
        sdAlertEnabled: false
      },
      systemDateTime: {
        deviceTime: '2020-07-29  10:01:45',
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
        ddnsHostStatus: false
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
          resolution: StreamResolution['0'],
          frameRate: '30',
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
          codec: StreamCodec.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
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
      wordSettings: {
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
        triggerArea: {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        },
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
      notificationAppSettings: {
        deviceToken: '',
        deviceId: '',
        interval: ''
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
        groups: [memberGroups[0].id],
        isEnableFaceRecognition: true,
        faceRecognitionCondition: '0',
        senderSubject: '',
        senderContent: '',
        emailContentPosition: '0'
      }],
      groups: memberGroups,
      members,
      faceEvents: [
        {
          id: uuidv4(),
          pictureThumbUrl: defaultPhotos.event.scarlett,
          pictureLargeUrl: defaultPhotos.event.scarlett,
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
          pictureThumbUrl: defaultPhotos.event.jackman,
          pictureLargeUrl: defaultPhotos.event.jackman,
          time: '2020-09-02T12:00:00.000Z',
          recognitionType: RecognitionType.fake,
          confidences: {
            score: '4.9',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: defaultPhotos.event.kim,
          pictureLargeUrl: defaultPhotos.event.kim,
          time: '2020-07-02T12:00:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[1],
          confidences: {
            score: '56',
            similarity: Similarity.medium
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: defaultPhotos.event.elon,
          pictureLargeUrl: defaultPhotos.event.elon,
          time: '2020-04-03T12:00:00.000Z',
          recognitionType: RecognitionType.registered,
          member: members[2],
          confidences: {
            score: '70',
            similarity: Similarity.high
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: defaultPhotos.event.kim,
          time: '2020-02-04T12:00:00.000Z',
          recognitionType: RecognitionType.unknown,
          confidences: {
            score: '49',
            similarity: Similarity.low
          }
        },
        {
          id: uuidv4(),
          pictureThumbUrl: defaultPhotos.event.jackman,
          time: '2020-01-05T12:00:00.000Z',
          recognitionType: RecognitionType.unknown,
          confidences: {
            score: '49',
            similarity: Similarity.low
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
          isEnableFaceRecognitionKey: true,
          isEnableAgeGenderKey: true,
          isEnableHumanoidDetectionKey: false,
          isEnable: true
        },
        {
          time: '2019-10-02T08:00:00.000Z',
          user: {
            id: 2,
            name: 'Ben'
          },
          authKey: 'VGHBJNKBIVHBKJLNK:MPOIBJ',
          isEnableFaceRecognitionKey: false,
          isEnableAgeGenderKey: false,
          isEnableHumanoidDetectionKey: true,
          isEnable: true
        }
      ],
      authStatus: {
        isEnableFaceRecognitionKey: true,
        isEnableAgeGenderKey: false,
        isEnableHumanoidDetectionKey: false
      }
    })
      .write();
    return db;
  }
};
