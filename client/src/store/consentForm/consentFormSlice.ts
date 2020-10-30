import i18n from '../../plugins/i18n'
import ConsentFormService from '../../services/ConsentFormService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import { ConsentFormInfo } from '../../data/types/ConsentForm'

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

export const fetchConsentForms = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const consentForms = await ConsentFormService.fetchConsentForms()
    dispatch(consentFormsFetched(consentForms))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchConsentFormsFailure') }))
  }

  dispatch(setLoading(false))
}
