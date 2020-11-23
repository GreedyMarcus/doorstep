import i18n from '../../plugins/i18n'
import OfficeBuildingService from '../../services/OfficeBuildingService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import { EmployeeInfo } from '../../data/types/Company'
import { UserRegister, UserUpdate } from '../../data/types/User'

type CompanySliceState = {
  receptionists: EmployeeInfo[]
}

const initialState: CompanySliceState = {
  receptionists: []
}

/**
 * Represents a store slice that manages office building related data.
 */
const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    receptionistsFetched: (state, { payload }: PayloadAction<EmployeeInfo[]>) => {
      state.receptionists = payload
    },
    receptionistCreated: (state, { payload }: PayloadAction<EmployeeInfo>) => {
      state.receptionists.push(payload)
    },
    receptionistUpdated: (state, { payload }: PayloadAction<EmployeeInfo>) => {
      const index = state.receptionists.findIndex(host => host.id === payload.id)
      state.receptionists[index] = payload
    },
    buildingSliceCleared: state => {
      state.receptionists = []
    }
  }
})

export const { reducer } = buildingSlice
export const { buildingSliceCleared } = buildingSlice.actions
const { receptionistsFetched, receptionistCreated, receptionistUpdated } = buildingSlice.actions

/**
 * Calls office building service to load office building receptionists.
 */
export const fetchReceptionists = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const receptionists = await OfficeBuildingService.getReceptionists(buildingId)

    dispatch(receptionistsFetched(receptionists))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchReceptionistsFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls office building service to create a new receptionist for the current office building.
 */
export const createReceptionist = (data: UserRegister) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const receptionist = await OfficeBuildingService.createReceptionist(buildingId, data)

    dispatch(receptionistCreated(receptionist))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.createReceptionistSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.createReceptionistFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls office building service to update the specified office building receptionist.
 */
export const updateReceptionist = (receptionist: UserUpdate) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const updatedReceptionist = await OfficeBuildingService.updateReceptionist(buildingId, receptionist.id, receptionist)

    dispatch(receptionistUpdated(updatedReceptionist))
    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateReceptionistSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateReceptionistFailure') }))
  }

  dispatch(setLoading(false))
}
