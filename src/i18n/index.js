import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
const SUPPORTED_LANGUAGE_CODES = require('webserver-form-schema/constants/i18n-supported-code');

window.languageResource = {};
// Assign resource to window.languageResource depends on current language code
switch (window.currentLanguageCode) {
  case SUPPORTED_LANGUAGE_CODES.es:
    require('../languages/es');
    break;
  case SUPPORTED_LANGUAGE_CODES['zh-tw']:
    require('../languages/zh-tw');
    break;
  case SUPPORTED_LANGUAGE_CODES['zh-cn']:
    require('../languages/zh-cn');
    break;
  case SUPPORTED_LANGUAGE_CODES.ja:
    require('../languages/ja');
    break;
  default:
    require('../languages/en');
    break;
}

// Generate translation resources from pre-defined list
const resources = SUPPORTED_LANGUAGE_CODES.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.code]: {translation: window.languageResource[cur.code]}
  };
}, {});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: window.currentLanguageCode,
    fallbackLng: 'en',
    lowerCaseLng: true, // all lowercase for third-part library / frontend / backend consistency
    nsSeparator: false, // disable separator ':'
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {escapeValue: false}, // react already safes from xss
    supportedLangCodes: SUPPORTED_LANGUAGE_CODES.map(locale => locale.code), // we don't use `supportedLngs` option cause it inject unwanted `cimode`
    langCodesTitle: SUPPORTED_LANGUAGE_CODES // for UI display
  });

export default i18n;
