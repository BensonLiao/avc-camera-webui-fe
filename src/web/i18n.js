import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
require('../languages/en-us');
require('../languages/zh-tw');

let languageCode = window.currentLanguageCode;
languageCode = languageCode.substring(0, 3) + languageCode.substring(3, 5).toUpperCase();

// the translations
const resources = {
  'en-US': {translation: window.languageResource['en-us']},
  'zh-TW': {translation: window.languageResource['zh-tw']}
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
