import { RootState } from '..'

export const userTokenSelector = (state: RootState) => state.user.activeUserToken
export const userRoleSelector = (state: RootState) => state.user.activeUser?.role
