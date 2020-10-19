import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import translationHun from '../locales/hu/translation.json'
import translationEng from '../locales/en/translation.json'
import { initReactI18next } from 'react-i18next'

i18n
  .use(XHR)
  .use(initReactI18next)
  .init({
    lng: 'hu',
    interpolation: {
      escapeValue: false
    },
    resources: {
      hu: {
        translations: translationHun
      },
      en: {
        translations: translationEng
      }
    },
    defaultNS: 'translations'
  })

export default i18n
