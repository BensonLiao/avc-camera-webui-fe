import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
const {AVAILABLE_LANGUAGE_CODES} = require('../core/constants');

window.languageResource = {};
// Assign resource to window.languageResource depends on current language code
switch (window.currentLanguageCode) {
  case AVAILABLE_LANGUAGE_CODES[4]:
    require(`../languages/${AVAILABLE_LANGUAGE_CODES[4]}`);
    break;
  case AVAILABLE_LANGUAGE_CODES[3]:
    require(`../languages/${AVAILABLE_LANGUAGE_CODES[3]}`);
    break;
  case AVAILABLE_LANGUAGE_CODES[2]:
    require(`../languages/${AVAILABLE_LANGUAGE_CODES[2]}`);
    break;
  case AVAILABLE_LANGUAGE_CODES[1]:
    require(`../languages/${AVAILABLE_LANGUAGE_CODES[1]}`);
    break;
  default:
    require(`../languages/${AVAILABLE_LANGUAGE_CODES[0]}`);
    break;
}

// Generate translation resources from pre-defined list
const resources = AVAILABLE_LANGUAGE_CODES.reduce((acc, cur) => {
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
