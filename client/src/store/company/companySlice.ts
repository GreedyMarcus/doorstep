import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { CompanyInfo, CompanyRegister, CompanyUpdate, CompanyConfig } from '../../data/types/Company'
import { BusinessHostInfo, UserRegister, UserUpdate, GuestUserRegister } from '../../data/types/User'

type CompanySliceState = {
  companies: CompanyInfo[]
  businessHosts: BusinessHostInfo[]
  activeCompanyConfig: CompanyConfig | null
  availableGuestUsers: GuestUserRegister[]
}

const initialState: CompanySliceState = {
  companies: [],
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
      state.companies.push(payload)
    },
    companyUpdated: (state, { payload }: PayloadAction<CompanyInfo>) => {
      const index = state.companies.findIndex(company => company.id === payload.id)
      state.companies[index] = payload
    },
    businessHostsFetched: (state, { payload }: PayloadAction<BusinessHostInfo[]>) => {
      state.businessHosts = payload
    },
    businessHostCreated: (state, { payload }: PayloadAction<BusinessHostInfo>) => {
      state.businessHosts.push(payload)
    },
    businessHostUpdated: (state, { payload }: PayloadAction<BusinessHostInfo>) => {
      const index = state.businessHosts.findIndex(host => host.id === payload.id)
      state.businessHosts[index] = payload
    },
    companyConfigFetched: (state, { payload }: PayloadAction<CompanyConfig>) => {
      state.activeCompanyConfig = payload
    },
    availableGuestUsersFetched: (state, { payload }: PayloadAction<GuestUserRegister[]>) => {
      state.availableGuestUsers = payload
    },
    companySliceCleared: state => {
      state.companies = []
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
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompaniesFailure') }))
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
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.registerCompanySuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerCompanyFailure') }))
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
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompanySuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompanyFailure') }))
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
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchBusinessHostsFailure') }))
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
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createBusinessHostSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createBusinessHostFailure') }))
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
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateBusinessHostSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateBusinessHostFailure') }))
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
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchCompanyConfigFailure') }))
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
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateCompanyConfigSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateCompanyConfigFailure') }))
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
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchAvailableGuestUsersFailure') }))
  }

  dispatch(setLoading(false))
}
