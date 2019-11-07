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
      method: 'get',
      url: '/api/system/information'
    }),
    updateDeviceName: deviceName => api({
      method: 'put',
      url: '/api/system/device-name',
      data: {deviceName}
    }),
    setup: ({language, account, https}) => api({
      method: 'post',
      url: '/api/system/_setup',
      data: {
        language,
        account,
        https
      }
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
      method: 'post',
      url: '/api/video/settings/_reset'
    })
  },
  group: {
    getGroups: () => api({
      method: 'get',
      url: '/api/groups'
    }),
    getGroup: groupId => api({
      method: 'get',
      url: `/api/groups/${groupId}`
    }),
    addGroup: ({name, note}) => api({
      method: 'post',
      url: '/api/groups',
      data: {name, note}
    })
  },
  member: {
    getMembers: ({index, keyword, group}) => api({
      method: 'get',
      url: '/api/members',
      params: {index, keyword, group}
    }),
    addMember: ({name, organization, group, note, pictures}) => api({
      method: 'post',
      url: '/api/members',
      data: {
        name,
        organization,
        groupId: Number(group),
        note,
        pictures
      }
    }),
    getMember: memberId => api({
      method: 'get',
      url: `/api/members/${memberId}`
    })
  }
};
