import AuthService from '../../services/AuthService'
import i18n from '../../plugins/i18n'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import { UserLoginResult, RegisterUserDetails } from '../../data/types/User'

type SliceState = {
  currentUser: UserLoginResult | null
  token: string | null
}

const initialState: SliceState = {
  currentUser: null,
  token: AuthService.getToken()
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoginSucceed: (state, { payload }: PayloadAction<UserLoginResult>) => {
      state.currentUser = payload
      state.token = payload.token
    },
    userLogoutSucceed: state => {
      state.currentUser = null
      state.token = null
    }
  }
})

const { userLoginSucceed, userLogoutSucceed } = userSlice.actions

export const { reducer } = userSlice

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const user = await AuthService.loginUser(email, password)
    dispatch(userLoginSucceed(user))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.loginSuccess') }))
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.loginFailure') }))
  }

  dispatch(setLoading(false))
}

export const logoutUser = () => (dispatch: AppDispatch) => {
  AuthService.logoutUser()
  dispatch(userLogoutSucceed())
  dispatch(addNotification({ type: 'success', message: i18n.t('notification.logoutSuccess') }))
}

export const registerUser = (userDetails: RegisterUserDetails) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const isBuildingCreated = await AuthService.registerBuilding(userDetails)
    if (isBuildingCreated) {
      dispatch(addNotification({ type: 'success', message: i18n.t('notification.registerSuccess') }))
    } else {
      dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerFailure') }))
    }
  } catch (error) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerFailure') }))
  }

  dispatch(setLoading(false))
}

export const loadCurrentUser = (token: string) => async (dispatch: AppDispatch) => {
  try {
    const user = await AuthService.getCurrentUser()
    dispatch(userLoginSucceed({ ...user, token }))
  } catch (error) {
    AuthService.logoutUser()
    dispatch(userLogoutSucceed())
  }

  dispatch(setLoading(false))
}
