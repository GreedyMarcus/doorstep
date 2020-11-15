import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { VisitInfo, VisitCreate } from '../../data/types/Visit'

type VisitSliceState = {
  visits: VisitInfo[]
}

const initialState: VisitSliceState = {
  visits: []
}

/**
 * Represents a store slice that manages visit related data.
 */
const visitSlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    visitsFetched: (state, { payload }: PayloadAction<VisitInfo[]>) => {
      state.visits = payload
    },
    visitCreated: (state, { payload }: PayloadAction<VisitInfo>) => {
      state.visits.push(payload)
    },
    visitSliceCleared: state => {
      state.visits = []
    }
  }
})

export const { reducer } = visitSlice
export const { visitSliceCleared } = visitSlice.actions
const { visitsFetched, visitCreated } = visitSlice.actions

/**
 * Calls company service to load all visits for the current company.
 */
export const fetchVisits = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const visits = await CompanyService.getVisits(companyId)

    dispatch(visitsFetched(visits))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchVisitsFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to create a new visit for the current company.
 */
export const createVisit = (data: VisitCreate) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const businessHostId = user.activeUser?.id ?? -1
    const visit = await CompanyService.createVisit(companyId, { ...data, businessHostId })

    dispatch(visitCreated(visit))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createVisitSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createVisitFailure') }))
  }

  dispatch(setLoading(false))
}
