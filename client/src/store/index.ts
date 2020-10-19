import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { reducer as userReducer } from './user'

const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV === 'development'
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type RootState = ReturnType<typeof store.getState>
export default store
