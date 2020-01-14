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
const StreamVBRBitRateLevel = require('webserver-form-schema/constants/stream-vbr-bit-rate-level');
const StreamVBRMaxBitRate = require('webserver-form-schema/constants/stream-vbr-max-bit-rate');
const StreamCBRBitRate = require('webserver-form-schema/constants/stream-cbr-bit-rate');
const StreamGOV = require('webserver-form-schema/constants/stream-gov');

const adapter = new LocalStorage('db');
const db = low(adapter);

module.exports = {
  init: () => {
    db.defaults({
      videoDefault: {
        defoggingEnabled: false,
        irEnabled: false,
        brightness: 0,
        contrast: 0,
        hdrEnabled: 'false',
        shutterSpeed: ShutterSpeed.auto,
        aperture: ApertureType.auto,
        saturation: 0,
        whiteblanceMode: WhiteBalanceType.auto,
        whiteblanceManual: 0,
        daynightMode: DaynightType.auto,
        timePeriodStart: 0,
        timePeriodEnd: 0,
        sharpness: 0,
        orientation: OrientationType.normal,
        refreshRate: RefreshRate.auto,
        sensitivity: 0,
        autoFocusEnabled: false,
        focalLength: 1,
        zoom: 1
      },
      video: {
        defoggingEnabled: false,
        irEnabled: false,
        brightness: 0,
        contrast: 0,
        hdrEnabled: 'false',
        shutterSpeed: ShutterSpeed.auto,
        aperture: ApertureType.auto,
        saturation: 0,
        whiteblanceMode: WhiteBalanceType.auto,
        whiteblanceManual: 0,
        daynightMode: DaynightType.auto,
        timePeriodStart: 0,
        timePeriodEnd: 0,
        sharpness: 0,
        orientation: OrientationType.normal,
        refreshRate: RefreshRate.auto,
        sensitivity: 0,
        autoFocusEnabled: false,
        focalLength: 1,
        zoom: 1
      },
      system: {
        languageCode: 'en-us',
        deviceName: 'IP Camera',
        isEnableFaceRecognition: true,
        isEnableAgeGender: false,
        isEnableHumanoidDetection: false,
        deviceStatus: 1,
        usedDiskSize: 3117 * 1024 * 1024,
        totalDiskSize: 7692 * 1024 * 1024
      },
      streamDefault: {
        channelA: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          vbrBitRateLevel: StreamVBRBitRateLevel.complete,
          vbrMaxBitRate: StreamVBRMaxBitRate['12'],
          cbrBitRate: StreamCBRBitRate['1024'],
          gov: StreamGOV['120']
        },
        channelB: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          vbrBitRateLevel: StreamVBRBitRateLevel.complete,
          vbrMaxBitRate: '1',
          cbrBitRate: StreamCBRBitRate['1024'],
          gov: StreamGOV['120']
        }
      },
      stream: {
        channelA: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          vbrBitRateLevel: StreamVBRBitRateLevel.complete,
          vbrMaxBitRate: StreamVBRMaxBitRate['12'],
          cbrBitRate: StreamCBRBitRate['1024'],
          gov: StreamGOV['120']
        },
        channelB: {
          format: StreamFormat.h264,
          resolution: StreamResolution['0'],
          frameRate: '30',
          bandwidthManagement: StreamBandwidthManagement.vbr,
          vbrBitRateLevel: StreamVBRBitRateLevel.complete,
          vbrMaxBitRate: '1',
          cbrBitRate: StreamCBRBitRate['1024'],
          gov: StreamGOV['120']
        }
      },
      audioSettings: {
        isEnableInput: true,
        isEnableOutput: false,
        inputQuality: '1',
        inputSource: 'LINE IN'
      },
      rtspSettings: {
        isEnableAudioToStream: true,
        isEnablePassword: true,
        tcpPort: '37778',
        udpPort: '37778',
        connectionLimit: '4'
      },
      wordSettings: {
        isEnable: true,
        fontSize: '1',
        color: '0',
        position: '1'
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
