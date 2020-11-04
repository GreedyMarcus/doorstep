import { RootState } from '../index'

export const consentFormsSelector = (state: RootState) => state.consentForm.consentForms
export const activeConsentFormSelector = (state: RootState) => state.consentForm.activeConsentForm
