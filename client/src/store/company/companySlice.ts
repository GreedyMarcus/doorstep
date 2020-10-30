import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo } from '../../data/types/Company'

type SliceState = {
  companies: CompanyInfo[]
}

const initialState: SliceState = {
  companies: []
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    companiesFetched: (state, { payload }: PayloadAction<CompanyInfo[]>) => {
      state.companies = payload
    }
  }
})

const { companiesFetched } = companySlice.actions

export const { reducer } = companySlice

export const fetchCompanies = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const companies = await CompanyService.fetchCompanies()
    dispatch(companiesFetched(companies))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompaniesFailure') }))
  }

  dispatch(setLoading(false))
}
