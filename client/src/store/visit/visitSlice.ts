import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { VisitInfo, VisitCreate, PlannedVisitInfo } from '../../data/types/Visit'

type VisitSliceState = {
  visits: VisitInfo[]
  plannedVisits: PlannedVisitInfo[]
}

const initialState: VisitSliceState = {
  visits: [],
  plannedVisits: []
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
      state.plannedVisits.push(payload)
    },
    plannedVisitsFetched: (state, { payload }: PayloadAction<PlannedVisitInfo[]>) => {
      state.plannedVisits = payload
    },
    visitSliceCleared: state => {
      state.visits = []
      state.plannedVisits = []
    }
  }
})

export const { reducer } = visitSlice
export const { visitSliceCleared } = visitSlice.actions
const { visitsFetched, visitCreated, plannedVisitsFetched } = visitSlice.actions

/**
 * Calls company service to load all finished visits for the current company.
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
 * Calls company service to load all scheduled visits for the current business host.
 */
export const fetchPlannedVisits = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const companyId = user.activeUser?.companyId ?? -1
    const hostId = user.activeUser?.id ?? -1
    const plannedVisits = await CompanyService.getPlannedVisits(companyId, hostId)

    dispatch(plannedVisitsFetched(plannedVisits))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchPlannedVisitsFailure') }))
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
