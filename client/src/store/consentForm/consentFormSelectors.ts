import { RootState } from '../index'

/**
 * Returns all global or local consent forms depends on the role of the current user.
 */
export const consentFormsSelector = (state: RootState) => state.consentForm.consentForms

/**
 * Returns the selected consent form.
 */
export const activeConsentFormSelector = (state: RootState) => state.consentForm.activeConsentForm
