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

const adapter = new LocalStorage('db');
const db = low(adapter);
const memberGroups = [
  {
    id: uuidv4(),
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  },
  {
    id: uuidv4(),
    name: '開發部',
    note: '#主要執行AVC與AB的研究開發'
  },
  {
    id: uuidv4(),
    name: '開發部2',
    note: ''
  }
];
const members = [
  {
    id: uuidv4(),
    name: 'abby2',
    organization: 'SW',
    groupId: memberGroups[0].id,
    note: 'note',
    pictures: [
      'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
    ]
  },
  {
    id: uuidv4(),
    name: 'benson',
    organization: 'SW',
    groupId: memberGroups[1].id,
    note: 'note',
    pictures: [
      'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
    ]
  },
  {
    id: uuidv4(),
    name: 'elon musk',
    organization: 'SW',
    groupId: memberGroups[2].id,
    note: 'tesla',
    pictures: [
      'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
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
        isEnableFaceRecognition: true,
        isEnableAgeGender: false,
        isEnableHumanoidDetection: false,
        deviceStatus: 1,
        serialNumber: '181000723',
        modelName: 'AV02CLD-100',
        firmware: '35110.4',
        sdEnabled: false,
        sdStatus: 1,
        sdFormat: 'FAT32',
        sdTotal: 31250000,
        sdUsage: 12178048,
        sdAlertEnabled: false
      },
      systemDateTime: {
        deviceTime: '2019-04-17 23:48:45',
        ntpTimeZone: 'Asia/Taipei',
        ntpIP: 'tw.pool.ntp.org',
        syncTimeOption: '0',
        ntpTimeOption: '0',
        ntpUpdateTime: '2020-01-02T10:00:00.000Z',
        ntpUpdateTimeRate: '10',
        manualTime: '2019-10-02T08:00:00.000Z'
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
      httpSettings: {
        port: '8080'
      },
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
      faceRecognitionSettings: {
        isEnable: true,
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
      notificationCards: [
        {
          emailAttachmentType: '0',
          senderSubject: 'Test subject',
          senderContent: 'this is email content',
          emails: [
            'rodger0531@gmail.com'
          ],
          faceRecognitionCondition: '0',
          groups: [],
          id: 1,
          isEnableApp: false,
          isEnableEmail: false,
          isEnableFaceRecognition: true,
          isEnableGPIO: false,
          isEnableGPIO1: false,
          isEnableGPIO2: false,
          isEnableTime: false,
          isTop: false,
          timePeriods: [
            {
              id: '89i591c9qb',
              start: '2020-06-03T06:29:32.869Z',
              end: '2020-09-18T06:29:32.869Z',
              isRepeat: false
            }
          ],
          title: 'Default test',
          type: '0'
        }
      ],
      groups: memberGroups,
      members,
      faceEvents: [
        {
          id: uuidv4(),
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2019-10-02T12:00:00.000Z',
          confidences: [
            {
              score: 50,
              confidence: '1',
              enrollStatus: '1',
              member: members[0]
            }
          ]
        },
        {
          id: uuidv4(),
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2020-01-02T12:00:00.000Z',
          confidences: [
            {
              score: 49,
              confidence: '1',
              enrollStatus: '2'
            }
          ]
        },
        {
          id: uuidv4(),
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2020-02-02T12:00:00.000Z',
          confidences: [
            {
              score: 56,
              confidence: '2',
              enrollStatus: '1',
              member: members[1]
            }
          ]
        },
        {
          id: uuidv4(),
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2020-03-03T12:00:00.000Z',
          confidences: [
            {
              score: 70,
              confidence: '3',
              enrollStatus: '1',
              member: members[2]
            }
          ]
        }
      ],
      users: [
        {
          id: 1,
          account: 'abby',
          birthday: '19860221',
          permission: 0,
          password: 'aA12345678'
        },
        {
          id: 2,
          account: 'minchien',
          birthday: '19860221',
          permission: 0,
          password: 'bB12345678'
        },
        {
          id: 3,
          account: 'barry123',
          birthday: '19860221',
          permission: 1,
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
          isEnableFaceRecognition: true,
          isEnableAgeGender: true,
          isEnableHumanoidDetection: false,
          isEnable: true
        },
        {
          time: '2019-10-02T08:00:00.000Z',
          user: {
            id: 2,
            name: 'Ben'
          },
          authKey: 'VGHBJNKBIVHBKJLNK:MPOIBJ',
          isEnableFaceRecognition: false,
          isEnableAgeGender: false,
          isEnableHumanoidDetection: true,
          isEnable: true
        }
      ]
    })
      .write();
    return db;
  }
};
