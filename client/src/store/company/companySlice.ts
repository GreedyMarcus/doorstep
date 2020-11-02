import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo, RegisterCompanyDetails } from '../../data/types/Company'

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
    },
    companyRegistered: (state, { payload }: PayloadAction<CompanyInfo>) => {
      state.companies.push(payload)
    },
    companyUpdated: (state, { payload }: PayloadAction<CompanyInfo>) => {
      const index = state.companies.findIndex(company => company.id === payload.id)
      state.companies[index] = payload
    }
  }
})

const { companiesFetched, companyRegistered, companyUpdated } = companySlice.actions

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

export const registerCompany = (company: RegisterCompanyDetails) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const registeredCompany = await CompanyService.registerCompany(company)
    dispatch(companyRegistered(registeredCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.registerCompanySuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerCompanyFailure') }))
  }

  dispatch(setLoading(false))
}

export const editCompany = (company: RegisterCompanyDetails) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const updatedCompany = await CompanyService.updateCompany(company)
    dispatch(companyUpdated(updatedCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompanySuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompanyFailure') }))
  }

  dispatch(setLoading(false))
}
