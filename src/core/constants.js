module.exports = {
  store: {
    CHANGE: 'STORE_CHANGE_',
    IS_API_PROCESSING: '$isApiProcessing'
  },
  AVAILABLE_LANGUAGE_CODES: ['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es'],
  MEMBERS_PAGE_GROUPS_MAX: 32,
  SECURITY_USERS_MAX: 20,
  DEVICE_NAME_CHAR_MAX: 32,
  NOTIFY_CARDS_MAX: 32,
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
    '6000', // X11
    '6665', // Alternate IRC [Apple addition]
    '6666', // Alternate IRC [Apple addition]
    '6667', // Standard IRC [Apple addition]
    '6668', // Alternate IRC [Apple addition]
    '6669' // Alternate IRC [Apple addition]
  ],
  SD_STATUS_LIST: [ // Order is important!
    'MEDIA_UNMOUNTED', // 0 - MEDIA_UNMOUNTED: 外部儲存體存在但未被掛載
    'MEDIA_MOUNTED', // 1 - MEDIA_MOUNTED: 外部儲存體存在且可以進行讀取與寫入
    'MEDIA_BAD_REMOVAL', // 2- MEDIA_BAD_REMOVAL: 外部儲存體在正常卸載之前就被拔除
    'MEDIA_CHECKING', // 3 - MEDIA_CHECKING: 外部儲存體存在且正在進行磁碟檢查
    'MEDIA_MOUNTED_READ_ONLY', // 4 - MEDIA_MOUNTED_READ_ONLY: 外部儲存體存在但只能進行讀取
    'MEDIA_NOFS', // 5 - MEDIA_NOFS: 外部儲存體存在，但內容是空的或是 Android 不支援該檔案系統
    'MEDIA_REMOVED', // 6 - MEDIA_REMOVED: 外部儲存體不存在
    'MEDIA_SHARED', // 7 - MEDIA_SHARED: 外部儲存體存在但未被掛載，且為 USB 的裝置
    'MEDIA_UNMOUNTABLE', // 8 - MEDIA_UNMOUNTABLE: 外部儲存體存在但不能被掛載
    'MEDIA_EJECTING', // 9 - MEDIA_EJECTING: Storage state if the media is in the process of being ejected.
    'MEDIA_UNKNOWN' // 10 - MEDIA_UNKNOWN: Unknown storage state, such as when a path isn't backed by known storage media.
  ]
};
