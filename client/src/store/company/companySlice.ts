import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo, CompanyRegister, CompanyUpdate } from '../../data/types/Company'

type CompanySliceState = {
  companies: CompanyInfo[]
}

const initialState: CompanySliceState = {
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

export const { reducer } = companySlice
const { companiesFetched, companyRegistered, companyUpdated } = companySlice.actions

export const fetchCompanies = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const companies = await OfficeBuildingService.getCompaniesInBuilding(buildingId)

    dispatch(companiesFetched(companies))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompaniesFailure') }))
  }

  dispatch(setLoading(false))
}

export const registerCompany = (company: CompanyRegister) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const registeredCompany = await OfficeBuildingService.registerCompanyInBuilding(buildingId, company)

    dispatch(companyRegistered(registeredCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.registerCompanySuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerCompanyFailure') }))
  }

  dispatch(setLoading(false))
}

export const editCompany = (company: CompanyUpdate) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const updatedCompany = await CompanyService.updateCompany(company.id, company)

    dispatch(companyUpdated(updatedCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompanySuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompanyFailure') }))
  }

  dispatch(setLoading(false))
}
