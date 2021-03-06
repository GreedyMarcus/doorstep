import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo, CompanyRegister, CompanyUpdate, CompanyConfig, EmployeeInfo } from '../../data/types/Company'
import { UserRegister, UserUpdate, GuestUserRegister } from '../../data/types/User'

type CompanySliceState = {
  companies: CompanyInfo[] | null
  businessHosts: EmployeeInfo[]
  activeCompanyConfig: CompanyConfig | null
  availableGuestUsers: GuestUserRegister[]
}

const initialState: CompanySliceState = {
  companies: null,
  businessHosts: [],
  activeCompanyConfig: null,
  availableGuestUsers: []
}

/**
 * Represents a store slice that manages company related data.
 */
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    companiesFetched: (state, { payload }: PayloadAction<CompanyInfo[]>) => {
      state.companies = payload
    },
    companyRegistered: (state, { payload }: PayloadAction<CompanyInfo>) => {
      if (state.companies) {
        state.companies.push(payload)
      }
    },
    companyUpdated: (state, { payload }: PayloadAction<CompanyInfo>) => {
      if (state.companies) {
        const index = state.companies.findIndex(company => company.id === payload.id)
        state.companies[index] = payload
      }
    },
    businessHostsFetched: (state, { payload }: PayloadAction<EmployeeInfo[]>) => {
      state.businessHosts = payload
    },
    businessHostCreated: (state, { payload }: PayloadAction<EmployeeInfo>) => {
      if (state.businessHosts) {
        state.businessHosts.push(payload)
      }
    },
    businessHostUpdated: (state, { payload }: PayloadAction<EmployeeInfo>) => {
      if (state.businessHosts) {
        const index = state.businessHosts.findIndex(host => host.id === payload.id)
        state.businessHosts[index] = payload
      }
    },
    companyConfigFetched: (state, { payload }: PayloadAction<CompanyConfig>) => {
      state.activeCompanyConfig = payload
    },
    availableGuestUsersFetched: (state, { payload }: PayloadAction<GuestUserRegister[]>) => {
      state.availableGuestUsers = payload
    },
    companySliceCleared: state => {
      state.companies = null
      state.businessHosts = []
      state.activeCompanyConfig = null
      state.availableGuestUsers = []
    }
  }
})

export const { reducer } = companySlice
export const { companySliceCleared } = companySlice.actions
const {
  companiesFetched,
  companyRegistered,
  companyUpdated,
  businessHostsFetched,
  businessHostCreated,
  businessHostUpdated,
  companyConfigFetched,
  availableGuestUsersFetched
} = companySlice.actions

/**
 * Calls office building service to load companies.
 */
export const fetchCompanies = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const companies = await OfficeBuildingService.getCompaniesInBuilding(buildingId)

    dispatch(companiesFetched(companies))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompanies.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls office building service to register a new company.
 */
export const registerCompany = (company: CompanyRegister) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const registeredCompany = await OfficeBuildingService.registerCompanyInBuilding(buildingId, company)

    dispatch(companyRegistered(registeredCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.registerCompany.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerCompany.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to update the specified company.
 */
export const updateCompany = (company: CompanyUpdate) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const updatedCompany = await CompanyService.updateCompany(company.id, company)

    dispatch(companyUpdated(updatedCompany))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompany.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompany.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to load company business hosts.
 */
export const fetchBusinessHosts = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const businessHosts = await CompanyService.getBusinessHosts(companyId)

    dispatch(businessHostsFetched(businessHosts))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchBusinessHosts.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to create a new business host for the current company.
 */
export const createBusinessHost = (data: UserRegister) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const businessHost = await CompanyService.createBusinessHost(companyId, data)

    dispatch(businessHostCreated(businessHost))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createBusinessHost.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createBusinessHost.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to update the specified company business host.
 */
export const updateBusinessHost = (host: UserUpdate) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const updatedBusinessHost = await CompanyService.updateBusinessHost(companyId, host.id, host)

    dispatch(businessHostUpdated(updatedBusinessHost))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateBusinessHost.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateBusinessHost.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to load company register config.
 */
export const fetchCompanyConfig = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const companyConfig = await CompanyService.getCompanyConfig(companyId)

    dispatch(companyConfigFetched(companyConfig))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompanyConfig.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to update the spcified company register config.
 */
export const updateCompanyConfig = (data: CompanyConfig) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    await CompanyService.updateCompanyConfig(companyId, data)

    dispatch(companyConfigFetched(data))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompanyConfig.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompanyConfig.failure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to load company register config.
 */
export const fetchAvailableGuestUsers = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const guestUsers = await CompanyService.getAvailableGuestUsers(companyId)

    dispatch(availableGuestUsersFetched(guestUsers))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchAvailableGuestUsers.failure') }))
  }

  dispatch(setLoading(false))
}
