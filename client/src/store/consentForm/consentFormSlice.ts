import i18n from '../../plugins/i18n'
import ConsentFormService from '../../services/ConsentFormService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { UserRole } from '../../data/enums/UserRole'
import { ConsentFormType } from '../../data/enums/ConsentFormType'
import { ConsentFormInfo, ConsentFormCreate, ConsentFormDetails, ConsentFormVersionInfo } from '../../data/types/ConsentForm'

type ConsentFormSliceState = {
  consentForms: ConsentFormInfo[] | null
  activeConsentForm: ConsentFormDetails | null
}

const initialState: ConsentFormSliceState = {
  consentForms: null,
  activeConsentForm: null
}

/**
 * Represents a store slice that manages consent form related data.
 */
const consentFormSlice = createSlice({
  name: 'consentForm',
  initialState,
  reducers: {
    consentFormsFetched: (state, { payload }: PayloadAction<ConsentFormInfo[]>) => {
      state.consentForms = payload
    },
    consentFormCreated: (state, { payload }: PayloadAction<ConsentFormInfo>) => {
      if (state.consentForms) {
        state.consentForms.push(payload)
      }
    },
    singleConsentFormFetched: (state, { payload }: PayloadAction<ConsentFormDetails>) => {
      state.activeConsentForm = payload
    },
    consentFormVersionCreated: (state, { payload }: PayloadAction<ConsentFormVersionInfo>) => {
      if (state.activeConsentForm) {
        state.activeConsentForm.versions.push(payload)
      }
    },
    consentFormVersionUpdated: (state, { payload }: PayloadAction<ConsentFormVersionInfo>) => {
      if (state.activeConsentForm) {
        const versionIndex = state.activeConsentForm.versions.findIndex(version => version.id === payload.id)
        state.activeConsentForm.versions[versionIndex] = payload
      }
    },
    consentFormVersionActivated: (state, { payload }: PayloadAction<number>) => {
      if (state.activeConsentForm) {
        const activatedIndex = state.activeConsentForm.versions.findIndex(version => version.id === payload)
        state.activeConsentForm.activeVersion = state.activeConsentForm.versions[activatedIndex]
      }
    },
    consentFormSliceCleared: state => {
      state.consentForms = null
      state.activeConsentForm = null
    }
  }
})

export const { reducer } = consentFormSlice
export const { consentFormSliceCleared } = consentFormSlice.actions
const {
  consentFormsFetched,
  consentFormCreated,
  singleConsentFormFetched,
  consentFormVersionCreated,
  consentFormVersionUpdated,
  consentFormVersionActivated
} = consentFormSlice.actions

/**
 * Calls either office building or company service to load global or local consent forms.
 */
export const fetchConsentForms = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    // Fetch global consent forms
    if (user.activeUser?.role === UserRole.ADMIN) {
      const buildingId = user.activeUser?.buildingId ?? -1
      const globalConsentForms = await OfficeBuildingService.getConsentForms(buildingId)

      dispatch(consentFormsFetched(globalConsentForms))
    }

    // Fetch local consent forms
    if (user.activeUser?.role === UserRole.COMPANY_ADMIN) {
      const companyId = user.activeUser?.companyId ?? -1
      const localConsentForms = await CompanyService.getConsentForms(companyId)

      dispatch(consentFormsFetched(localConsentForms))
    }
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentForms.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls consent form service to load global or local consent forms depends on the role of the current user.
 */
export const fetchConsentFormById = (consentFormId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const consentFormType = user.activeUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const consentForm = await ConsentFormService.getConsentFormById(consentFormId, consentFormType)

    dispatch(singleConsentFormFetched(consentForm))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormById.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls either office building or company service to create global or local consent form.
 */
export const createConsentForm = (data: ConsentFormCreate) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    // Create global consent form
    if (user.activeUser?.role === UserRole.ADMIN) {
      const buildingId = user.activeUser?.buildingId ?? -1
      const createdGlobalConsentForm = await OfficeBuildingService.createConsentForm(buildingId, data)

      dispatch(consentFormCreated(createdGlobalConsentForm))
    }

    // Create local consent form
    if (user.activeUser?.role === UserRole.COMPANY_ADMIN) {
      const companyId = user.activeUser?.companyId ?? -1
      const createdLocalConsentForm = await CompanyService.createConsentForm(companyId, data)

      dispatch(consentFormCreated(createdLocalConsentForm))
    }

    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createConsentForm.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createConsentForm.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls consent form service to create global or local consent forms depends on the role of the current user.
 */
export const createConsentFormVersion = (content: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { consentForm, user } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    const consentFormType = user.activeUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const createdVersion = await ConsentFormService.createConsentFormVersion(formId, consentFormType, content)

    dispatch(consentFormVersionCreated(createdVersion))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createConsentFormVersion.success') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createConsentFormVersion.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls consent form service to update the specified consent form version.
 */
export const updateConsentFormVersion = (versionId: number, content: string) => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { consentForm, user } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    const consentFormType = user.activeUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const updatedVersion = await ConsentFormService.updateConsentFormVersion(formId, versionId, consentFormType, content)

    dispatch(consentFormVersionUpdated(updatedVersion))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateConsentFormVersion.success') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateConsentFormVersion.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls consent form service to activate the specified consent form version.
 */
export const activateConsentFormVersion = (versionId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { consentForm, user } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    const consentFormType = user.activeUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    await ConsentFormService.activateConsentFormVersion(formId, consentFormType, versionId)

    dispatch(consentFormVersionActivated(versionId))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.activateConsentFormVersion.success') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.activateConsentFormVersion.failure') }))
  }

  dispatch(setLoading(false))
}
