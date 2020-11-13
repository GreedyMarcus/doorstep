import { RootState } from '../index'

/**
 * Returns all companies belong to the office building.
 */
export const companiesSelector = (state: RootState) => state.company.companies

/**
 * Returns all business hosts belong to the current company.
 */
export const businessHostsSelector = (state: RootState) => state.company.businessHosts

/**
 * Returns the register config of the current company.
 */
export const activeCompanyConfigSelector = (state: RootState) => state.company.activeCompanyConfig
