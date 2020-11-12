import { RootState } from '../index'

export const companiesSelector = (state: RootState) => state.company.companies
export const businessHostsSelector = (state: RootState) => state.company.businessHosts
export const activeCompanyConfigSelector = (state: RootState) => state.company.activeCompanyConfig
