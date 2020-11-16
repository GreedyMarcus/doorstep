import { RootState } from '../index'

/**
 * Returns all finished visits belong to the current company.
 */
export const visitsSelector = (state: RootState) => state.visit.visits

/**
 * Returns all scheduled visits belong to the current business host.
 */
export const plannedVisitsSelector = (state: RootState) => state.visit.plannedVisits
