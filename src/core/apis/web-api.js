const api = require('./index.js');

module.exports = {
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
      data: {account, birthday}
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
      data: {account, password, maxAge: Number(maxAge)}
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
     * Change the password with the birthday.
     * @param {String} account
     * @param {String} birthday e.g. "19900101"
     * @param {String} password
     * @returns {Promise<response>}
     * @response 200 {UserModel}
     */
    changePasswordWithBirthday: ({account, birthday, password}) => api({
      method: 'post',
      url: '/api/account/_change-password',
      data: {account, birthday, password}
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
      data: {password, newPassword}
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
     * @param {String} birthday
     * @param {String} password
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {Number}
     * - account {String}
     * - permission {String}
     */
    addUser: ({account, permission, birthday, password}) => api({
      method: 'post',
      url: '/api/users',
      data: {account, permission, birthday, password}
    }),
    /**
     * @param {Number} id
     * @param {String} account
     * @param {String} permission
     * @param {String} birthday
     * @param {String} password The old password.
     * @param {String} newPassword
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - id {Number}
     * - account {String}
     * - permission {String}
     */
    updateUser: ({id, account, birthday, permission, password, newPassword}) => api({
      method: 'put',
      url: `/api/users/${id}`,
      data: {account, birthday, permission, password, newPassword}
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
     * - isEnableFaceRecognition {Boolean}
     * - isEnableAgeGender {Boolean}
     * - isEnableHumanoidDetection {Boolean}
     * - deviceStatus {Number}
     * - usedDiskSize {Number}
     * - totalDiskSize {Number}
     */
    getInformation: () => api({
      method: 'get',
      url: '/api/system/information'
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
      data: {deviceToken, deviceId, interval}
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
      data: {isEnable, ioType}
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
      data: {isEnable, ioType, gateType, pulse, delay}
    }),
    /**
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
    updateSMTPSettings: ({encryption, host, port, account, password, senderName, senderEmail, interval, isEnableLoginNotification, isEnableAuth}) => api({
      method: 'put',
      url: '/api/notification/smtp/settings',
      data: {encryption, host, port, account, password, senderName, senderEmail, interval, isEnableLoginNotification, isEnableAuth}
    })
  },
  video: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - defoggingEnabled {Boolean}
     * - irEnabled {Boolean}
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
     * - isAutoFocus {Boolean}
     * - focalLength {Number}
     * - zoom {Number}
     */
    getSettings: () => api({
      method: 'get',
      url: '/api/video/settings'
    }),
    /**
     * @param {Boolean} defoggingEnabled
     * @param {Boolean} irEnabled
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
     * @param {Boolean} autoFocusEnabled
     * @param {Number} focalLength
     * @param {Number} zoom
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - defoggingEnabled {Boolean}
     * - irEnabled {Boolean}
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
     * - autoFocusEnabled {Boolean}
     * - focalLength {Number}
     * - zoom {Number}
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
      refreshRate
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
        refreshRate
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
     * @returns {Promise<response>}
     */
    updateFocusSettings: ({focalLength, zoom}) => api({
      method: 'put',
      url: '/api/video/settings/focus',
      data: {focalLength, zoom}
    })
  },
  smartFunction: {
    /**
     * Schema: webserver-form-schema/face-recognition-settings-schema
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
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
     * @param {string} confidenceLevel
     * @param {boolean} isShowMember
     * @param {boolean} isShowGroup
     * @param {boolean} isShowUnknown
     * @param {Object} triggerArea
     * @param {boolean} isEnableFaceFrame
     * @param {Object} faceFrame
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
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
    updateFaceRecognitionSettings: ({isEnable, confidenceLevel, isShowMember, isShowGroup, isShowUnknown, triggerArea, isEnableFaceFrame, faceFrame}) => api({
      method: 'put',
      url: '/api/face-recognition/settings',
      data: {
        isEnable,
        confidenceLevel,
        isShowMember,
        isShowGroup,
        isShowUnknown,
        triggerArea,
        isEnableFaceFrame,
        faceFrame
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
      data: {name, note}
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
      data: {name, note}
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
      params: {index, keyword, group, sort}
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
     * - - format {String} webserver-form-schema/constants/stream-format
     * - - resolution {String} webserver-form-schema/constants/stream-resolution
     * - - frameRate {String}
     * - - bandwidthManagement {String}
     * - - vbrBitRateLevel {String}
     * - - vbrMaxBitRate {String}
     * - - cbrBitRate {String}
     * - - gov {String}
     * - channelB {Object} It is same as channelA.
     */
    getStreamSettings: () => api({
      method: 'get',
      url: '/api/multimedia/stream/settings'
    }),
    /**
     * @param {Object} channelA
     * @property {String} format webserver-form-schema/constants/stream-format
     * @property {String} resolution webserver-form-schema/constants/stream-resolution
     * @property {String} frameRate
     * @property {String} bandwidthManagement
     * @property {String} vbrBitRateLevel
     * @property {String} vbrMaxBitRate
     * @property {String} cbrBitRate
     * @property {String} gov
     * @param {Object} channelB It is same as channelA.
     * @returns {Promise<response>} webserver-form-schema/stream-settings-schema
     * @response 200 {Object}
     * - channelA {Object}
     * - - format {String} webserver-form-schema/constants/stream-format
     * - - resolution {String} webserver-form-schema/constants/stream-resolution
     * - - frameRate {String}
     * - - bandwidthManagement {String}
     * - - vbrBitRateLevel {String}
     * - - vbrMaxBitRate {String}
     * - - cbrBitRate {String}
     * - - gov {String}
     * - channelB {Object} It is same as channelA.
     */
    updateStreamSettings: ({channelA, channelB}) => api({
      method: 'put',
      url: '/api/multimedia/stream/settings',
      data: {channelA, channelB}
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
      data: {isEnableAudioToStream, isEnablePassword, tcpPort, udpPort, connectionLimit}
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
      data: {isEnable, maskAreas}
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
     * @param {boolean} isEnableOutput
     * @param {string} inputQuality
     * @param {string} inputSource
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnableInput {boolean}
     * - isEnableOutput {boolean}
     * - inputQuality {string}
     * - inputSource {string}
     */
    updateAudioSettings: ({isEnableInput, isEnableOutput, inputQuality, inputSource}) => api({
      method: 'put',
      url: '/api/multimedia/audio/settings',
      data: {isEnableInput, isEnableOutput, inputQuality, inputSource}
    }),
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - fontSize {string}
     * - color {string}
     * - position {string}
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
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - isEnable {boolean}
     * - fontSize {string}
     * - color {string}
     * - position {string}
     */
    updateWordSettings: ({isEnable, fontSize, color, position}) => api({
      method: 'put',
      url: '/api/multimedia/word/settings',
      data: {isEnable, fontSize, color, position}
    })
  },
  event: {
    /**
     * @param {Array<String>|String} enrollStatus webserver-form-schema/constants/event-filters/enroll-status
     * @param {Array<String>|String} confidence webserver-form-schema/constants/event-filters/confidence
     * @param {Number} index
     * @param {String} keyword
     * @param {Date|null} start The start time.
     * @param {Date|null} end The end time.
     * @param {String} sort "time", "-time", "name", "-name", "organization", "-organization", "group", "-group"
     * "time": Sorting by time with ASC.
     * "-time": Sorting by time with DESC.
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - index {Number} The current page index.
     * - size {Number} The current page size.
     * - total {Number} The total item quantity.
     * - items {Array<Object>}
     * - items[].id {String}
     * - items[].pictureThumbUrl {String}
     * - items[].pictureLargeUrl {String}
     * - items[].time {String} ISO8601 "2019-10-02T02:00:00.000Z"
     * - items[].confidences {Array<Object>}
     * - items[].confidences[].score {Number}
     * - items[].confidences[].confidence {String}
     * - items[].confidences[].enrollStatus {String}
     * - items[].confidences[].member {Object|null}
     * - - id {String}
     * - - name {String}
     * - - organization {String}
     * - - groupId {String} The group id.
     * - - note {String}
     * - - pictures {Array<String>} The base64 string of jpeg images.
     */
    getFaceEvents: ({enrollStatus, confidence, index, keyword, start, end, sort}) => api({
      method: 'get',
      url: '/api/face-events',
      params: {enrollStatus, confidence, index, keyword, start, end, sort}
    })
  },
  authKey: {
    /**
     * @returns {Promise<response>}
     * @response 200 {Object}
     * - items {Array<Object>}
     * - items[].authKey {String}
     * - items[].isEnableFaceRecognition {Boolean}
     * - items[].isEnableAgeGender {Boolean}
     * - items[].isEnableHumanoidDetection {Boolean}
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
     * - isEnableFaceRecognition {Boolean}
     * - isEnableAgeGender {Boolean}
     * - isEnableHumanoidDetection {Boolean}
     */
    addAuthKey: authKey => api({
      method: 'post',
      url: '/api/auth-keys',
      data: {authKey}
    })
  }
};
