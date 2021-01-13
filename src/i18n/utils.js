const i18n = require('../i18n').default;
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const UserPermission = require('webserver-form-schema/constants/user-permission');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const SDCardRecordingType = require('webserver-form-schema/constants/sdcard-recording-type');
const SDCardRecordingStream = require('webserver-form-schema/constants/sdcard-recording-stream');
const SDCardRecordingLimit = require('webserver-form-schema/constants/sdcard-recording-limit');

/**
 * Get the stream resolution option with i18n translation, for custom dropdown or `<select>` element to render.
 * @param {string} x - The value of specific stream resolution.
 * @returns {object}
 * - value {any}
 * - label {string}
 */
module.exports.getStreamResolutionOption = x => {
  switch (x) {
    default: return {};
    case StreamResolution[0]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-0')
      };
    case StreamResolution[1]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-1')
      };
    case StreamResolution[2]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-2')
      };
    case StreamResolution[3]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-3')
      };
    case StreamResolution[4]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-4')
      };
    case StreamResolution[5]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-5')
      };
    case StreamResolution[6]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-6')
      };
    case StreamResolution[7]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-7')
      };
    case StreamResolution[8]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-8')
      };
    case StreamResolution[9]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-9')
      };
    case StreamResolution[10]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-10')
      };
    case StreamResolution[11]:
      return {
        value: x,
        label: i18n.t('video.stream.constants.stream-resolution-11')
      };
  }
};

/**
   * Get the i18n message of account permission type.
   * @param {string} permission - The account permission type, it can be `root`, `guest`, `viewer` or `superAdmin`.
   * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
   * @returns {string|object|Element}
   */
module.exports.getAccountPermissonI18N = (permission, defaultValue = '') => {
  switch (permission) {
    default: return defaultValue;
    case UserPermission.root:
    case UserPermission.superAdmin:
      return i18n.t('userManagement.accounts.constants.permission-0');
    case UserPermission.guest:
      return i18n.t('userManagement.accounts.constants.permission-1');
    case UserPermission.viewer:
      return i18n.t('userManagement.accounts.constants.permission-2');
  }
};

/**
   * Get the i18n message of event confidence.
   * @param {string} confidence - The event confidence, it can be `low`, `medium` or `high`.
   * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
   * @returns {string|object|Element}
   */
module.exports.getEventConfidenceI18N = (confidence, defaultValue = '') => {
  switch (confidence) {
    default: return defaultValue;
    case Similarity.low:
      return i18n.t('userManagement.events.constants.confidence-0');
    case Similarity.medium:
      return i18n.t('userManagement.events.constants.confidence-1');
    case Similarity.high:
      return i18n.t('userManagement.events.constants.confidence-2');
  }
};

/**
   * Get the i18n message of event recognition type.
   * @param {string} recognitionType - The event recognition type, it can be `registerd`, `unknown` or `fake`.
   * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
   * @returns {string|object|Element}
   */
module.exports.getEventRecognitionTypeI18N = (recognitionType, defaultValue = '') => {
  switch (recognitionType) {
    default: return defaultValue;
    case RecognitionType.fake:
      return i18n.t('userManagement.events.constants.enroll-status-0');
    case RecognitionType.unknown:
      return i18n.t('userManagement.events.constants.enroll-status-1');
    case RecognitionType.registered:
      return i18n.t('userManagement.events.constants.enroll-status-2');
  }
};

/**
   * Get the i18n message of notification card type.
   * @param {string} notificationCardType - The notification card type,
   * it can be `faceRecognition`, `ageGender`, `humanoidDetection`, `tamperAlarm` or `digitalInput`.
   * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
   * @returns {string|object|Element}
   */
