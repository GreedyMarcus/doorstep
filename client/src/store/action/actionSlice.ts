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
