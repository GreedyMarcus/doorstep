import { RootState } from '../index'

export const companiesSelector = (state: RootState) => state.company.companies
export const businessHostsSelector = (state: RootState) => state.company.businessHosts
export const activeCompanyConfig = (state: RootState) => state.company.activeCompanyConfig
