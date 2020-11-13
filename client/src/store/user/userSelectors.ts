import { RootState } from '..'

/**
 * Returns the JWT token that belongs to the current user if present.
 */
export const userTokenSelector = (state: RootState) => state.user.activeUserToken

/**
 * Returns the role of the current user if present.
 */
export const userRoleSelector = (state: RootState) => state.user.activeUser?.role
