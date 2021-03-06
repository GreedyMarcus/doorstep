import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { isDevelopment } from '../utils'
import { reducer as userReducer } from './user'
import { reducer as buildingReducer } from './building'
import { reducer as companyReducer } from './company'
import { reducer as consentFormReducer } from './consentForm'
import { reducer as visitReducer } from './visit'
import { reducer as actionReducer } from './action'

/**
 * Redux store configuration object.
 */
const store = configureStore({
  reducer: {
    user: userReducer,
    building: buildingReducer,
    company: companyReducer,
    consentForm: consentFormReducer,
    visit: visitReducer,
    action: actionReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: isDevelopment()
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type RootState = ReturnType<typeof store.getState>
export default store
