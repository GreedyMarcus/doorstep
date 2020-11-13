import { RootState } from '../index'

/**
 * Returns all visits belong to the current company.
 */
export const visitsSelector = (state: RootState) => state.visit.visits
