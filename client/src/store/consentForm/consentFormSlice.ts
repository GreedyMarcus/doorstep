import i18n from '../../plugins/i18n'
import ConsentFormService from '../../services/ConsentFormService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { UserRole } from '../../data/enums/UserRole'
import { ConsentFormType } from '../../data/enums/ConsentFormType'
import { ConsentFormInfo, ConsentFormCreate, ConsentFormDetails, ConsentFormVersionInfo } from '../../data/types/ConsentForm'

type ConsentFormSliceState = {
  consentForms: ConsentFormInfo[]
  activeConsentForm: ConsentFormDetails | null
}

const initialState: ConsentFormSliceState = {
  consentForms: [],
  activeConsentForm: null
}

const consentFormSlice = createSlice({
  name: 'consentForm',
  initialState,
  reducers: {
    consentFormsFetched: (state, { payload }: PayloadAction<ConsentFormInfo[]>) => {
      state.consentForms = payload
    },
    consentFormCreated: (state, { payload }: PayloadAction<ConsentFormInfo>) => {
      state.consentForms.push(payload)
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
    }
  }
})

export const { reducer } = consentFormSlice
const {
  consentFormsFetched,
  consentFormCreated,
  singleConsentFormFetched,
  consentFormVersionCreated,
  consentFormVersionUpdated,
  consentFormVersionActivated
} = consentFormSlice.actions

export const fetchConsentForms = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const consentForms = await OfficeBuildingService.getGlobalConsentForms(buildingId)

    dispatch(consentFormsFetched(consentForms))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormsFailure') }))
  }

  dispatch(setLoading(false))
}

export const fetchConsentFormById = (consentFormId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const consentFormType = user.activeUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const consentForm = await ConsentFormService.getConsentFormById(consentFormId, consentFormType)

    dispatch(singleConsentFormFetched(consentForm))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormByIdFailure') }))
  }

  dispatch(setLoading(false))
}

export const createGlobalConsentForm = (data: ConsentFormCreate) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const createdConsentForm = await OfficeBuildingService.createGlobalConsentform(buildingId, data)

    dispatch(consentFormCreated(createdConsentForm))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createConsentFormSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createConsentFormFailure') }))
  }

  dispatch(setLoading(false))
}

export const createGlobalConsentFormVersion = (content: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { consentForm } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    const createdVersion = await ConsentFormService.createConsentFormVersion(formId, ConsentFormType.GLOBAL, content)

    dispatch(consentFormVersionCreated(createdVersion))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createGlobalConsentFormVersionSuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createGlobalConsentFormVersionFailure') }))
  }

  dispatch(setLoading(false))
}

export const updateGlobalConsentFormVersion = (versionId: number, content: string) => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { consentForm } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    const updatedVersion = await ConsentFormService.updateConsentFormVersion(formId, versionId, ConsentFormType.GLOBAL, content)

    dispatch(consentFormVersionUpdated(updatedVersion))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateGlobalConsentFormVersionSuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateGlobalConsentFormVersionFailure') }))
  }

  dispatch(setLoading(false))
}

export const activateGlobalConsentFormVersion = (versionId: number) => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { consentForm } = getState()

  dispatch(setLoading(true))

  try {
    const formId = consentForm.activeConsentForm?.id ?? -1
    await ConsentFormService.activateGlobalConsentFormVersion(formId, ConsentFormType.GLOBAL, versionId)

    dispatch(consentFormVersionActivated(versionId))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.activateGlobalConsentFormVersionSuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.activateGlobalConsentFormVersionFailure') }))
  }

  dispatch(setLoading(false))
}
