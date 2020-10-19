import { RootState } from '..'

export const userTokenSelector = (state: RootState) => state.user.token
