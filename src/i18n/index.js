import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
// Must use commonjs way for the following dynamic language resource import
const SUPPORTED_LANGUAGE_CODES = require('./supported-codes');

window.languageResource = {};
// Assign resource to window.languageResource depends on current language code
switch (window.currentLanguageCode) {
  case SUPPORTED_LANGUAGE_CODES[4]:
    require(`../languages/${SUPPORTED_LANGUAGE_CODES[4]}`);
    break;
  case SUPPORTED_LANGUAGE_CODES[3]:
    require(`../languages/${SUPPORTED_LANGUAGE_CODES[3]}`);
    break;
  case SUPPORTED_LANGUAGE_CODES[2]:
    require(`../languages/${SUPPORTED_LANGUAGE_CODES[2]}`);
    break;
  case SUPPORTED_LANGUAGE_CODES[1]:
    require(`../languages/${SUPPORTED_LANGUAGE_CODES[1]}`);
    break;
  default:
    require(`../languages/${SUPPORTED_LANGUAGE_CODES[0]}`);
    break;
}

// Generate translation resources from pre-defined list
const resources = SUPPORTED_LANGUAGE_CODES.reduce((acc, cur) => {
  return {
    ...acc,
    [cur]: {translation: window.languageResource[cur]}
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
    interpolation: {escapeValue: false} // react already safes from xss
  });

export default i18n;