module.exports.getNotificationCardTypeI18N = (notificationCardType, defaultValue = '') => {
  switch (notificationCardType) {
    default: return defaultValue;
    case NotificationCardType.faceRecognition:
      return i18n.t('notification.cards.constants.notification-card-0');
    case NotificationCardType.ageGender:
      return i18n.t('notification.cards.constants.notification-card-1');
    case NotificationCardType.humanoidDetection:
      return i18n.t('notification.cards.constants.notification-card-2');
    case NotificationCardType.motionDetection:
      return i18n.t('notification.cards.constants.notification-card-3');
    case NotificationCardType.tamperAlarm:
      return i18n.t('notification.cards.constants.notification-card-4');
    case NotificationCardType.digitalInput:
      return i18n.t('notification.cards.constants.notification-card-5');
  }
};

/**
   * Get the i18n message of notification face recognition condition.
   * @param {string} recognitionType - The face recognition condition, it can be `always`, `success`, `unknown` or `fake`.
   * @param {string|object|Element} defaultValue - What to returns when there's no match case, default is ``.
   * @returns {string|object|Element}
   */
module.exports.getNotificationFRConditionI18N = (recognitionType, defaultValue = '') => {
  switch (recognitionType) {
    default: return defaultValue;
    case NotificationFaceRecognitionCondition.always:
      return i18n.t('notification.cards.constants.face-recognition-condition-0');
    case NotificationFaceRecognitionCondition.success:
      return i18n.t('notification.cards.constants.face-recognition-condition-1');
    case NotificationFaceRecognitionCondition.unknown:
      return i18n.t('notification.cards.constants.face-recognition-condition-2');
    case NotificationFaceRecognitionCondition.fake:
      return i18n.t('notification.cards.constants.face-recognition-condition-3');
  }
};

/**
   * Get the i18n message of api error.
   * @param {string} errorMessage - The api error message.
   * @returns {string}
   */
