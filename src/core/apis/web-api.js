const api = require('./');

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
    })
  }
};
