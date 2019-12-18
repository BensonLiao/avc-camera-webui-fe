const api = require('./index.js');

module.exports = {
  validation: {
    accountBirthday: ({account, birthday}) => api({
      /*
      Validate the birthday of the account.
      @param args {Object}
        account: {String}
        birthday: {String} "19910326"
      @response 204
       */
      method: 'post',
      url: '/api/_validate/account-birthday',
      data: {account, birthday}
    })
  },
  account: {
    login: ({account, password, maxAge}) => api({
      /*
      Do authentication with account and password.
      @param args {Object}
        account: {String}
        password: {String}
        maxAge: {String|Number} milliseconds
      @returns {Promise<Object>}
      @response 200 {UserModel} with set-cookie
      @response 400 {Object}
        extra: {Object}
          loginFailedTimes: {Number}
      @response 429 {Object}
        extra: {Object}
          loginFailedTimes: {Number}
          loginLockExpiredTime: {Date}
       */
      method: 'post',
      url: '/api/account/_login',
      data: {account, password, maxAge: Number(maxAge)}
    }),
    logout: () => api({
      /*
      Logout.
      @response 204 with set-cookie
       */
      method: 'post',
      url: '/api/account/_logout'
    }),
    changePasswordWithBirthday: ({account, birthday, password}) => api({
      /*
      Change the password with the birthday.
      @param args {Object}
        account: {String}
        birthday: {String} "19910326"
        password: {String}
      @response 200 {UserModel} with set-cookie
       */
      method: 'post',
      url: '/api/account/_change-password',
      data: {account, birthday, password}
    }),
    changeMyPassword: ({password, newPassword}) => api({
      /*
      Change my password.
      @param args {Object}
        password: {String}
        newPassword: {String}
      @response 200 {UserModel}
       */
      method: 'put',
      url: '/api/me/password',
      data: {password, newPassword}
    })
  },
  user: {
    getUsers: () => api({
      /*
      @response 200
        items: {Array<Object>}
          id: {Number}
          account: {String}
          permission: {String}
       */
      method: 'get',
      url: '/api/users'
    }),
    getUser: userId => api({
      /*
      @param userId {Object}
      @response 200
        id: {Number}
        account: {String}
        permission: {String}
       */
      method: 'get',
      url: `/api/users/${userId}`
    }),
    addUser: ({account, permission, birthday, password}) => api({
      /*
      @param args {Object}
        account: {String}
        permission: {String}
        birthday: {String}
        password: {String}
      @response 200
        id: {Number}
        account: {String}
        permission: {String}
       */
      method: 'post',
      url: '/api/users',
      data: {account, permission, birthday, password}
    }),
    updateUser: ({id, account, birthday, permission, password, newPassword}) => api({
      /*
      @param args {Object}
        id: {Number}
        account: {String}
        birthday: {String}
        permission: {String}
        password: {String} The old password.
        newPassword: {String}
      @response 200
        id: {Number}
        account: {String}
        permission: {String}
       */
      method: 'put',
      url: `/api/users/${id}`,
      data: {account, birthday, permission, password, newPassword}
    }),
    deleteUser: userId => api({
      /*
      @param userId {Number}
      @response 204
       */
      method: 'delete',
      url: `/api/users/${userId}`
    })
  },
  system: {
    getInformation: () => api({
      /*
      @response 200
        languageCode: {String}
        deviceName: {String}
        isEnableFaceRecognition: {Boolean}
        isEnableAgeGender: {Boolean}
        isEnableHumanoidDetection: {Boolean}
        deviceStatus: {Number}
        usedDiskSize: {Number}
        totalDiskSize: {Number}
       */
      method: 'get',
      url: '/api/system/information'
    }),
    updateDeviceName: deviceName => api({
      /*
      @param deviceName {String}
      @response 200
        deviceName: {String}
       */
      method: 'put',
      url: '/api/system/device-name',
      data: {deviceName}
    }),
    setup: ({language, account, https}) => api({
      /*
      @param args {Object}
        language: {String} "en-us", "zh-tw", "zh-cn", "ja-jp", "es-es"
        account: {Object}
          permission: {String}
          account: {String}
          birthday: {String}
          password: {String}
      @response 200
        account: {String}
       */
      method: 'post',
      url: '/api/system/_setup',
      data: {
        language,
        account,
        https
      }
    }),
    updateLanguage: language => api({
      /*
      @param language {String} "en-us", "zh-tw", "zh-cn", "ja-jp", "es-es"
      @response 200
        language: {String}
       */
      method: 'put',
      url: '/api/system/language',
      data: {language}
    })
  },
  video: {
    getSettings: () => api({
      method: 'get',
      url: '/api/video/settings'
    }),
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
    resetSettings: () => api({
      /*
      @response 204
       */
      method: 'post',
      url: '/api/video/settings/_reset'
    })
  },
  group: {
    getGroups: () => api({
      /*
      @response 200
        items: {Array<Object>}
          id: {String}
          name: {String}
          note: {String}
       */
      method: 'get',
      url: '/api/groups'
    }),
    getGroup: groupId => api({
      /*
      @param groupId {Object}
      @response 200
        id: {String}
        name: {String}
        note: {String}
       */
      method: 'get',
      url: `/api/groups/${groupId}`
    }),
    addGroup: ({name, note}) => api({
      /*
      @param args {Object}
        id: {String}
        name: {String}
        note: {String}
      @response 200
        id: {String}
        name: {String}
        note: {String}
       */
      method: 'post',
      url: '/api/groups',
      data: {name, note}
    }),
    updateGroup: ({id, name, note}) => api({
      /*
      @param args {Object}
        id: {String}
        name: {String}
        note: {String}
      @response 200
        id: {String}
        name: {String}
        note: {String}
       */
      method: 'put',
      url: `/api/groups/${id}`,
      data: {name, note}
    }),
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
    getMembers: ({index, keyword, group, sort}) => api({
      /*
      Get members.
      @param args {Object}
        index: {Number}
        keyword: {String}
        group: {String} The group id.
        sort: {String} "name", "-name", "organization", "-organization", "group", "-group"
          name: Sorting by name with ASC.
          -name: Sorting by name with DESC.
      @response 200
        index: {Number} The current page index.
        size: {Number} The current page size.
        total: {Number} The total item quantity.
        items: {Array<Object>}
          id: {String}
          name: {String}
          organization: {String}
          groupId: {String} The group id.
          note: {String}
          pictures {Array<String>} The base64 string of jpeg images.
       */
      method: 'get',
      url: '/api/members',
      params: {index, keyword, group, sort}
    }),
    addMember: ({name, organization, group, note, pictures}) => api({
      /*
      @param args {Object}
        name: {String}
        organization: {String}
        group: {String} The group id.
        note: {String}
        pictures {Array<String>} The base64 string of jpeg images.
      @response 200
        id: {String}
        name: {String}
        organization: {String}
        group: {String} The group id.
        note: {String}
        pictures {Array<String>} The base64 string of jpeg images.
       */
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
    updateMember: ({id, name, organization, group, note, pictures}) => api({
      /*
      @param args {Object}
        id: {String}
        name: {String}
        organization: {String}
        group: {String} The group id.
        note: {String}
        pictures {Array<String>} The base64 string of jpeg images.
      @response 200
        id: {String}
        name: {String}
        organization: {String}
        group: {String} The group id.
        note: {String}
        pictures {Array<String>} The base64 string of jpeg images.
       */
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
    getMember: memberId => api({
      /*
      @param memberId {String}
      @response 200
        id: {String}
        name: {String}
        organization: {String}
        groupId: {String}
        note: {String}
        pictures: {Array<String>}
       */
      method: 'get',
      url: `/api/members/${memberId}`
    }),
    deleteMember: memberId => api({
      /*
      @param memberId {String}
      @response 204
       */
      method: 'delete',
      url: `/api/members/${memberId}`
    }),
    /**
     * @returns {Promise<response>}
     *  response 200
     *    password: {string}
     */
    getDatabaseEncryptionSettings: () => api({
      method: 'get',
      url: '/api/members/database-encryption-settings'
    }),
    /**
     * @param {string} password - The old password.
     * @param {string} newPassword - The new password.
     * @returns {Promise<response>}
     *  response 200
     *    password: {string}
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
     *  response 204
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
    getStreamSettings: () => api({
      /*
      @returns {Promise<Object>} webserver-form-schema/stream-settings-schema
        channelA: {Object}
          format: {String} webserver-form-schema/constants/stream-format
          resolution: {String} webserver-form-schema/constants/stream-resolution
          frameRate: {String}
          bandwidthManagement: {String}
          vbrBitRateLevel: {String}
          vbrMaxBitRate: {String}
          cbrBitRate: {String}
          gop: {String}
        channelB: {Object} It is same as channelA.
       */
      method: 'get',
      url: '/api/multimedia/settings'
    }),
    updateStreamSettings: ({channelA, channelB}) => api({
      method: 'put',
      url: '/api/multimedia/settings',
      data: {channelA, channelB}
    })
  },
  event: {
    getFaceEvents: ({enrollStatus, confidence, index, keyword, start, end, sort}) => api({
      /*
      @param args {Object}
        enrollStatus: {Array<String>|String} webserver-form-schema/constants/event-filters/enroll-status
        confidence: {Array<String>|String} webserver-form-schema/constants/event-filters/confidence
        index: {Number}
        keyword: {String}
        start: {Date|null} The start time.
        end: {Date} The end time.
        sort: {String} "time", "-time", "name", "-name", "organization", "-organization", "group", "-group"
          time: Sorting by time with ASC.
          -time: Sorting by time with DESC.
      @response 200
        index: {Number} The current page index.
        size: {Number} The current page size.
        total: {Number} The total item quantity.
        items: {Array<Object>}
          id: {String}
          pictureThumbUrl: {String}
          pictureLargeUrl: {String}
          time: {String} ISO8601 "2019-10-02T02:00:00.000Z"
          confidences: {Array<Object>}
            score: {Number}
            confidence: {String}
            enrollStatus: {String}
            member: {Object|null}
              id: {String}
              name: {String}
              organization: {String}
              groupId: {String} The group id.
              note: {String}
              pictures {Array<String>} The base64 string of jpeg images.
       */
      method: 'get',
      url: '/api/face-events',
      params: {enrollStatus, confidence, index, keyword, start, end, sort}
    })
  },
  authKey: {
    getAuthKeys: () => api({
      /*
      @returns {Promise<Object>}
        items: {Array<Object>}
          authKey: {String}
          isEnableFaceRecognition: {Boolean}
          isEnableAgeGender: {Boolean}
          isEnableHumanoidDetection: {Boolean}
          isEnable: {Boolean}
          time: {String} ISO8601 "2019-10-02T02:00:00.000Z"
          user: {Object}
            id: {Number}
            name: {String}
       */
      method: 'get',
      url: '/api/auth-keys'
    }),
    addAuthKey: authKey => api({
      /*
      @param authKey {String}
      @returns {Promise<Object>}
        isEnableFaceRecognition: {Boolean}
        isEnableAgeGender: {Boolean}
        isEnableHumanoidDetection: {Boolean}
       */
      method: 'post',
      url: '/api/auth-keys',
      data: {authKey}
    })
  }
};
