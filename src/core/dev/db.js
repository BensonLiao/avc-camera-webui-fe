const low = require('lowdb');
const LocalStorage = require('lowdb/adapters/LocalStorage');
const ShutterSpeed = require('webserver-form-schema/constants/shutter-speed');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const ApertureType = require('webserver-form-schema/constants/aperture-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const OrientationType = require('webserver-form-schema/constants/orientation-type');
const RefreshRate = require('webserver-form-schema/constants/refresh-rate');

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
      stream: {
        channelA: {
          format: 'H265',
          resolution: '1',
          frameRate: '5',
          bandwidthManagement: 'CBR',
          vbrBitRateLevel: '2',
          vbrMaxBitRate: '8',
          cbrBitRate: '4',
          gop: '1'
        },
        channelB: {
          format: 'H265',
          resolution: '1',
          frameRate: '5',
          bandwidthManagement: 'CBR',
          vbrBitRateLevel: '2',
          vbrMaxBitRate: '8',
          cbrBitRate: '4',
          gop: '1'
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
