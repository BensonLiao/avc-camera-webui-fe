import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
const SUPPORTED_LANGUAGE_CODES = require('webserver-form-schema/constants/i18n-supported-code');
const SUPPORTED_LANGUAGE_CODE_LIST = Object.keys(SUPPORTED_LANGUAGE_CODES);

window.languageResource = {};
const currentLanguageResource = require(`../languages/${window.currentLanguageCode}`);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: currentLanguageResource,
    lng: window.currentLanguageCode,
    fallbackLng: 'en',
    lowerCaseLng: true, // all lowercase for third-part library / frontend / backend consistency
    nsSeparator: false, // disable separator ':'
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {escapeValue: false}, // react already safes from xss
    supportedLangCodes: SUPPORTED_LANGUAGE_CODE_LIST, // we don't use `supportedLngs` option cause it inject unwanted `cimode`
    langCodesTitle: SUPPORTED_LANGUAGE_CODES // for UI display
  });

export default i18n;