module.exports.getApiErrorMessageI18N = errorMessage => {
  switch (errorMessage) {
    default: return errorMessage;
    case 'Duplicate Member Names':
      return i18n.t('common.toast.Duplicate Member Names');
    case 'Login Failed':
      return i18n.t('common.toast.Login Failed');
    case 'Empty Member Database':
      return i18n.t('common.toast.Empty Member Database');
    case 'Unable to reset a forgotten password':
      return i18n.t('common.toast.Unable to reset a forgotten password');
    case 'Unable to reset a password':
      return i18n.t('common.toast.Unable to reset a password');
    case 'Card Number Limit Exceeded':
      return i18n.t('common.toast.Card Number Limit Exceeded');
    case 'Non-existent Card':
      return i18n.t('common.toast.Non-existent Card');
    case 'Database Size Limit (3 GB) Exceeded':
      return i18n.t('common.toast.Database Size Limit (3 GB) Exceeded');
    case 'Invalid Member Photo':
      return i18n.t('common.toast.Invalid Member Photo');
    case 'Unable to Process the Request (invalid token).':
      return i18n.t('common.toast.Unable to Process the Request (invalid token).');
    case 'Group Number Limit Exceeded':
      return i18n.t('common.toast.Group Number Limit Exceeded');
    case 'Incorrect Password':
      return i18n.t('common.toast.Incorrect Password');
    case 'Wrong Password for Database File':
      return i18n.t('common.toast.Wrong Password for Database File');
    case 'Wrong File Format':
      return i18n.t('common.toast.Wrong File Format');
    case 'Corrupted Zip File':
      return i18n.t('common.toast.Corrupted Zip File');
    case 'Photo Limit of Member Database Exceeded':
      return i18n.t('common.toast.Photo Limit of Member Database Exceeded');
    case 'Photo Size Limit Exceeded':
      return i18n.t('common.toast.Photo Size Limit Exceeded');
    case 'Invalid or Absent Photo':
      return i18n.t('common.toast.Invalid or Absent Photo');
    case 'Non-existent Group':
      return i18n.t('common.toast.Non-existent Group');
    case 'Non-existent Member':
      return i18n.t('common.toast.Non-existent Member');
    case 'Maximum Field Length Exceeded':
      return i18n.t('common.toast.Maximum Field Length Exceeded');
    case 'Duplicate Member Name':
      return i18n.t('common.toast.Duplicate Member Name');
    case 'Duplicate Card Name':
      return i18n.t('common.toast.Duplicate Card Name');
    case 'VMS Reserved Port':
      return i18n.t('common.toast.VMS Reserved Port');
    case 'Software Upgrade Failed':
      return i18n.t('common.toast.Software Upgrade Failed');
    case 'Unable to Complete the Format':
      return i18n.t('common.toast.Unable to Complete the Format');
    case 'Empty SMTP Server Address':
      return i18n.t('common.toast.Empty SMTP Server Address');
    case 'Empty SMTP Account':
      return i18n.t('common.toast.Empty SMTP Account');
    case 'Empty SMTP Account Password':
      return i18n.t('common.toast.Empty SMTP Account Password');
    case 'Empty Sender Email':
      return i18n.t('common.toast.Empty Sender Email');
    case 'Outgoing Email being Disabled':
      return i18n.t('common.toast.Outgoing Email being Disabled');
    case 'Absent or Unmounted SD Card':
      return i18n.t('common.toast.Absent or Unmounted SD Card');
    case 'Maximum Photo Number Exceeded':
      return i18n.t('common.toast.Maximum Photo Number Exceeded');
    case 'Showing No Face':
      return i18n.t('common.toast.Showing No Face');
    case 'Poor Photo Quality':
      return i18n.t('common.toast.Poor Photo Quality');
    case 'Limitation of Yaw Angle is 30 Degrees':
      return i18n.t('common.toast.Limitation of Yaw Angle is 30 Degrees');
    case 'Limitation of Pitch Angle is 20 Degrees':
      return i18n.t('common.toast.Limitation of Pitch Angle is 20 Degrees');
    case 'More Than One Face in the Photo':
      return i18n.t('common.toast.More Than One Face in the Photo');
    case 'Non-existent Photo':
      return i18n.t('common.toast.Non-existent Photo');
    case 'Invalid Key':
      return i18n.t('common.toast.Invalid Key');
    case 'Duplicate Key':
      return i18n.t('common.toast.Duplicate Key');
    case 'Cannot Support Database Downgrade from 30,000 to 3000 People':
      return i18n.t('common.toast.Cannot Support Database Downgrade from 30,000 to 3000 People');
    case 'DEVICE_CONNECTION_FAIL':
      return i18n.t('common.toast.DEVICE_CONNECTION_FAIL');
    case 'DEVICE_LOGIN_FAIL':
      return i18n.t('common.toast.DEVICE_LOGIN_FAIL');
    case 'DUPLICATE_DEVICE_IP':
      return i18n.t('common.toast.DUPLICATE_DEVICE_IP');
    case 'INVALID_DEVICE_ID':
      return i18n.t('common.toast.INVALID_DEVICE_ID');
    case 'DHCP Testing Failed':
      return i18n.t('common.toast.DHCP Test Failed');
  }
};

/**
 *
 * @param {string} x - The value of the specific sd card recording type
 * @returns {object}
 * - value {any}
 * - label {string}
 */
module.exports.getSDCardRecordingType = x => {
  switch (x) {
    default: return {};
    case SDCardRecordingType.disconnection:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-type-0')
      };
    case SDCardRecordingType.event:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-type-1')
      };
    case SDCardRecordingType.continuous:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-type-2')
      };
  }
};

/**
 *
 * @param {string} x - The value of the specific sd card recording stream
 * @returns {object}
 * - value {any}
 * - label {string}
 */
module.exports.getSDCardRecordingStream = x => {
  switch (x) {
    default: return {};
    case SDCardRecordingStream[1]:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-stream-0')
      };
    case SDCardRecordingStream[2]:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-stream-1')
      };
  }
};

/**
 *
 * @param {string} x - The value of the specific sd card recording Limit
 * @returns {object}
 * - value {any}
 * - label {string}
 */
module.exports.getSDCardRecordingLimit = x => {
  switch (x) {
    default: return {};
    case SDCardRecordingLimit.stop:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-limit-0')
      };
    case SDCardRecordingLimit.override:
      return {
        value: x,
        label: i18n.t('sdCard.basic.constants.sdcard-recording-limit-1')
      };
  }
};
