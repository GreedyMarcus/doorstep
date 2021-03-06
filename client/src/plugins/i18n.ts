import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import translationHun from '../data/locales/hu/translation.json'
import translationEng from '../data/locales/en/translation.json'
import { initReactI18next } from 'react-i18next'

/**
 * Localization configuration object.
 */
const i18nConfig = {
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
}

i18n.use(XHR).use(initReactI18next).init(i18nConfig)

export default i18n
