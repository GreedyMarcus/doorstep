import i18n from '../../plugins/i18n'
import ConsentFormService from '../../services/ConsentFormService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { ConsentFormInfo } from '../../data/types/ConsentForm'
import { ConsentFormType } from '../../data/enums/ConsentFormType'
import { UserRole } from '../../data/enums/UserRole'

type SliceState = {
  consentForms: ConsentFormInfo[]
}

const initialState: SliceState = {
  consentForms: []
}

const consentFormSlice = createSlice({
  name: 'consentForm',
  initialState,
  reducers: {
    consentFormsFetched: (state, { payload }: PayloadAction<ConsentFormInfo[]>) => {
      state.consentForms = payload
    }
  }
})

const { consentFormsFetched } = consentFormSlice.actions

export const { reducer } = consentFormSlice

export const fetchConsentForms = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()
  
  dispatch(setLoading(true))

  try {
    const consentFormType = user.currentUser?.role === UserRole.ADMIN ? ConsentFormType.GLOBAL :ConsentFormType.LOCAL
    const consentForms = await ConsentFormService.fetchConsentForms(consentFormType)
    dispatch(consentFormsFetched(consentForms))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormsFailure') }))
  }

  dispatch(setLoading(false))
}
