const api = require('./index.js').withApiWrapper();

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
     * - projectId {string}
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
    setup: ({language, account}) => api({
      method: 'post',
      url: '/api/system/_setup',
      data: {
        language,
        account
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
     * - sdRecordingStatus {Number} // 0 not recording, 1 recording
     * - sdRecordingEnabled {Boolean} // true enabled, false not enabled
     * - sdRecordingStream {Number} // stream 1 == 1 or stream 2 === 2
     * - sdRecordingType {Number} // 0: disconnection, 1: event recording, or 2: continuously recording
     * - sdRecordingDuration {Number} // 0: till the storage limitation, or 1-60 minute recording
     * - sdRecordingLimit {Number} // 1: gonna delete oldest recording file, or 0: just stop recording if no enough space for new file
     * - sdPrerecordingDuration {Number} // from 0 to 10, each representing 1 second
     */
    getSDCardRecordingSettings: () => api({
      method: 'get',
      url: '/api/system/systeminfo/sdcard-recording'
    }),
    updateSDCardRecordingSettings: (
      {sdRecordingStatus, sdRecordingDuration, sdRecordingEnabled, sdRecordingLimit, sdRecordingStream, sdRecordingType, sdPrerecordingDuration}
    ) => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard-recording',
      data: {
        sdRecordingStatus,
        sdRecordingDuration,
        sdRecordingEnabled,
        sdRecordingLimit,
        sdRecordingStream,
        sdRecordingType,
        sdPrerecordingDuration
      }
    }),
    /**
     * @returns {Promise<Response>}
     * @response 200 Object
     * - recordingVideoNumber {Number}
     * - recordingVideoBytes {Number}
     * - snapshotImageCount {Number}
     * - snapshotImageBytes {Number}
     * - sdCardTotalBytes {Number}
     * - sdCardAvailableBytes {Number}
     * - sdcardReservedBytes {Number}
     * - isInitialized {Number}
     */
    getSDCardSpaceAllocationInfo: () => api({
      method: 'get',
      url: '/api/system/systeminfo/sd-space-allocation-info'
    }),
    /**
     * @returns {Promise<Response>}
     * @response 200 Object
     * - snapshotMaxNumber {Number} // - 0 ~ 131071
     */
    getSDCardSnapshotMaxNumber: () => api({
      method: 'get',
      url: '/api/system/snapshot/max-entry'
    }),
    updateSDCardSnapshotMaxNumber: ({snapshotMaxNumber}) => api({
      method: 'put',
      url: '/api/system/snapshot/max-entry',
      data: {snapshotMaxNumber}
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
    mountSDCard: () => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard/mount'
    }),
    /**
     * @param {String} type - Type of file, `video` or `image`
     * @param {String} directoryName - Folder or file
     * @param {String} date - Filter files by date, format is `YYYY-MM-DD`
     * @param {String} folder - what folder to find files, default is `/storage/sdcard1/Android/data/com.avc.service.rtsp/files`.
     * @returns {Promise<Response>}
     * @response 200 {Array<Object>}
     * - [].bytes {Number}
     * - [].name {String} display name
     * - [].path {String} for delete/download/etc need
     * - [].type {String} folder or file
     * - [].extension {String} `video` or `image` or something else
     * - [].timestamp {String|Number}
     * - [].ownerId {String} app id that created it
     */
    getSDCardStorageFiles: (type, directoryName, date, folder) => api({
      method: 'post',
      url: '/api/system/systeminfo/sdcard-storage',
      data: {
        type,
        directoryName,
        folder,
        date
      }
    }),
    /**
     * Request a batch download of files.
     * @param {String} type - type of file, `image` or `video`.
     * @param {Array<String>} files - what files to download.
     * @returns {Promise<Response>}
     * @response 204
     */
    downloadSDCardStorageFiles: (type, files) => api({
      method: 'post',
      url: '/api/sdcard-storage/batchDownload',
      data: {
        type,
        fileList: files
      }
    }),
    /**
     * Request a batch download of files.
     * @returns {Promise<Response>}
     * @response 200 {Objet}
     *  - progress {Number}
     */
    getDownloadSDCardStorageFilesStatus: () => api({
      method: 'get',
      url: '/api/sdcard-storage/batchDownloadStatus'
    }),
    /**
     * Request to delete downloaded zip file.
     * @returns {Promise<Response>}
     * @response 204
     */
    deleteDownloadedSDCardStorageFiles: () => api({
      method: 'delete',
      url: '/api/sdcard-storage/batchDownload'
    }),
    /**
     * e.g. `files`: ["/sdcard/test/file1.txt", "/sdcard/test/file2.txt", "/sdcard/test/folder1/file2.txt"]
     * @param {String} type - Type of file, `image` or `video`
     * @param {Array<String>} files - what files to delete.
     * @returns {Promise<Response>}
     * @response 200 {Object}
     * - status
     */
    deleteSDCardStorageFiles: (type, files) => api({
      method: 'delete',
      url: '/api/system/systeminfo/sdcard-storage/delete',
      data: {
        type,
        files
      }
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
     * - resultIP {String}
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
     * - isEnableSchedule {boolean}
     * - timePeriods {Array<{start: string, end: string, isRepeat: boolean}>}
     * - isEnableGPIO {boolean}
     * - isEnableGPIO1 {boolean}
     * - isEnableGPIO2 {boolean}
     * - isEnableApp {boolean}
     * - isEnableEmail {boolean}
     * - isEnableVMS {boolean}
     * - isEnableSDCardRecording {Boolean}
     * - faceRecognitionVMSEvent {string}
     * - emails {Array<string>}
     * - emailAttachmentType {string}
     * - senderSubject {string}
     * - senderContent {string}
     * - emailContentPosition {string}
     * - groups {Array<string>}
     * - isEnableFaceRecognition {boolean}
     * - faceRecognitionCondition {string}
     * - selectedDay {object}
     * - hdIntrusionAreaId {number}
     * - hdEnabled {boolean}
     * - hdOption {string}
     * - hdCapacity {number}
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
      isEnableSchedule,
      timePeriods,
      isEnableGPIO,
      isEnableGPIO1,
      isEnableGPIO2,
      isEnableApp,
      isEnableEmail,
      isEnableVMS,
      isEnableSDCardRecording,
      faceRecognitionVMSEvent,
      emails,
      emailAttachmentType,
      senderSubject,
      senderContent,
      emailContentPosition,
      groups,
      isEnableFaceRecognition,
      faceRecognitionCondition,
      selectedDay,
      hdIntrusionAreaId,
      hdEnabled,
      hdOption,
      hdCapacity
    }) => api({
      method: 'post',
      url: '/api/notification/cards',
      data: {
        type,
        title,
        isTop,
        isEnableTime,
        isEnableSchedule,
        timePeriods,
        isEnableGPIO,
        isEnableGPIO1,
        isEnableGPIO2,
        isEnableApp,
        isEnableEmail,
        isEnableVMS,
        isEnableSDCardRecording,
        faceRecognitionVMSEvent,
        emails,
        emailAttachmentType,
        senderSubject,
        senderContent,
        emailContentPosition,
        groups,
        isEnableFaceRecognition,
        faceRecognitionCondition,
        selectedDay,
        hdIntrusionAreaId,
        hdEnabled,
        hdOption,
        hdCapacity
      }
    }),
    updateCard: ({
      id,
      type,
      title,
      isTop,
      isEnableTime,
      isEnableSchedule,
      timePeriods,
      isEnableGPIO,
      isEnableGPIO1,
      isEnableGPIO2,
      isEnableApp,
      isEnableEmail,
      isEnableVMS,
      isEnableSDCardRecording,
      faceRecognitionVMSEvent,
      emails,
      emailAttachmentType,
      senderSubject,
      senderContent,
      emailContentPosition,
      groups,
      isEnableFaceRecognition,
      faceRecognitionCondition,
      selectedDay,
      hdIntrusionAreaId,
      hdEnabled,
      hdOption,
      hdCapacity
    }) => api({
      method: 'put',
      url: `/api/notification/cards/${id}`,
      data: {
        type,
        title,
        isTop,
        isEnableTime,
        isEnableSchedule,
        timePeriods,
        isEnableGPIO,
        isEnableGPIO1,
        isEnableGPIO2,
        isEnableApp,
        isEnableEmail,
        isEnableVMS,
        isEnableSDCardRecording,
        faceRecognitionVMSEvent,
        emails,
        emailAttachmentType,
        senderSubject,
        senderContent,
        emailContentPosition,
        groups,
        isEnableFaceRecognition,
        faceRecognitionCondition,
        selectedDay,
        hdIntrusionAreaId,
        hdEnabled,
        hdOption,
        hdCapacity
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
    }),
    /**
     * Get Human detection report
     * @param {Number} index
     * @param {Number} interval
     * @param {Number} size
     * @param {Date|null} start The start time.
     * @param {Date|null} end The end time.
     * @returns {Promise<Response>}
     * @response 200 {Object}
     *   - index: {Number} The current page index.
     *   - size: {Number} The current page size.
     *   - total: {Number} The total item quantity.
     *   - items: {Array<Object>}
     *   - - date: {String}
     *   - - timeInterval: {String}
     *   - - enterCount: {Number}
     *   - - exitCount: {Number}
     */
    getHdReport: ({index, start, end, interval, size = null}) => api({
      method: 'get',
      url: '/api/human-detection/report',
      params: {
        index,
        start,
        end,
        interval,
        size
      }
    }),
    /**
     * Get Human detection settings
     * @returns {Promise<Response>}
     * @response 200 {Object}
     * - {Boolean}  isEnable                   Human Detection status (True: Enabled, False: Disabled)
     * - {Object[]} triggerArea                Human detection trigger area
     * - {String}   triggerArea.id             ID of trigger area
     * - {Boolean}  triggerArea.isEnable       Trigger area status (True: Enabled, False: Disabled)
     * - {Boolean}  triggerArea.isDisplay      Display trigger area on OSD (True: Display, False: Hide)
     * - {Number}   triggerArea.stayTime       How many stayed seconds before triggers in area
     * - {Number}   triggerArea.stayCountLimit How many people to engage triggers in area
     * - {String}   triggerArea.name           Name of trigger area
     * - {Object}   triggerArea.rect           The four points to define trigger area in rectangle
     * - {Number}   triggerArea.rect.bottom    The bottom point of trigger area
     * - {Number}   triggerArea.rect.left      The left point of trigger area
     * - {Number}   triggerArea.rect.right     The right point of trigger area
     * - {Number}   triggerArea.rect.top       The top point of trigger area
     * - {Object[]} triggerLine                Human detection trigger lines
     * - {String}   triggerLine.id             ID of trigger line
     * - {Boolean}  triggerLine.isEnable       Trigger line status (True: Enabled, False: Disabled)
     * - {Boolean}  triggerLine.isDisplay      Display trigger line on OSD (True: Display, False: Hide)
     * - {String}   triggerLine.name           Name of trigger line
     * - {Array}    triggerLine.point          Array of points to define trigger line
     * - {Number}   triggerLine.point.x        1st point of trigger line
     * - {Number}   triggerLine.point.y        2nd point of trigger line
     */
    getHumanDetectionSettings: () => api({
      method: 'get',
      url: '/api/human-detection/settings'
    }),
    /**
     * Update Human detection settings
     * @returns {Promise<Response>}
     * @param {Boolean}   isEnable                   Human Detection status (True: Enabled, False: Disabled)
     * @param {Object[]}  triggerArea                Human detection trigger area
     * @param {String}    triggerArea.id             ID of trigger area
     * @param {Boolean}   triggerArea.isEnable       Trigger area status (True: Enabled, False: Disabled)
     * @param {Boolean}   triggerArea.isDisplay      Display trigger area on OSD (True: Display, False: Hide)
     * @param {Number}    triggerArea.stayTime       How many stayed seconds before triggers in area
     * @param {Number}    triggerArea.stayCountLimit How many people to engage triggers in area
     * @param {String}    triggerArea.name           Name of trigger area
     * @param {Object}    triggerArea.rect           The four points to define trigger area in rectangle
     * @param {Number}    triggerArea.rect.bottom    The bottom point of trigger area
     * @param {Number}    triggerArea.rect.left      The left point of trigger area
     * @param {Number}    triggerArea.rect.right     The right point of trigger area
     * @param {Number}    triggerArea.rect.top       The top point of trigger area
     * @param {Object[]}  triggerLine                Human detection trigger lines
     * @param {String}    triggerLine.id             ID of trigger line
     * @param {Boolean}   triggerLine.isEnable       Trigger line status (True: Enabled, False: Disabled)
     * @param {Boolean}   triggerLine.isDisplay      Display trigger line on OSD (True: Display, False: Hide)
     * @param {String}    triggerLine.name           Name of trigger line
     * @param {Array}     triggerLine.point          Array of points to define trigger line
     * @param {Number}    triggerLine.point.x        1st point of trigger line
     * @param {Number}    triggerLine.point.y        2nd point of trigger line
     *
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - {Boolean}  isEnable                   Human Detection status (True: Enabled, False: Disabled)
     * - {Object[]} triggerArea                Human detection trigger area
     * - {String}   triggerArea.id             ID of trigger area
     * - {Boolean}  triggerArea.isEnable       Trigger area status (True: Enabled, False: Disabled)
     * - {Boolean}  triggerArea.isDisplay      Display trigger area on OSD (True: Display, False: Hide)
     * - {Number}   triggerArea.stayTime       How many stayed seconds before triggers in area
     * - {Number}   triggerArea.stayCountLimit How many people to engage triggers in area
     * - {String}   triggerArea.name           Name of trigger area
     * - {Object}   triggerArea.rect           The four points to define trigger area in rectangle
     * - {Number}   triggerArea.rect.bottom    The bottom point of trigger area
     * - {Number}   triggerArea.rect.left      The left point of trigger area
     * - {Number}   triggerArea.rect.right     The right point of trigger area
     * - {Number}   triggerArea.rect.top       The top point of trigger area
     * - {Object[]} triggerLine                Human detection trigger lines
     * - {String}   triggerLine.id             ID of trigger line
     * - {Boolean}  triggerLine.isEnable       Trigger line status (True: Enabled, False: Disabled)
     * - {Boolean}  triggerLine.isDisplay      Display trigger line on OSD (True: Display, False: Hide)
     * - {String}   triggerLine.name           Name of trigger line
     * - {Array}    triggerLine.point          Array of points to define trigger line
     * - {Number}   triggerLine.point.x        1st point of trigger line
     * - {Number}   triggerLine.point.y        2nd point of trigger line
     */
    updateHumanDetectionSettings: ({isEnable, triggerArea, triggerLine}) => api({
      method: 'put',
      url: '/api/human-detection/settings',
      data: {
        isEnable,
        triggerArea,
        triggerLine
      }
    }),
    /**
    * Get age & gender detection report
    * @param {Number} index        Page number index
    * @param {Number} interval     Specify the maximum number of entries to be returned per query
    * @param {Number} size         Specify the time interval of report to be generated
    * @param {Date|null} start     Start time.
    * @param {Date|null} end       End time.
    * @returns {Promise<Response>}
    * @response 200 {Object}
    * - {Number}         index                     The current page index.
    * - {Number}         size                      The current page size.
    * - {Number}         total                     The total item quantity.
    * - {Number}         ageInterval               Age group interval
    * - {Array<Object>}  items                     Array of age & gender grouped objects
    * - {String}         items.date                Date of concerned count stat
    * - {String}         items.timeInterval        Time interval of concerned count stat
    * - {Array<Object>}  items.age                 Array of particular age group stat
    * - {Number}         items.age.male            Number of male counted for the age group
    * - {Number}         items.age.female          Number of female counted for the age group
    */
    getAgReport: ({index, start, end, interval, size = null}) => api({
      method: 'get',
      url: '/api/age-gender-detection/report',
      params: {
        index,
        start,
        end,
        interval,
        size
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
    getMembers: ({index, keyword, group, sort, size = null}) => api({
      method: 'get',
      url: '/api/members',
      params: {
        index,
        keyword,
        group,
        sort,
        size
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
     * @param {String} picture
     * @param {String} id
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - pictureCount {Number}
     */
    addPhoto: ({picture, id}) => api({
      method: 'post',
      url: '/api/members/add-photo',
      data: {
        picture,
        id
      }
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - totalCount {String} Total number of photos in database
     */
    totalCount: () => api({
      method: 'get',
      url: '/api/members/total-count'
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - remainingPictureCount {String} Number of photos allowed based on license key
     */
    remainingPictureCount: () => api({
      method: 'get',
      url: '/api/members/remaining-picture-count'
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
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    getDevice: () => api({
      method: 'get',
      url: '/api/members/device-sync'
    }),
    /**
     * @param {String} ip - Device IP
     * @param {String} port - Device port
     * @param {String} username - Device login username
     * @param {String} password - Device login password
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - syncStatus {Number} - Master device sync status
     * - devices {Array}
     * - - account: {String}
     * - - id: {Number}
     * - - ip: {String}
     * - - port: {Number}
     * - - name: {String}
     * - - connectionStatus: {Number} - Is the device linked or unlinked
     * - - lastUpdateTime: {Number} - Latest successful sync time
     * - - syncStatus: {Number} - Slave device sync status
     */
    addDevice: ({ip, port, account, password}) => api({
      method: 'post',
      url: '/api/members/device-sync',
      data: {
        ip,
        port,
        account,
        password
      }
    }),
    /**
     * @param {String} id
     * @param {String} ip - Device IP
     * @param {String} port - Device port
     * @param {String} username - Device login username
     * @param {String} password - Device login password
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    editDevice: ({id, ip, port, account, password}) => api({
      method: 'put',
      url: `/api/members/device-sync/${id}`,
      data: {
        ip,
        port,
        account,
        password
      }
    }),
    /**
     * @param {Array} devices - Array of objects of device ids' to be deleted
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    deleteDevice: devices => api({
      method: 'delete',
      url: '/api/members/device-sync',
      data: devices
    }),
    /**
     * @param {Array} devices - Array of objects of device ids' to be refreshed
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    refreshDevice: devices => api({
      method: 'post',
      url: '/api/members/sync-status',
      data: devices
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    cancelSync: () => api({
      method: 'post',
      url: '/api/members/cancel-sync'
    }),
    /**
     * @param {Array} devices - Array of objects of device ids' to be synced
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    syncDB: (devices = {devices: []}) => api({
      method: 'post',
      url: '/api/members/sync-db',
      data: devices
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    getSyncSchedule: () => api({
      method: 'get',
      url: '/api/members/sync-schedule'
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     */
    updateSyncSchedule: ({isEnabled, interval, time, deviceList}) => api({
      method: 'put',
      url: '/api/members/sync-schedule',
      data: {
        isEnabled,
        interval,
        time,
        deviceList
      }
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
    getOSDSettings: () => api({
      method: 'get',
      url: '/api/multimedia/osd/settings'
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
    updateOSDSettings: ({isEnable, fontSize, color, position, type, customText}) => api({
      method: 'put',
      url: '/api/multimedia/osd/settings',
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
    }),
    getEventReport: () => api({
      method: 'get',
      url: '/api/face-events/report'
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
