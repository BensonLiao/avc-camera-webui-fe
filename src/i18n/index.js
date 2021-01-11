import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import merge from 'lodash.merge';
const SUPPORTED_LANGUAGE_CODES = require('webserver-form-schema/constants/i18n-supported-code');
const oldLanguageResource = require(`../languages/${window.currentLanguageCode}_old.json`);
const currentLanguageResource = require(`../languages/${window.currentLanguageCode}.json`);

const resource = {[window.currentLanguageCode]: {translation: merge(oldLanguageResource, currentLanguageResource)}};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: resource,
    lng: window.currentLanguageCode,
    fallbackLng: 'en',
    lowerCaseLng: true, // all lowercase for third-part library / frontend / backend consistency
    nsSeparator: false, // disable separator ':'
    interpolation: {escapeValue: false}, // react already safes from xss
    supportedLangCodes: Object.keys(SUPPORTED_LANGUAGE_CODES), // we don't use `supportedLngs` option cause it inject unwanted `cimode`
    langCodesTitle: SUPPORTED_LANGUAGE_CODES, // for UI display
    returnEmptyString: false // Disallow empty strings; show key for empty strings instead
  });

export default i18n;
