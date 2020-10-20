import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {AVAILABLE_LANGUAGE_CODES} from '../core/constants';

window.languageResource = {};
let languageCode = window.currentLanguageCode;

switch (languageCode) {
  case 'es-es':
    require('../languages/es-es');
    break;
  case 'ja-jp':
    require('../languages/ja-jp');
    break;
  case 'zh-cn':
    require('../languages/zh-cn');
    break;
  case 'zh-tw':
    require('../languages/zh-tw');
    break;
  default:
    require('../languages/en-us');
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
    lng: languageCode,
    fallbackLng: 'en',
    lowerCaseLng: true, // all lowercase for third-part library / frontend / backend consistency
    nsSeparator: false, // disable separator ':'
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {escapeValue: false} // react already safes from xss
  });

export default i18n;
