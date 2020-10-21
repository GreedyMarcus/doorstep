import AuthService from '../../services/AuthService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import { setLoading, addNotification } from '../action'
import i18n from '../../plugins/i18n'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  token: string
}

type SliceState = {
  currentUser: User | null
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
    userLoginSucceed: (state, { payload }: PayloadAction<User>) => {
      state.currentUser = payload
      state.token = payload.token
    },
    userLogoutSucceed: state => {
      state.currentUser = null
      state.token = null
    }
  }
})

export const { reducer } = userSlice

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  const { userLoginSucceed } = userSlice.actions

  dispatch(setLoading(true))

  try {
    const user = await AuthService.loginUser(email, password)
    dispatch(userLoginSucceed(user))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.loginSuccess') }))
  } catch (error) {
    console.log(error)
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.loginSuccess') }))
  }

  dispatch(setLoading(false))
}

export const logoutUser = () => (dispatch: AppDispatch) => {
  const { userLogoutSucceed } = userSlice.actions

  AuthService.logoutUser()
  dispatch(userLogoutSucceed())
  dispatch(addNotification({ type: 'success', message: i18n.t('notification.logoutSuccess') }))
}

export const registerUser = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country: string,
  zipCode: string,
  city: string,
  streetAddress: string
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const created = await AuthService.registerBuilding(
      email,
      password,
      firstName,
      lastName,
      country,
      zipCode,
      city,
      streetAddress
    )
    if (created) {
      dispatch(
        addNotification({ type: 'success', message: i18n.t('notification.registerSuccess') })
      )
    } else {
      dispatch(addNotification({ type: 'error', message: i18n.t('notification.registerFailure') }))
    }
  } catch (error) {
    console.log(error)
  }

  dispatch(setLoading(false))
}
