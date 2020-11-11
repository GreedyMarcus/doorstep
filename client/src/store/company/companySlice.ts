import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo, CompanyRegister, CompanyUpdate } from '../../data/types/Company'
import { BusinessHostInfo } from '../../data/types/User'

type CompanySliceState = {
  companies: CompanyInfo[]
  businessHosts: BusinessHostInfo[]
}

const initialState: CompanySliceState = {
  companies: [],
  businessHosts: []
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
    },
    businessHostsFetched: (state, { payload }: PayloadAction<BusinessHostInfo[]>) => {
      state.businessHosts = payload
    },
    companySliceCleared: (state) => {
      state.companies = [],
      state.businessHosts=  []
    }
  }
})

export const { reducer } = companySlice
export const { companySliceCleared } = companySlice.actions
const { companiesFetched, companyRegistered, companyUpdated, businessHostsFetched } = companySlice.actions

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

export const fetchBusinessHosts = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const businessHosts = await CompanyService.getBusinessHosts(companyId)

    dispatch(businessHostsFetched(businessHosts))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchBusinessHostsFailure') }))
  }

  dispatch(setLoading(false))
}
