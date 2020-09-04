const api = require('./index.js');

module.exports = {
  /**
   * Ping server status.
   * @param {String} type - Determing what server to ping (android or nodejs), default is nodejs.
   * @param {Number} mock - Pass `1` to simulate web shutdown, be sure not to pass it or pass `0` in production.
   * @returns {Promise<response>}
   * @response 200 {Response} default
   * @response 500 {Response} if `mock` is set to `1`
   */
  ping: (type, mock = 0) => api({
    method: 'get',
    url: `/api/ping/${type || 'web'}`,
    timeout: 1000,
    params: {
      mock,
      _: Math.random().toString(36).substr(2)
    }
  }),
  updateMjpeg: ({res, quality}) => api({
    method: 'put',
    url: '/api/update-mjpeg',
    data: {
      res,
      quality
    }
  }),
  validation: {
    /**
     * Validate the birthday of the account.
     * @param {String} account User's account to be reference.
     * @param {String} birthday User's birth day to be validate.
     * @returns {Promise<response>}
     * @response 204
     */
    accountBirthday: ({account, birthday}) => api({
      method: 'post',
      url: '/api/_validate/account-birthday',
      data: {
        account,
        birthday
      }
    })
  },
  account: {
    /**
     * Do authentication with account and password.
     * @param {String} account
     * @param {String} password
     * @param {String|Number} maxAge in milliseconds
     * @returns {Promise<response>}
     * @response 200 {UserModel} with set-cookie
     * @response 400 {Object}
     * - extra {Object}
     * - - loginFailedTimes {Number}
     * @response 429 {Object}
     * - extra {Object}
     * - - loginFailedTimes {Number}
     * - - loginLockExpiredTime {Date}
     */
    login: ({account, password, maxAge}) => api({
      method: 'post',
      url: '/api/account/_login',
      data: {
        account,
        password,
        maxAge: Number(maxAge)
      }
    }),
    /**
     * Logout.
     * @returns {Promise<response>}
     * @response 204 with set-cookie
     */
    logout: () => api({
      method: 'post',
      url: '/api/account/_logout'
    }),
    /**
     * Refresh server session.
     * @returns {Promise<response>}
     * @response 204 with set-cookie
     */
    refresh: () => api({
      method: 'post',
      url: '/api/account/_refresh'
    }),
    /**
     * Change the password with the birthday.
     * @param {String} account
     * @param {String} birthday e.g. "19900101"
     * @param {String} newPassword
     * @returns {Promise<response>}
     * @response 200 {UserModel}
     */
    changePasswordWithBirthday: ({account, birthday, newPassword}) => api({
      method: 'post',
      url: '/api/account/_change-password',
      data: {
        account,
        birthday,
        newPassword
      }
    }),
    /**
     * Change my password.
     * @param {String} password
     * @param {String} newPassword
     * @returns {Promise<response>}
     * @response 200 {UserModel}
     */
    changeMyPassword: ({password, newPassword}) => api({
      method: 'put',
      url: '/api/me/password',
      data: {
        password,
        newPassword
      }
    })
  },
  user: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - items {Array<Object>}
     * - items[].id {Number}
     * - items[].account {String}
     * - items[].permission {String}
     */
    getUsers: () => api({
      method: 'get',
      url: '/api/users'
    }),
    /**
     * @param {Number} userId
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - items {Array<Object>}
     * - items[].id {Number}
     * - items[].account {String}
     * - items[].permission {String}
     */
    getUser: userId => api({
      method: 'get',
      url: `/api/users/${userId}`
    }),
    /**
     * @param {String} account
     * @param {String} permission
     * @param {String} password
     * @param {String} birthday
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {Number}
     * - account {String}
     * - permission {String}
     * - birthday {String}
     */
    addUser: ({account, permission, password, birthday}) => api({
      method: 'post',
      url: '/api/users',
      data: {
        account,
        permission,
        password,
        birthday
      }
    }),
    /**
     * @param {Number} id
     * @param {String} account
     * @param {String} permission
     * @param {String} password The old password.
     * @param {String} newPassword
     * @param {String} birthday
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {Number}
     * - account {String}
     * - permission {String}
     */
    updateUser: ({id, account, permission, password, newPassword}) => api({
      method: 'put',
      url: `/api/users/${id}`,
      data: {
        account,
        permission,
        password,
        newPassword
      }
    }),
    /**
     * @param {Number} userId
     * @returns {Promise<response>}
     * @response 204
     */
    deleteUser: userId => api({
      method: 'delete',
      url: `/api/users/${userId}`
    })
  },
  system: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - languageCode {String}
     * - deviceName {String}
     * - deviceStatus {Number}
     * - sdEnabled {Boolean}
     * - sdAlertEnabled {Boolean}
     * - sdFormat {String}
     * - sdStatus {Number}
     * - sdUsage {Number}
     * - sdTotal {Number}
     * - serialNumber {string}
     * - modelName {string}
     * - firmware {string}
     */
    getInformation: () => api({
      method: 'get',
      url: '/api/system/information'
    }).then(res => {
      res.data.sdTotal *= 1024;
      res.data.sdUsage *= 1024;
      return res;
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - syncTimeOption {String}
     * - ntpTimeZone {String}
     * - ntpIP {String}
     * - ntpTimeOption {String}
     * - ntpUpdateTime {Date}
     * - ntpUpdateTimeRate {String}
     * - deviceTime {String}
     * - manualTime {Date}
     */
    getSystemDateTime: () => api({
      method: 'get',
      url: '/api/system/datetime'
    }),
    /**
     * @param {String} syncTimeOption
     * @param {String} ntpTimeZone
     * @param {?String} ntpTimeZoneAuto
     * @param {String} ntpIP
     * @param {String} ntpTimeOption
     * @param {Date} ntpUpdateTime
     * @param {String} ntpUpdateTimeRate
     * @param {String} deviceTime
     * @param {Date} manualTime
     * @returns {Promise<Object>}
     * - syncTimeOption {String}
     * - ntpTimeZone {String}
     * - ntpTimeZoneAuto {?String}
     * - ntpIP {String}
     * - ntpTimeOption {String}
     * - ntpUpdateTime {Date}
     * - ntpUpdateTimeRate {String}
     * - deviceTime {String}
     * - manualTime {Date}
     */
    updateSystemDateTime: ({
      syncTimeOption, ntpTimeZone, ntpTimeZoneAuto, ntpIP, ntpTimeOption, ntpUpdateTime, ntpUpdateTimeRate, deviceTime, manualTime
    }) => api({
      method: 'put',
      url: '/api/system/datetime',
      data: {
        syncTimeOption,
        ntpTimeZone,
        ntpTimeZoneAuto,
        ntpIP,
        ntpTimeOption,
        ntpUpdateTime,
        ntpUpdateTimeRate,
        deviceTime,
        manualTime
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - port {string}
     * - certificateType {string}
     */
    getHttpsSettings: () => api({
      method: 'get',
      url: '/api/system/https'
    }),
    /**
     * @param {boolean} isEnable
     * @param {string} port
     * @param {string} certificateType
     * @param {string} certificate
     * @param {string} privateKey
     * @returns {Promise<response>}
     */
    updateHttpsSettings: ({isEnable, port, certificateType, certificate, privateKey}) => api({
      method: 'put',
      url: '/api/system/https',
      data: {
        isEnable,
        port,
        certificateType,
        certificate,
        privateKey
      }
    }),
    /**
     * @param {String} deviceName
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - deviceName {String}
     */
    updateDeviceName: deviceName => api({
      method: 'put',
      url: '/api/system/device-name',
      data: {deviceName}
    }),
    /**
     * @param {String} language available: "en-us", "zh-tw", "zh-cn", "ja-jp", "es-es"
     * @param {Object} account
     *   @property {String} account
     *   @property {String} permission
     *   @property {String} birthday
     *   @property {String} password
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - account {String}
     */
    setup: ({language, account, https}) => api({
      method: 'post',
      url: '/api/system/_setup',
      data: {
        language,
        account,
        https
      }
    }),
    /**
     * @param {String} language available: "en-us", "zh-tw", "zh-cn", "ja-jp", "es-es"
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - language {String}
     */
    updateLanguage: language => api({
      method: 'put',
      url: '/api/system/language',
      data: {language}
    }),
    /**
     * @param {File} file - The firmware file.
     * @param {Function} updateProgress - Set component state to update ui.
     * @returns {Promise<response>}
     * @response 204
     */
    uploadFirmware: (file, updateProgress) => api({
      method: 'post',
      url: '/api/system/firmware',
      headers: {'content-type': 'multipart/form-data'},
      data: (() => {
        const formData = new FormData();
        formData.set('file', file);
        return formData;
      })(),
      onUploadProgress: progressEvent => {
        // Do whatever you want with the native progress event
        updateProgress('uploadFirmware',
          Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    }),
    /**
     * @param {String} filename - The firmware file name.
     * @returns {Promise<response>}
     * @response 200
     * - upgradeStatus {String}
     * - upgradeProgress {Number}
     */
    upgradeFirmware: filename => api({
      method: 'post',
      url: '/api/system/firmware/upgrade',
      data: {filename}
    }),
    /**
     * @returns {Promise<Response>}
     * @response 204
     */
    deviceReboot: () => api({
      method: 'post',
      url: '/api/system/reboot'
    }),
    /**
     * @param {Boolean} resetIP - Reset IP address or not.
     * @returns {Promise<Response>}
     * @response 204
     */
    deviceReset: resetIP => api({
      method: 'post',
      url: '/api/system/resetdefault',
      data: {resetIP}
    }),
    /**
     * @param {File} file - The device settings file.
     * @returns {Promise<Response>}
     * @response 204
     */
    importDeviceSettings: file => api({
      method: 'post',
      url: '/api/system/importsettings',
      headers: {'content-type': 'multipart/form-data'},
      data: (() => {
        const formData = new FormData();
        formData.set('file', file);
        return formData;
      })()
    }),
    /**
     * @returns {Promise<Response>}
     * @response 204
     * - sdEnabled {boolean}
     * - sdAlertEnabled {boolean}
     * - sdFormat {string}
     * - sdTotal {string}
     * - sdUsage {string}
     * - sdStatus {boolean}
     */
    getSDCardInformation: () => api({
      method: 'get',
      url: '/api/system/systeminfo/sdcard'
    }),
    enableSD: ({sdEnabled}) => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard',
      data: {sdEnabled}
    }),
    sdCardAlert: ({sdAlertEnabled}) => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcardalert',
      data: {sdAlertEnabled}
    }),
    formatSDCard: () => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard/format'
    }),
    unmountSDCard: () => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard/unmount'
    }),
    /**
     * Clears system log
     * @returns {Promise<Response>}
     * @response 204
     */
    clearLog: () => api({
      method: 'post',
      url: '/api/system/systeminfo/clearLog'
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - networkInterface {String}
     * - ipType {String}
     * - ipAddress {String}
     * - primaryDNS {String}
     * - secondaryDNS {String}
     * - gateway {String}
     * - subnetMask {String}
     * - mac {String}
     */
    getNetworkSettings: () => api({
      method: 'get',
      url: '/api/system/network'
    }),
    /**
     * @param {String} ipType
     * @param {String} ipAddress
     * @param {String} primaryDNS
     * @param {String} secondaryDNS
     * @param {String} subnetMask
     * @param {String} gateway
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    updateNetworkSettings: ({ipType, ipAddress, primaryDNS, secondaryDNS, subnetMask, gateway}) => api({
      method: 'put',
      url: '/api/system/network',
      data: {
        ipType,
        ipAddress,
        primaryDNS,
        secondaryDNS,
        subnetMask,
        gateway
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - success {Number}
     */
    testDHCP: () => api({
      method: 'post',
      url: '/api/system/network/testdhcp'
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableDDNS {Boolean}
     * - ddnsProvider {String}
     * - ddnsHost {String}
     * - ddnsAccount {String}
     * - ddnsPassword {String}
     * - ddnsRefreshStatus {Boolean}
     * - ddnsHostStatus {Boolean}
     */
    getDDNSInfo: () => api({
      method: 'get',
      url: '/api/system/network/tcpip/ddns'
    }),
    /**
     * @param {Boolean} isEnableDDNS
     * @param {String} ddnsProvider
     * @param {String} ddnsHost
     * @param {String} ddnsAccount
     * @param {String} ddnsPassword
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableDDNS {Boolean}
     * - ddnsProvider {String}
     * - ddnsHost {String}
     * - ddnsAccount {String}
     * - ddnsPassword {String}
     * - ddnsRefreshStatus {Boolean}
     * - ddnsHostStatus {Boolean}
     */
    updateDDNSInfo: ({isEnableDDNS, ddnsProvider, ddnsHost, ddnsAccount, ddnsPassword}) => api({
      method: 'put',
      url: '/api/system/network/tcpip/ddns',
      data: {
        isEnableDDNS,
        ddnsProvider,
        ddnsHost,
        ddnsAccount,
        ddnsPassword
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - httpPort {Number}
     */
    getHttpInfo: () => api({
      method: 'get',
      url: '/api/system/network/tcpip/http'
    }),
    /**
     * @param {Number} port
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - httpPort {Number}
     */
    updateHttpInfo: ({port}) => api({
      method: 'put',
      url: '/api/system/network/tcpip/http',
      data: {port}
    }),
    getADBConfig: () => api({
      method: 'get',
      url: '/api/system/adbconfig'
    }),
    /**
     * @param {Boolean} isEnable
     * @param {Boolean} isPersist
     * @param {Number} port
     * @returns {Promise<response>}
     */
    updateADBConfig: ({isEnable, isPersist, port}) => api({
      method: 'put',
      url: '/api/system/adbconfig',
      data: {
        isEnable,
        isPersist,
        port
      }
    })
  },
  notification: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - deviceToken {string}
     * - deviceId {string}
     * - interval {string}
     */
    getAppSettings: () => api({
      method: 'get',
      url: '/api/notification/app/settings'
    }),
    /**
     * @param {string} deviceToken
     * @param {string} deviceId
     * @param {string} interval
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - deviceToken {string}
     * - deviceId {string}
     * - interval {string}
     */
    updateAppSettings: ({deviceToken, deviceId, interval}) => api({
      method: 'put',
      url: '/api/notification/app/settings',
      data: {
        deviceToken,
        deviceId,
        interval
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - ioType {string}
     */
    getIOInSettings: () => api({
      method: 'get',
      url: '/api/notification/io-in/settings'
    }),
    /**
     * @param {boolean} isEnable
     * @param {string} ioType
     * @returns {Promise<response>}
     */
    updateIOInSettings: ({isEnable, ioType}) => api({
      method: 'put',
      url: '/api/notification/io-in/settings',
      data: {
        isEnable,
        ioType
      }
    }),
    /**
     * @param {number} index
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - ioType {string}
     * - gateType {string}
     * - pulse {string}
     * - delay {string}
     */
    getIOOutSettings: index => api({
      method: 'get',
      url: `/api/notification/io-out/${index}/settings`
    }),
    /**
     * @param {number} index
     * @param {boolean} isEnable
     * @param {string} ioType
     * @param {string} gateType
     * @param {string} pulse
     * @param {string} delay
     * @returns {Promise<response>}
     */
    updateIOOutSettings: (index, {isEnable, ioType, gateType, pulse, delay}) => api({
      method: 'put',
      url: `/api/notification/io-out/${index}/settings`,
      data: {
        isEnable,
        ioType,
        gateType,
        pulse,
        delay
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - encryption {string}
     * - host {string}
     * - port {string}
     * - account {string}
     * - password {string}
     * - senderName {string}
     * - senderEmail {string}
     * - interval {string}
     * - isEnableLoginNotification {boolean}
     * - isEnableAuth {boolean}
     */
    getSMTPSettings: () => api({
      method: 'get',
      url: '/api/notification/smtp/settings'
    }),
    /**
     * @param {string} encryption
     * @param {string} host
     * @param {string} port
     * @param {string} account
     * @param {string} password
     * @param {string} senderName
     * @param {string} senderEmail
     * @param {string} interval
     * @param {boolean} isEnableLoginNotification
     * @param {boolean} isEnableAuth
     * @returns {Promise<response>}
     */
    updateSMTPSettings: ({
      encryption, host, port, account, password, senderName, senderEmail, interval, isEnableLoginNotification, isEnableAuth
    }) => api({
      method: 'put',
      url: '/api/notification/smtp/settings',
      data: {
        encryption,
        host,
        port,
        account,
        password,
        senderName,
        senderEmail,
        interval,
        isEnableLoginNotification,
        isEnableAuth
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - type {string}
     * - title {string}
     * - isTop {boolean}
     * - isEnableTime {boolean}
     * - timePeriods {Array<{start: string, end: string, isRepeat: boolean}>}
     * - isEnableGPIO {boolean}
     * - isEnableGPIO1 {boolean}
     * - isEnableGPIO2 {boolean}
     * - isEnableApp {boolean}
     * - isEnableEmail {boolean}
     * - isEnableVMS {boolean}
     * - faceRecognitionVMSEvent {string}
     * - emails {Array<string>}
     * - emailAttachmentType {string}
     * - senderSubject {string}
     * - senderContent {string}
     * - emailContentPosition {string}
     * - groups {Array<string>}
     * - isEnableFaceRecognition {boolean}
     * - faceRecognitionCondition {string}
     */
    getCards: () => api({
      method: 'get',
      url: '/api/notification/cards'
    }),
    addCard: ({
      type,
      title,
      isTop,
      isEnableTime,
      timePeriods,
      isEnableGPIO,
      isEnableGPIO1,
      isEnableGPIO2,
      isEnableApp,
      isEnableEmail,
      isEnableVMS,
      faceRecognitionVMSEvent,
      emails,
      emailAttachmentType,
      senderSubject,
      senderContent,
      emailContentPosition,
      groups,
      isEnableFaceRecognition,
      faceRecognitionCondition
    }) => api({
      method: 'post',
      url: '/api/notification/cards',
      data: {
        type,
        title,
        isTop,
        isEnableTime,
        timePeriods,
        isEnableGPIO,
        isEnableGPIO1,
        isEnableGPIO2,
        isEnableApp,
        isEnableEmail,
        isEnableVMS,
        faceRecognitionVMSEvent,
        emails,
        emailAttachmentType,
        senderSubject,
        senderContent,
        emailContentPosition,
        groups,
        isEnableFaceRecognition,
        faceRecognitionCondition
      }
    }),
    updateCard: ({
      id,
      type,
      title,
      isTop,
      isEnableTime,
      timePeriods,
      isEnableGPIO,
      isEnableGPIO1,
      isEnableGPIO2,
      isEnableApp,
      isEnableEmail,
      isEnableVMS,
      faceRecognitionVMSEvent,
      emails,
      emailAttachmentType,
      senderSubject,
      senderContent,
      emailContentPosition,
      groups,
      isEnableFaceRecognition,
      faceRecognitionCondition
    }) => api({
      method: 'put',
      url: `/api/notification/cards/${id}`,
      data: {
        type,
        title,
        isTop,
        isEnableTime,
        timePeriods,
        isEnableGPIO,
        isEnableGPIO1,
        isEnableGPIO2,
        isEnableApp,
        isEnableEmail,
        isEnableVMS,
        faceRecognitionVMSEvent,
        emails,
        emailAttachmentType,
        senderSubject,
        senderContent,
        emailContentPosition,
        groups,
        isEnableFaceRecognition,
        faceRecognitionCondition
      }
    }),
    deleteCard: cardId => api({
      method: 'delete',
      url: `/api/notification/cards/${cardId}`
    })
  },
  video: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - defoggingEnabled {Boolean}
     * - irEnabled {String}
     * - brightness {Number}
     * - contrast {Number}
     * - hdrEnabled {String}
     * - shutterSpeed {String}
     * - aperture {String}
     * - saturation {Number}
     * - whiteblanceMode {String}
     * - whiteblanceManual {Boolean}
     * - daynightMode {String}
     * - timePeriodStart {Number}
     * - timePeriodEnd {Number}
     * - sharpness {Number}
     * - orientation {String}
     * - refreshRate {String}
     * - sensitivity {Number}
     * - irBrightness {Number}
     * - isAutoFocus {Boolean}
     * - focalLength {Number}
     * - zoom {Number}
     * - focusType {String}
     * - isAutoFocusAfterZoom {Boolean}
     */
    getSettings: () => api({
      method: 'get',
      url: '/api/video/settings'
    }),
    /**
     * @param {Boolean} defoggingEnabled
     * @param {String} irEnabled
     * @param {Number} brightness
     * @param {Number} contrast
     * @param {String} hdrEnabled
     * @param {String} shutterSpeed
     * @param {String} aperture
     * @param {Number} saturation
     * @param {String} whiteblanceMode
     * @param {Boolean} whiteblanceManual
     * @param {String} daynightMode
     * @param {Number} timePeriodStart
     * @param {Number} timePeriodEnd
     * @param {Number} sharpness
     * @param {String} orientation
     * @param {String} refreshRate
     * @param {Number} sensitivity
     * @param {Number} irBrightness
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - defoggingEnabled {Boolean}
     * - irEnabled {String}
     * - brightness {Number}
     * - contrast {Number}
     * - hdrEnabled {String}
     * - shutterSpeed {String}
     * - aperture {String}
     * - saturation {Number}
     * - whiteblanceMode {String}
     * - whiteblanceManual {Boolean}
     * - daynightMode {String}
     * - timePeriodStart {Number}
     * - timePeriodEnd {Number}
     * - sharpness {Number}
     * - orientation {String}
     * - refreshRate {String}
     * - sensitivity {Number}
     * - irBrightness {Number}
     */
    updateSettings: ({
      defoggingEnabled,
      irEnabled,
      brightness,
      contrast,
      hdrEnabled,
      shutterSpeed,
      aperture,
      saturation,
      whiteblanceMode,
      whiteblanceManual,
      daynightMode,
      sensitivity,
      timePeriodStart,
      timePeriodEnd,
      sharpness,
      orientation,
      refreshRate,
      irBrightness
    }) => api({
      method: 'put',
      url: '/api/video/settings',
      data: {
        defoggingEnabled,
        irEnabled,
        brightness,
        contrast,
        hdrEnabled,
        shutterSpeed,
        aperture,
        saturation,
        whiteblanceMode,
        whiteblanceManual,
        daynightMode,
        sensitivity,
        timePeriodStart,
        timePeriodEnd,
        sharpness,
        orientation,
        refreshRate,
        irBrightness
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 204
     */
    resetSettings: () => api({
      method: 'post',
      url: '/api/video/settings/_reset'
    }),
    startAutoFocus: () => api({
      method: 'post',
      url: '/api/video/settings/_auto-focus'
    }),
    /**
     * @param {number} focalLength
     * @param {number} zoom
     * @param {string} focusType
     * @param {boolean} isAutoFocusAfterZoom
     * @returns {Promise<response>}
     */
    updateFocusSettings: ({focalLength, zoom, focusType, isAutoFocusAfterZoom}) => api({
      method: 'put',
      url: '/api/video/settings/focus',
      data: {
        focalLength,
        zoom,
        focusType,
        isAutoFocusAfterZoom
      }
    }),
    /**
     * @returns {Object}
     * - focalLength {Number}
     */
    getFocalLength: () => api({
      method: 'get',
      url: '/api/video/focusposition'
    })

  },
  smartFunction: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - faceRecognitionStatus {boolean}
     */
    getFaceRecognitionStatus: () => api({
      method: 'get',
      url: '/api/face-recognition/fr'
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - isEnableSpoofing {boolean}
     * - confidenceLevel {string}
     * - isShowMember {boolean}
     * - isShowGroup {boolean}
     * - isShowUnknown {boolean}
     * - triggerArea {Object}
     * - - x {number}
     * - - y {number}
     * - - width {number}
     * - - height {number}
     * - isEnableFaceFrame {boolean}
     * - faceFrame {Object}
     * - - x {number}
     * - - y {number}
     * - - width {number}
     * - - height {number}
     */
    getFaceRecognitionSettings: () => api({
      method: 'get',
      url: '/api/face-recognition/settings'
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @param {boolean} isEnable
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     */
    updateFRSetting: ({isEnable}) => api({
      method: 'put',
      url: '/api/face-recognition/fr',
      data: {isEnable}
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @param {string} confidenceLevel
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - confidenceLevel {string}
     */
    updateFRConfidenceLevel: ({confidenceLevel}) => api({
      method: 'put',
      url: '/api/face-recognition/confidencelevel',
      data: {confidenceLevel}
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @param {boolean} isShowMember
     * @param {boolean} isShowGroup
     * @param {boolean} isShowUnknown
     * @param {boolean} isShowFake
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isShowMember {boolean}
     * - isShowGroup {boolean}
     * - isShowUnknown {boolean}
     * - isShowFake {boolean}
     */
    updateFREnrollDisplaySetting: ({isShowMember, isShowGroup, isShowUnknown, isShowFake}) => api({
      method: 'put',
      url: '/api/face-recognition/enrolldisplay',
      data: {
        isShowMember,
        isShowGroup,
        isShowUnknown,
        isShowFake
      }
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @param {Object} triggerArea
     * @param {boolean} isEnableFaceFrame
     * @param {Object} faceFrame
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - triggerArea {Object}
     * - - x {number}
     * - - y {number}
     * - - width {number}
     * - - height {number}
     * - isEnableFaceFrame {boolean}
     * - faceFrame {Object}
     * - - x {number}
     * - - y {number}
     * - - width {number}
     * - - height {number}
     */
    updateFRROI: ({triggerArea, isEnableFaceFrame, faceFrame}) => api({
      method: 'put',
      url: '/api/face-recognition/roi',
      data: {
        triggerArea,
        isEnableFaceFrame,
        faceFrame
      }
    }),
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @param {boolean} isEnableSpoofing
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableSpoofing {boolean}
     */
    updateFRSpoofing: ({isEnableSpoofing}) => api({
      method: 'put',
      url: '/api/face-recognition/spoofing',
      data: {isEnableSpoofing}
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - sensibility {number}
     * - areas {Array<{x: number, y: number, width: number, height: number}>}
     */
    getMotionDetectionSettings: () => api({
      method: 'get',
      url: '/api/motion-detection/settings'
    }),
    /**
     * @param {boolean} isEnable
     * @param {number} sensibility
     * @param {Array<{x: number, y: number, width: number, height: number}>} areas
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - sensibility {number}
     * - areas {Array<{x: number, y: number: width: number, height: number}>}
     */
    updateMotionDetectionSettings: ({isEnable, sensibility, areas}) => api({
      method: 'put',
      url: '/api/motion-detection/settings',
      data: {
        isEnable,
        sensibility,
        areas
      }
    })
  },
  group: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - items {Array<Object>}
     * - items[].id {String}
     * - items[].name {String}
     * - items[].note {String}
     */
    getGroups: () => api({
      method: 'get',
      url: '/api/groups'
    }),
    /**
     * @param {String} groupId
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - note {String}
     */
    getGroup: groupId => api({
      method: 'get',
      url: `/api/groups/${groupId}`
    }),
    /**
     * @param {String} name
     * @param {String} note
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - note {String}
     */
    addGroup: ({name, note}) => api({
      method: 'post',
      url: '/api/groups',
      data: {
        name,
        note
      }
    }),
    /**
     * @param {String} id
     * @param {String} name
     * @param {String} note
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - note {String}
     */
    updateGroup: ({id, name, note}) => api({
      method: 'put',
      url: `/api/groups/${id}`,
      data: {
        name,
        note
      }
    }),
    /**
     * @param {String} groupId
     * @returns {Promise<response>}
     * @response 204
     */
    deleteGroup: groupId => api({
      /*
      @param groupId {String}
      @response 204
       */
      method: 'delete',
      url: `/api/groups/${groupId}`
    })
  },
  member: {
    /**
     * @param {Number} index
     * @param {String} keyword
     * @param {String} group The group id.
     * @param {String} sort "name", "-name", "organization", "-organization", "group", "-group"
     * "name": Sorting by name with ASC.
     * "-name": Sorting by name with DESC.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - index {Number} The current page index.
     * - size {Number} The current page size.
     * - total {Number} The total item quantity.
     * - items {Array<Object>}
     * - items[].name {String}
     * - items[].organization {String}
     * - items[].groupId {String} The group id.
     * - items[].note {String}
     * - items[].pictures {Array<String>} The base64 string of jpeg images.
     * - items[].id {String}
     */
    getMembers: ({index, keyword, group, sort}) => api({
      method: 'get',
      url: '/api/members',
      params: {
        index,
        keyword,
        group,
        sort
      }
    }),
    /**
     * @param {String} name
     * @param {String} organization
     * @param {String} group The group id.
     * @param {String} note
     * @param {Array<String>} pictures The base64 string of jpeg images.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - organization {String}
     * - groupId {String} The group id.
     * - note {String}
     * - pictures {Array<String>} The base64 string of jpeg images.
     */
    addMember: ({name, organization, group, note, pictures}) => api({
      method: 'post',
      url: '/api/members',
      data: {
        name,
        organization,
        groupId: group,
        note,
        pictures
      }
    }),
    /**
     * @param {String} id
     * @param {String} name
     * @param {String} organization
     * @param {String} group The group id.
     * @param {String} note
     * @param {Array<String>} pictures The base64 string of jpeg images.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - organization {String}
     * - groupId {String} The group id.
     * - note {String}
     * - pictures {Array<String>} The base64 string of jpeg images.
     */
    updateMember: ({id, name, organization, group, note, pictures}) => api({
      method: 'put',
      url: `/api/members/${id}`,
      data: {
        name,
        organization,
        groupId: group,
        note,
        pictures
      }
    }),
    /**
     * @param {String} memberId
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {String}
     * - name {String}
     * - organization {String}
     * - groupId {String} The group id.
     * - note {String}
     * - pictures {Array<String>} The base64 string of jpeg images.
     */
    getMember: memberId => api({
      method: 'get',
      url: `/api/members/${memberId}`
    }),
    /**
     * @param {String} memberId
     * @returns {Promise<response>}
     * @response 204
     */
    deleteMember: memberId => api({
      method: 'delete',
      url: `/api/members/${memberId}`
    }),
    /**
     * @param {String} picture
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - vectors {String}
     */
    validatePicture: picture => api({
      method: 'post',
      url: '/api/members/validate-picture',
      data: {picture}
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - password {String}
     */
    getDatabaseEncryptionSettings: () => api({
      method: 'get',
      url: '/api/members/database-encryption-settings'
    }),
    /**
     * @param {string} password - The old password.
     * @param {string} newPassword - The new password.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - password {String}
     */
    updateDatabaseEncryptionSettings: ({password, newPassword}) => api({
      method: 'put',
      url: '/api/members/database-encryption-settings',
      data: {
        password,
        newPassword
      }
    }),
    /**
     * @param {File} file - The database file.
     * @returns {Promise<response>}
     * @response 204
     */
    uploadDatabaseFile: file => api({
      method: 'post',
      url: '/api/members/database',
      headers: {'content-type': 'multipart/form-data'},
      data: (() => {
        const formData = new FormData();
        formData.set('file', file);
        return formData;
      })()
    })
  },
  multimedia: {
    /**
     * @returns {Promise<response>} webserver-form-schema/stream-settings-schema
     * @response 200 {Object}
     * - channelA {Object}
     * - - codec {String} webserver-form-schema/constants/stream-codec
     * - - resolution {String} webserver-form-schema/constants/stream-resolution
     * - - frameRate {String}
     * - - bandwidthManagement {String}
     * - - bitrate {String}
     * - - gov = gop {String}
     * - channelB {Object} It is same as channelA.
     */
    getStreamSettings: () => api({
      method: 'get',
      url: '/api/multimedia/stream/settings'
    }),
    /**
     * @param {Object} channelA
     * @property {String} codec webserver-form-schema/constants/stream-codec
     * @property {String} resolution webserver-form-schema/constants/stream-resolution
     * @property {String} frameRate
     * @property {String} bandwidthManagement
     * @property {String} bitrate
     * @property {String} gov It is same as GOP
     * @param {Object} channelB It is same as channelA.
     * @returns {Promise<response>} webserver-form-schema/stream-settings-schema
     * @response 200 {Object}
     * - channelA {Object}
     * - - codec {String} webserver-form-schema/constants/stream-codec
     * - - resolution {String} webserver-form-schema/constants/stream-resolution
     * - - frameRate {String}
     * - - bandwidthManagement {String}
     * - - bitrate {String}
     * - - gov {String}
     * - channelB {Object} It is same as channelA.
     */
    updateStreamSettings: ({channelA, channelB}) => api({
      method: 'put',
      url: '/api/multimedia/stream/settings',
      data: {
        channelA,
        channelB
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 204
     */
    resetStreamSettings: () => api({
      method: 'post',
      url: '/api/multimedia/stream/settings/_reset'
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableHDMI {boolean}
     * - frameRate {string}
     * - resolution {string}
     */
    getHDMISettings: () => api({
      method: 'get',
      url: '/api/multimedia/hdmi/settings'
    }),
    /**
     * Schema: webserver-form-schema/hdmi-settings-schema
     * @param {boolean} isEnableHDMI - Enable HDMI.
     * @param {string} frameRate - HDMI frame rate (fps).
     * @param {string} resolution - HDMI resolution.
     * @returns {Promise<{isEnableHDMI: number, frameRate: string, resolution: string}>} - HDMI settings.
     * @response 200 {Object}
     */
    updateHDMISettings: ({isEnableHDMI, frameRate, resolution}) => api({
      method: 'put',
      url: '/api/multimedia/hdmi/settings',
      data: {
        isEnableHDMI,
        frameRate,
        resolution
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableAudioToStream {boolean}
     * - isEnablePassword {boolean}
     * - tcpPort {string}
     * - udpPort {string}
     * - connectionLimit {string}
     */
    getRTSPSettings: () => api({
      method: 'get',
      url: '/api/multimedia/rtsp/settings'
    }),
    /**
     * Schema: webserver-form-schema/rtsp-settings-schema
     * @param {boolean} isEnableAudioToStream - 將聲音記錄至串流除霧
     * @param {boolean} isEnablePassword - 連線時需帳號密碼認證
     * @param {string} tcpPort - RTSP/TCP 連接埠
     * @param {string} udpPort - RTSP/UDP 連接埠
     * @param {string} connectionLimit - 最大連接數
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableAudioToStream {boolean}
     * - isEnablePassword {boolean}
     * - tcpPort {string}
     * - udpPort {string}
     * - connectionLimit {string}
     */
    updateRTSPSettings: ({isEnableAudioToStream, isEnablePassword, tcpPort, udpPort, connectionLimit}) => api({
      method: 'put',
      url: '/api/multimedia/rtsp/settings',
      data: {
        isEnableAudioToStream,
        isEnablePassword,
        tcpPort,
        udpPort,
        connectionLimit
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - maskAreas {Array<Object>}
     * - maskAreas[].x {number}
     * - maskAreas[].y {number}
     * - maskAreas[].width {number}
     * - maskAreas[].height {number}
     */
    getPrivacyMaskSettings: () => api({
      method: 'get',
      url: '/api/multimedia/privacy-mask/settings'
    }),
    /**
     * @param {boolean} isEnable
     * @param {Array<{x: number, y: number, width: number, height: number}>} maskAreas
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - maskAreas {Array<Object>}
     * - maskAreas[].x {number}
     * - maskAreas[].y {number}
     * - maskAreas[].width {number}
     * - maskAreas[].height {number}
     */
    updatePrivacyMaskSettings: ({isEnable, maskAreas}) => api({
      method: 'put',
      url: '/api/multimedia/privacy-mask/settings',
      data: {
        isEnable,
        maskAreas
      }
    }),
    /**
     * Schema: webserver-form-schema/audio-settings-schema
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableInput {boolean}
     * - isEnableOutput {boolean}
     * - inputQuality {string}
     * - inputSource {string}
     */
    getAudioSettings: () => api({
      method: 'get',
      url: '/api/multimedia/audio/settings'
    }),
    /**
     * @param {boolean} isEnableInput
     * @param {string} inputQuality
     * @param {string} inputSource
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableInput {boolean}
     * - isEnableOutput {boolean}
     * - inputQuality {string}
     * - inputSource {string}
     */
    updateAudioSettings: ({isEnableInput, inputQuality, inputSource}) => api({
      method: 'put',
      url: '/api/multimedia/audio/settings',
      data: {
        isEnableInput,
        inputQuality,
        inputSource
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - fontSize {string}
     * - color {string}
     * - position {string}
     * - type {string}
     * - customText {string}
     */
    getWordSettings: () => api({
      method: 'get',
      url: '/api/multimedia/word/settings'
    }),
    /**
     * @param {boolean} isEnable
     * @param {string} fontSize
     * @param {string} color
     * @param {string} position
     * @param {string} type
     * @param {string} customText
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - fontSize {string}
     * - color {string}
     * - position {string}
     * - type {string}
     * - customText {string}
     */
    updateWordSettings: ({isEnable, fontSize, color, position, type, customText}) => api({
      method: 'put',
      url: '/api/multimedia/word/settings',
      data: {
        isEnable,
        fontSize,
        color,
        position,
        type,
        customText
      }
    })
  },
  event: {
    /**
     * @param {Array<String>|String} enrollStatus webserver-form-schema/constants/event-filters/recognition-type
     * @param {Array<String>|String} confidence webserver-form-schema/constants/event-filters/similarity
     * @param {Number} index
     * @param {String} keyword
     * @param {Date|null} start The start time.
     * @param {Date|null} end The end time.
     * @param {String} sort `time`, `-time`, `name`, `-name`, `organization`, `-organization`, `group`, `-group`
     * `time`: Sorting by time with ASC.
     * `-time`: Sorting by time with DESC.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - index: {Number} The current page index.
     * - size: {Number} The current page size.
     * - total: {Number} The total item quantity.
     * - items: {Array<Object>}
     * - - id: {String}
     * - - pictureThumbUrl: {String}
     * - - pictureLargeUrl: {String}
     * - - time: {String} ISO8601 `2019-10-02T02:00:00.000Z`
     * - - recognitionType: {String} The result of recognition. `0`:`fake`, `1`:`unknown`, `2`:`registered`
     * - - member: {Object|null}
     * - - - id: {String}
     * - - - picture {String} The base64 string of jpeg image.
     * - - - name: {String} The member name.
     * - - - group: {String} The group name.
     * - - - organization: {String} The organization name.
     * - - - note: {String} The member note.
     * - - confidences: {Object}
     * - - - score: {String}
     * - - - similarity: {String}
     */
    getFaceEvents: ({enrollStatus, confidence, index, keyword, start, end, sort}) => api({
      method: 'get',
      url: '/api/face-events',
      params: {
        enrollStatus,
        confidence,
        index,
        keyword,
        start,
        end,
        sort
      }
    })
  },
  authKey: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - items {Array<Object>}
     * - items[].authKey {String}
     * - items[].isEnableFaceRecognitionKey {Boolean}
     * - items[].isEnableAgeGenderKey {Boolean}
     * - items[].isEnableHumanoidDetectionKey {Boolean}
     * - items[].isEnable {Boolean}
     * - items[].time {String} ISO8601 "2019-10-02T02:00:00.000Z"
     * - items[].user {Object}
     * - - id {Number}
     * - - name {String}
     */
    getAuthKeys: () => api({
      method: 'get',
      url: '/api/auth-keys'
    }),
    /**
     * @param {String} authKey
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableFaceRecognitionKey {Boolean}
     * - isEnableAgeGenderKey {Boolean}
     * - isEnableHumanoidDetectionKey {Boolean}
     */
    addAuthKey: authKey => api({
      method: 'post',
      url: '/api/auth-keys',
      data: {authKey}
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableFaceRecognitionKey {Boolean}
     * - isEnableAgeGenderKey {Boolean}
     * - isEnableHumanoidDetectionKey {Boolean}
     */
    getAuthStatus: () => api({
      method: 'get',
      url: '/api/auth-status'
    })
  }
};
