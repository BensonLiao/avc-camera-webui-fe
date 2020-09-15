module.exports = {
  store: {
    CHANGE: 'STORE_CHANGE_',
    IS_API_PROCESSING: '$isApiProcessing',
    EXPIRES: '$expires',
    EXPIRES_TIMER: '$expiresTimer'
  },
  AVAILABLE_LANGUAGE_CODES: ['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es'],
  MEMBERS_PAGE_GROUPS_MAX: 32,
  SECURITY_USERS_MAX: 20,
  DEVICE_NAME_CHAR_MAX: 32,
  NOTIFY_CARDS_MAX: 256,
  NOTIFY_CARDS_EMAIL_MAX: 64,
  REDIRECT_COUNTDOWN: 5,
  PHOTO_SCALE_MIN: 1,
  PHOTO_SCALE_MAX: 2,
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
  // How many hours ahead(-n) or behind(+n) GMT/UTC
  // Note. the only method to get client's timezone is Date.prototype.getTimezoneOffset(),
  // it will return in minutes (e.g. -60 => +1) and its not constant because it doesn't count the daylight saving.
  TIMEZONE_OFFSET_MAP: {
    0: 'UTC',
    '-1': 'Europe/Amsterdam',
    '-2': 'Africa/Cairo',
    '-3': 'Asia/Qatar',
    '-4': 'Asia/Dubai',
    '-5': 'Indian/Kerguelen',
    '-6': 'Asia/Urumqi',
    '-7': 'Asia/Bangkok',
    '-8': 'Asia/Taipei',
    '-9': 'Asia/Seoul',
    '-10': 'Australia/Sydney',
    '-11': 'Pacific/Pohnpei',
    '-12': 'Pacific/Fiji',
    '-13': 'Pacific/Apia',
    '-14': 'Pacific/Kiritimati',
    '+1': 'Atlantic/Azores',
    '+2': 'America/Noronha',
    '+3': 'America/Cayenne',
    '+4': 'America/Dominica',
    '+5': 'America/Detroit',
    '+6': 'America/Chicago',
    '+7': 'America/Denver',
    '+8': 'America/Los_Angeles',
    '+9': 'Pacific/Gambier',
    '+10': 'Pacific/Tahiti',
    '+11': 'Pacific/Midway'
  }
};
