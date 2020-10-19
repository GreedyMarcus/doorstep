import AuthService from '../../services/AuthService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'

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
export const { userLogoutSucceed } = userSlice.actions

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  const { userLoginSucceed } = userSlice.actions

  try {
    const user = await AuthService.loginUser(email, password)
    dispatch(userLoginSucceed(user))
  } catch (error) {
    console.log(error)
  }
}

export const logoutUser = () => (dispatch: AppDispatch) => {
  const { userLogoutSucceed } = userSlice.actions

  AuthService.logoutUser()
  dispatch(userLogoutSucceed())
}
