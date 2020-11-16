import { RootState } from '../index'

/**
 * Returns all finished visits belong to the current company.
 */
export const visitsSelector = (state: RootState) => state.visit.visits

/**
 * Returns all scheduled visits belong to the current business host.
 */
export const plannedVisitsSelector = (state: RootState) => state.visit.plannedVisits

/**
 * Returns the selected visit.
 */
export const activeVisitSelector = (state: RootState) => state.visit.activeVisit
