import { RootState } from '../index'

/**
 * Returns all receptionists belong to the current office building.
 */
export const receptionistsSelector = (state: RootState) => state.building.receptionists
