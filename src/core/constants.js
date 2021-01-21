const cldrLangCode = window.currentLanguageCode === 'zh-tw' ? 'zh-Hant' : window.currentLanguageCode || 'en';
const cldrTimeZoneData = require(`cldr-dates-full/main/${cldrLangCode}/timeZoneNames.json`);
const i18n = require('../i18n').default;
module.exports = {
  store: {
    CHANGE: 'STORE_CHANGE_',
    IS_API_PROCESSING: '$isApiProcessing',
    EXPIRES: '$expires',
    EXPIRES_TIMER: '$expiresTimer',
    UPDATE_FOCAL_LENGTH_FIELD: '$updateFocalLengthField',
    IS_NOT_CALL_UNLOAD_ALERT: '$isNotCallUnloadAlert'
  },
  MEMBERS_PAGE_GROUPS_MAX: 32,
  SECURITY_USERS_MAX: 20,
  NOTIFY_CARDS_MAX: 256,
  NOTIFY_CARDS_EMAIL_MAX: 64,
  REDIRECT_COUNTDOWN: 5,
  MEMBER_PHOTO_SCALE_STEP: 0.1,
  MEMBER_PHOTO_SCALE_MIN: 1,
  MEMBER_PHOTO_SCALE_MAX: 2,
  MEMBER_PHOTO_MIME_TYPE: 'image/jpeg',
  NODE_SERVER_RESTART_DELAY_MS: 10 * 1000,
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
    '6669', // Alternate IRC [Apple addition]
    '12728' // Postman
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
    i18n.t('sdCard.basic.constants.Functioning'),
    // 1 - UNMOUNTED: 外部儲存體存在但未被掛載
    i18n.t('sdCard.basic.constants.Unmounted'),
    // 2 - SDCARDNOTEXIST: 外部儲存體不存在
    i18n.t('sdCard.basic.constants.Empty Slot'),
    // 3 - ABNORMAL: 外部儲存體異常
    i18n.t('sdCard.basic.constants.Nonfunctioning'),
    // 4 - READONLY: 外部儲存體存在但只能進行讀取
    i18n.t('sdCard.basic.constants.Read-only Access'),
    // 5 - UNKNOWN: Unknown storage state, such as when a path isn't backed by known storage media.
    i18n.t('sdCard.basic.constants.Unknown Error')
  ],
  TIMEZONE_LIST: (() => require('@vvo/tzdb')
    .getTimeZones()
    .map(zone => {
      // Sync between @vvo/tzdb and cldr's data
      let zoneAltNameKey = zone.alternativeName
        .replace(/( Time|St. )/g, '')
        .replace(/( &? ?|-)/g, '_')
        .replace(/(_Island)s?/, '')
        .replace(/(Line)/, 'Line_Islands')
        .replace(/(Gilbert)/, 'Gilbert_Islands')
        .replace(/(Marshall)/, 'Marshall_Islands')
        .replace(/(Phoenix)/, 'Phoenix_Islands');

      switch (zoneAltNameKey) {
        case 'Mountain':
          zoneAltNameKey = 'America_Mountain';
          break;
        case 'Central':
          zoneAltNameKey = 'America_Central';
          break;
        case 'Eastern':
          zoneAltNameKey = 'America_Eastern';
          break;
        case 'Pacific':
          zoneAltNameKey = 'America_Pacific';
          break;
        case 'Mexican_Pacific':
          zoneAltNameKey = 'Mexico_Pacific';
          break;
        case 'West_Greenland':
          zoneAltNameKey = 'Greenland_Western';
          break;
        case 'East_Greenland':
          zoneAltNameKey = 'Greenland_Eastern';
          break;
        case 'Greenwich_Mean':
          zoneAltNameKey = 'GMT';
          break;
        case 'Western_European':
          zoneAltNameKey = 'Europe_Western';
          break;
        case 'Central_European':
          zoneAltNameKey = 'Europe_Central';
          break;
        case 'Eastern_European':
          zoneAltNameKey = 'Europe_Eastern';
          break;
        case 'West_Africa':
          zoneAltNameKey = 'Africa_Western';
          break;
        case 'Central_Africa':
          zoneAltNameKey = 'Africa_Central';
          break;
        case 'South_Africa':
          zoneAltNameKey = 'Africa_Southern';
          break;
        case 'East_Africa':
          zoneAltNameKey = 'Africa_Eastern';
          break;
        case 'Western_Indonesia':
          zoneAltNameKey = 'Indonesia_Western';
          break;
        case 'Central_Indonesia':
          zoneAltNameKey = 'Indonesia_Central';
          break;
        case 'Eastern_Indonesia':
          zoneAltNameKey = 'Indonesia_Eastern';
          break;
        case 'Australian_Western':
          zoneAltNameKey = 'Australia_Western';
          break;
        case 'Australian_Central':
          zoneAltNameKey = 'Australia_Central';
          break;
        case 'Australian_Eastern':
          zoneAltNameKey = 'Australia_Eastern';
          break;
        case 'Australian_Central_Western':
          zoneAltNameKey = 'Australia_CentralWestern';
          break;
        case 'French_Southern_Antarctic':
          zoneAltNameKey = 'French_Southern';
          break;
        case 'West_Kazakhstan':
          zoneAltNameKey = 'Kazakhstan_Western';
          break;
        case 'East_Kazakhstan':
          zoneAltNameKey = 'Kazakhstan_Eastern';
          break;
        case 'Fernando_de_Noronha':
          zoneAltNameKey = 'Noronha';
          break;
        case 'Turkey':
          // cldr has no data and we label it as empty name like MacOS (Win10 doesn't even have this option)
          zone.alternativeName = '';
          break;
        case 'Réunion':
          zoneAltNameKey = 'Reunion';
          break;
        case 'Kyrgyzstan':
          zoneAltNameKey = 'Kyrgystan';
          break;
        case 'Brunei_Darussalam':
          zoneAltNameKey = 'Brunei';
          break;
        case 'Philippine':
          zoneAltNameKey = 'Philippines';
          break;
        case 'Ulaanbaatar':
          zoneAltNameKey = 'Mongolia';
          break;
        case 'Korean':
          zoneAltNameKey = 'Korea';
          break;
        case 'Chuuk':
          zoneAltNameKey = 'Truk';
          break;
        case 'Dumont_d’Urville':
          zoneAltNameKey = 'DumontDUrville';
          break;
        case 'Bougainville':
          // cldr has no data and we label it as empty name like MacOS (Win10 doesn't even have this option)
          zone.alternativeName = '';
          break;
        case 'Gilbert':
          zoneAltNameKey = 'Kazakhstan_Eastern';
          break;
        case 'Petropavlovsk_Kamchatski':
          zoneAltNameKey = 'Kamchatka';
          break;
        case 'Wallis_Futuna':
          zoneAltNameKey = 'Wallis';
          break;
        default:
          break;
      }

      const i18nZoneName = cldrTimeZoneData.main[cldrLangCode].dates.timeZoneNames.metazone[zoneAltNameKey];

      const tzContinent = zone.name.substring(0, zone.name.indexOf('/'));
      let tzCountry = zone.name.substring(zone.name.lastIndexOf('/') + 1, zone.name.length);
      switch (tzCountry) {
        case 'Atikokan':
          tzCountry = 'Coral_Harbour';
          break;
        case 'Faroe':
          tzCountry = 'Faeroe';
          break;
        case 'Asmara':
          tzCountry = 'Asmera';
          break;
        case 'Kolkata':
          tzCountry = 'Calcutta';
          break;
        case 'Kathmandu':
          tzCountry = 'Katmandu';
          break;
        case 'Yangon':
          tzCountry = 'Rangoon';
          break;
        case 'Ho_Chi_Minh':
          tzCountry = 'Saigon';
          break;
        case 'Chuuk':
          tzCountry = 'Truk';
          break;
        default:
          break;
      }

      const i18nZoneNameLabel = i18nZoneName ? i18nZoneName.long.standard + ' - ' : zone.alternativeName;

      const i18nCityNameLabel = cldrTimeZoneData.main[cldrLangCode].dates.timeZoneNames.zone[tzContinent][tzCountry].exemplarCity;

      const utcOffsetLabel = zone.rawFormat.substring(0, zone.rawFormat.indexOf(' '));
      return {
        ...zone,
        label: `UTC${utcOffsetLabel} ${i18nZoneNameLabel}${i18nCityNameLabel}`
      };
    })
    .sort((a, b) => {
      if (a.rawFormat[0] === '-') {
        return b.rawFormat.localeCompare(a.rawFormat);
      }

      return a.rawFormat.localeCompare(b.rawFormat);
    })
  )(),
  VMS_CAMERA_LINK: 'cameralink',
  // eslint-disable-next-line max-len
  PRECISE_EMAIL_PATTERN: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  SDCARD_STORAGE_DATE_FORMAT: {
    DISPLAY: 'MM/DD/YYYY',
    API: 'YYYY-MM-DD'
  },
  MEMBER_PAGES: {
    MEMBERS: 'members',
    DATABASE: 'database',
    SYNC: 'sync'
  },
  ITEMS_PER_PAGE: 10,
  MAX_DEVICES: 128,
  MAX_SELECTED_DEVICES: 16
};
