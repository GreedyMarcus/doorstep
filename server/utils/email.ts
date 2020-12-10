import { VisitPurpose } from '../data/enums/VisitPurpose'

/**
 * Localized email subjects.
 */
export const localizedSubjects = {
  passwordReset: {
    en: 'Doorstep reset password',
    hu: 'Doorstep jelszó visszaállítás'
  },
  visitNotification: {
    en: 'Doorstep visit notification',
    hu: 'Doorstep értesítés látogatásról'
  }
}

/**
 * Localized email visit purposes.
 */
export const localizedVisitPurpose = {
  [VisitPurpose.MEETING]: {
    en: 'Meeting',
    hu: 'Találkozó'
  },
  [VisitPurpose.INTERVIEW]: {
    en: 'Interview',
    hu: 'Interjú'
  }
}
