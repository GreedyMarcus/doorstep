import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { VisitInfo } from '../../data/types/Visit'

type VisitSliceState = {
  visits: VisitInfo[]
}

const initialState: VisitSliceState = {
  visits: []
}

const visitSlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    visitsFetched: (state, { payload }: PayloadAction<VisitInfo[]>) => {
      state.visits = payload
    },
    visitSliceCleared: state => {
      state.visits = []
    }
  }
})

export const { reducer } = visitSlice
export const { visitSliceCleared } = visitSlice.actions
const { visitsFetched } = visitSlice.actions

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
