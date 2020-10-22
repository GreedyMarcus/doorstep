import { RootState } from '..'

export const userTokenSelector = (state: RootState) => state.user.token
export const userRoleSelector = (state: RootState) => state.user.currentUser?.role
