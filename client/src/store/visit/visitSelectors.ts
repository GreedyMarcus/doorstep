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
 * Returns all upcoming visits belong to the current guest user.
 */
export const guestInvitationsSelector = (state: RootState) => state.visit.guestInvitations

/**
 * Returns all visits belong to the current office building.
 */
export const invitationsSelector = (state: RootState) => state.visit.invitations

/**
 * Returns the selected visit.
 */
export const activeVisitSelector = (state: RootState) => state.visit.activeVisit

/**
 * Returns the selected guest profile.
 */
export const activeGuestProfileSelector = (state: RootState) => state.visit.activeGuestProfile
