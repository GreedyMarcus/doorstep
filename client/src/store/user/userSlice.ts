import i18n from '../../plugins/i18n'
import AuthService from '../../services/AuthService'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import { buildingSliceCleared } from '../building'
import { companySliceCleared } from '../company'
import { consentFormSliceCleared } from '../consentForm'
import { visitSliceCleared } from '../visit'
import { UserInfo, UserLogin, UserCredentials } from '../../data/types/User'
import { OfficeBuildingRegister } from '../../data/types/OfficeBuilding'

type UserSliceState = {
  activeUser: UserInfo | null
  activeUserToken: string | null
}

const initialState: UserSliceState = {
  activeUser: null,
  activeUserToken: AuthService.getUserToken()
}

/**
 * Represents a store slice that manages user related data.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoginSucceed: (state, { payload }: PayloadAction<UserInfo>) => {
      state.activeUser = payload
      if (payload.token) {
        state.activeUserToken = payload.token
      }
    },
    userLogoutSucceed: state => {
      state.activeUser = null
      state.activeUserToken = null
    },
    userCredentialsUpdated: (state, { payload }: PayloadAction<UserCredentials>) => {
      if (state.activeUser) {
        state.activeUser.firstName = payload.firstName
        state.activeUser.lastName = payload.lastName
      }
    }
  }
})

export const { reducer } = userSlice
const { userLoginSucceed, userLogoutSucceed, userCredentialsUpdated } = userSlice.actions

/**
 * Calls auth service to authenticate user.
 */
export const loginUser = (data: UserLogin) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const user = await AuthService.loginUser(data)

    dispatch(userLoginSucceed(user))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.login.success') }))
  } catch ({ response: { status } }) {
    dispatch(addNotification({ type: 'error', message: i18n.t(`notification.login.error.${status}`) }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls auth service to log out the current user.
 */
export const logoutUser = () => (dispatch: AppDispatch) => {
  AuthService.logoutUser()
  dispatch(userLogoutSucceed())

  // Reset store slices to initial values
  dispatch(buildingSliceCleared())
  dispatch(companySliceCleared())
  dispatch(consentFormSliceCleared())
  dispatch(visitSliceCleared())

  dispatch(addNotification({ type: 'success', message: i18n.t('notification.logout.success') }))
}

/**
 * Calls office building service to register a new building with an admin user.
 */
export const registerAccount = (data: OfficeBuildingRegister) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    await OfficeBuildingService.registerBuilding(data)

    dispatch(addNotification({ type: 'success', message: i18n.t('notification.register.success') }))
  } catch ({ response: { status } }) {
    dispatch(addNotification({ type: 'error', message: i18n.t(`notification.register.error.${status}`) }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls auth service to identify the user who belongs to the stored user token.
 */
export const loadCurrentUser = (token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const user = await AuthService.getCurrentUser()
    dispatch(userLoginSucceed({ ...user, token }))
  } catch (err) {
    AuthService.logoutUser()
    dispatch(userLogoutSucceed())
  }

  dispatch(setLoading(false))
}

/**
 * Calls auth service to send password reset request.
 */
export const sendForgotPassword = (email: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    await AuthService.sendForgotPassword(email)

    dispatch(addNotification({ type: 'success', message: i18n.t('notification.passwordForget.success') }))
  } catch ({ response: { status } }) {
    dispatch(addNotification({ type: 'error', message: i18n.t(`notification.passwordForget.error.${status}`) }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls auth service to reset user password.
 */
export const resetUserPassword = (token: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const user = await AuthService.resetPassword(token, password)

    dispatch(userLoginSucceed(user))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.passwordReset.success') }))
  } catch ({ response: { status } }) {
    dispatch(addNotification({ type: 'error', message: i18n.t(`notification.passwordReset.error.${status}`) }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls auth service to update user credentials.
 */
export const updateUserCredentials = (data: UserCredentials) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    await AuthService.updateUserCredentials(data)

    dispatch(userCredentialsUpdated(data))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateUserCredentials.success') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateUserCredentials.failure') }))
  }

  dispatch(setLoading(false))
}
