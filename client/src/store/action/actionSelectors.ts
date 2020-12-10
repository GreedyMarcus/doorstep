import { RootState } from '../index'

/**
 * Returns the complete state of the action reducer.
 */
export const actionSelector = (state: RootState) => state.action
