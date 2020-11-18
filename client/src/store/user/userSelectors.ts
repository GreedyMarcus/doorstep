import { RootState } from '..'

/**
 * Returns the JWT token that belongs to the current user if present.
 */
export const userTokenSelector = (state: RootState) => state.user.activeUserToken

/**
 * Returns the role of the current user if present.
 */
export const userRoleSelector = (state: RootState) => state.user.activeUser?.role

/**
 * Returns the full name of the current user if present.
 */
export const userNameSelector = (state: RootState) => {
  return state.user.activeUser ? `${state.user.activeUser.firstName} ${state.user.activeUser.lastName}` : ''
}

/**
 * Returns the active user if present.
 */
export const activeUserSelector = (state: RootState) => state.user.activeUser
