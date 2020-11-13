import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../data/types/General'

type ActionSliceState = {
  isLoading: boolean
  notification: Notification | null
}

const initialState: ActionSliceState = {
  isLoading: false,
  notification: null
}

/**
 * Represents a store slice that manages events that caused by other action dispatches,
 * therefore stores loading indicator status and event messages.
 */
const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    addNotification: (state, { payload }: PayloadAction<Notification>) => {
      state.notification = payload
    },
    removeNotification: state => {
      state.notification = null
    }
  }
})

export const { reducer } = actionSlice
export const { setLoading, addNotification, removeNotification } = actionSlice.actions
