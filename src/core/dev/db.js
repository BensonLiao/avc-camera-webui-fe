const low = require('lowdb');
const LocalStorage = require('lowdb/adapters/LocalStorage');
const ShutterSpeed = require('webserver-form-schema/constants/shutter-speed');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const ApertureType = require('webserver-form-schema/constants/aperture-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const OrientationType = require('webserver-form-schema/constants/orientation-type');
const RefreshRate = require('webserver-form-schema/constants/refresh-rate');
const StreamFormat = require('webserver-form-schema/constants/stream-format');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const StreamBandwidthManagement = require('webserver-form-schema/constants/stream-bandwidth-management');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');

const adapter = new LocalStorage('db');
const db = low(adapter);

module.exports = {
  init: () => {
    db.defaults({
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
        usedDiskSize: 3117 * 1024 * 1024,
        totalDiskSize: 7692 * 1024 * 1024,
        serialNumber: '181000723',
        modelName: 'AV02CLD-100',
        firmware: '35110.4'
      },
      networkSettings: {
        mac: '00-1a-07-18-c5-58'
      },
      httpsSettings: {
        isEnable: true,
        port: '443',
        certificateType: '0'
      },
      streamDefault: {
        channelA: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          maximumBitrate: '4096',
          constantBitrate: '4096',
          gov: StreamGOV['60']
        },
        channelB: {
          format: StreamFormat.h264,
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
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          maximumBitrate: '4096',
          constantBitrate: '1024',
          gov: StreamGOV['60']
        },
        channelB: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          maximumBitrate: '4096',
          constantBitrate: '1024',
          gov: StreamGOV['60']
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
        tcpPort: '37778',
        udpPort: '37778',
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
        isEnableAuth: false
      },
      notificationCards: [],
      groups: [
        {
          id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
          name: '業務部',
          note: '#主要執行AVC與AB的相關業務部門'
        },
        {
          id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
          name: '業務部2',
          note: ''
        }
      ],
      members: [
        {
          id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
          name: 'abby2',
          organization: 'SW',
          groupId: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
          note: 'note',
          pictures: [
            'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
          ]
        }
      ],
      faceEvents: [
        {
          id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2019-10-02T12:00:00.000Z',
          confidences: [
            {
              score: 50,
              confidence: '2',
              enrollStatus: '1',
              member: {
                id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
                name: 'abby2',
                organization: 'SW',
                groupId: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
                note: 'note',
                pictures: [
                  'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
                ]
              }
            }
          ]
        },
        {
          id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
          pictureThumbUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN',
          time: '2019-10-02T12:00:00.000Z',
          confidences: [
            {
              score: 49,
              confidence: '2',
              enrollStatus: '2'
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
