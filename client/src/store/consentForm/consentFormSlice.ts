import i18n from '../../plugins/i18n'
import ConsentFormService from '../../services/ConsentFormService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { ConsentFormInfo, ConsentFormCreate, ConsentFormDetails } from '../../data/types/ConsentForm'
import { ConsentFormType } from '../../data/enums/ConsentFormType'
import { UserRole } from '../../data/enums/UserRole'

type SliceState = {
  consentForms: ConsentFormInfo[]
  activeConsentForm: ConsentFormDetails | null
}

const initialState: SliceState = {
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
    }
  }
})

const { consentFormsFetched, consentFormCreated, singleConsentFormFetched } = consentFormSlice.actions

export const { reducer } = consentFormSlice

export const fetchConsentForms = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const consentFormType = user.currentUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const consentForms = await ConsentFormService.fetchConsentForms(consentFormType)
    dispatch(consentFormsFetched(consentForms))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormsFailure') }))
  }

  dispatch(setLoading(false))
}

export const fetchConsentFormById = (consentFormId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const consentFormType = user.currentUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL : ConsentFormType.LOCAL
    const consentForm = await ConsentFormService.fetchConsentFormById(consentFormId, consentFormType)
    dispatch(singleConsentFormFetched(consentForm))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormByIdFailure') }))
  }

  dispatch(setLoading(false))
}

export const createGlobalConsentForm = (consentFormData: ConsentFormCreate) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const createdConsentForm = await ConsentFormService.createGlobalConsentForm(consentFormData)
    dispatch(consentFormCreated(createdConsentForm))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createConsentFormSuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createConsentFormFailure') }))
  }

  dispatch(setLoading(false))
}
