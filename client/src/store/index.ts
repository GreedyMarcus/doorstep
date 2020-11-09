import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { isDevelopment } from '../utils'
import { reducer as userReducer } from './user'
import { reducer as companyReducer } from './company'
import { reducer as consentFormReducer } from './consentForm'
import { reducer as actionReducer } from './action'

const store = configureStore({
  reducer: {
    user: userReducer,
    company: companyReducer,
    consentForm: consentFormReducer,
    action: actionReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: isDevelopment()
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type RootState = ReturnType<typeof store.getState>
export default store
