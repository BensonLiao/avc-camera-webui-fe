import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

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

// Capitalise country code, remove after updating backend AVC api string
languageCode = languageCode.substring(0, 3) + languageCode.substring(3, 5).toUpperCase();

// Translations
const resources = {
  'en-US': {translation: window.languageResource['en-us']},
  'zh-TW': {translation: window.languageResource['zh-tw']},
  'zh-CN': {translation: window.languageResource['zh-cn']},
  'ja-JP': {translation: window.languageResource['ja-jp']},
  'es-ES': {translation: window.languageResource['es-es']}
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: languageCode,
    fallbackLng: 'en',
    nsSeparator: false, // disable separator ':'
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {escapeValue: false} // react already safes from xss
  });

export default i18n;
