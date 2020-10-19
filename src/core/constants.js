module.exports = {
  store: {
    CHANGE: 'STORE_CHANGE_',
    IS_API_PROCESSING: '$isApiProcessing',
    EXPIRES: '$expires',
    EXPIRES_TIMER: '$expiresTimer',
    UPDATE_FOCAL_LENGTH_FIELD: '$updateFocalLengthField',
    IS_NOT_CALL_UNLOAD_ALERT: '$isNotCallUnloadAlert'
  },
  AVAILABLE_LANGUAGE_CODES: ['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es'],
  MEMBERS_PAGE_GROUPS_MAX: 32,
  SECURITY_USERS_MAX: 20,
  DEVICE_NAME_CHAR_MAX: 32,
  NOTIFY_CARDS_MAX: 256,
  NOTIFY_CARDS_EMAIL_MAX: 64,
  REDIRECT_COUNTDOWN: 5,
  MEMBER_PHOTO_SCALE_STEP: 0.1,
  MEMBER_PHOTO_SCALE_MIN: 1,
  MEMBER_PHOTO_SCALE_MAX: 2,
  MEMBER_PHOTO_MIME_TYPE: 'image/jpeg',
  RESTRICTED_PORTS: [
    '0', // Reserved
    '1', // Tcpmux
    '7', // Echo
    '9', // Discard
    '11', // Systat
    '13', // Daytime
    '15', // Netstat
    '17', // Qotd
    '19', // Chargen
    '20', // Ftp data
    '21', // Ftp access
    '22', // Ssh
    '23', // Telnet
    '25', // Smtp
    '37', // Time
    '42', // Name
    '43', // Nicname
    '53', // Domain
    '77', // Priv-rjs
    '79', // Finger
    '80', // Android app reserved
    '87', // Ttylink
    '95', // Supdup
    '101', // Hostriame
    '102', // Iso-tsap
    '103', // Gppitnp
    '104', // Acr-nema
    '109', // Pop2
    '110', // Pop3
    '111', // Sunrpc
    '113', // Auth
    '115', // Sftp
    '117', // Uucp-path
    '119', // Nntp
    '123', // NTP
    '135', // Loc-srv /epmap
    '139', // Netbios
    '143', // Imap2
    '179', // BGP
    '389', // Ldap
    '443', // Android app reserved
    '465', // Smtp+ssl
    '512', // Print / exec
    '513', // Login
    '514', // Shell
    '515', // Printer
    '526', // Tempo
    '530', // Courier
    '531', // Chat
    '532', // Netnews
    '540', // Uucp
    '556', // Remotefs
    '563', // Nntp+ssl
    '587', // Stmp?
    '601', // ??
    '636', // Ldap+ssl
    '993', // Ldap+ssl
    '995', // Pop3+ssl
    '2049', // Nfs
    '3659', // Apple-sasl / PasswordServer
    '4045', // Lockd
    '5555', // 工程模式
    '6000', // X11
    '6665', // Alternate IRC [Apple addition]
    '6666', // Alternate IRC [Apple addition]
    '6667', // Standard IRC [Apple addition]
    '6668', // Alternate IRC [Apple addition]
    '6669' // Alternate IRC [Apple addition]
  ],
  PORT_NUMBER_MIN: 1024,
  PORT_NUMBER_MAX: 65535,
  DEFAULT_PORTS: {
    RTSP_TCP: '8554',
    RTSP_UDP: '17300',
    HTTP: '8080',
    HTTPS: '8443'
  },
  SD_STATUS_LIST: [ // Order is important!
    // 0 - MOUNTED: 外部儲存體存在且可以進行讀取與寫入
    'Functioning',
    // 1 - UNMOUNTED: 外部儲存體存在但未被掛載
    'Unmounted',
    // 2 - SDCARDNOTEXIST: 外部儲存體不存在
    'Empty Slot',
    // 3 - ABNORMAL: 外部儲存體異常
    'Nonfunctioning',
    // 4 - READONLY: 外部儲存體存在但只能進行讀取
    'Read-only Access',
    // 5 - UNKNOWN: Unknown storage state, such as when a path isn't backed by known storage media.
    'Unknown Error'
  ],
  TIMEZONE_LIST: (() => {
    const tzOptions = require('@vvo/tzdb')
      .getTimeZones()
      .map(zone => {
        return {
          ...zone,
          label: `UTC${zone.rawFormat}`
        };
      });
    tzOptions.sort((a, b) => {
      if (a.rawFormat[0] === '-') {
        return b.rawFormat.localeCompare(a.rawFormat);
      }

      return a.rawFormat.localeCompare(b.rawFormat);
    });
    return tzOptions;
  })(),
  VMS_CAMERA_LINK: 'cameralink'
};
