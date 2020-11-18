import i18n from '../../plugins/i18n'
import CompanyService from '../../services/CompanyService'
import VisitService from '../../services/VisitService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { setLoading, addNotification } from '../action'
import {
  VisitInfo,
  VisitCreate,
  PlannedVisitInfo,
  InvitationInfo,
  VisitDetails,
  GuestInvitationInfo,
  GuestInvitationDetails,
  GuestUpdateByUser
} from '../../data/types/Visit'
import OfficeBuildingService from '../../services/OfficeBuildingService'

type VisitSliceState = {
  visits: VisitInfo[]
  plannedVisits: PlannedVisitInfo[]
  guestInvitations: GuestInvitationInfo[]
  invitations: InvitationInfo[]
  activeVisit: VisitDetails | null
  activeGuestProfile: GuestInvitationDetails | null
}

const initialState: VisitSliceState = {
  visits: [],
  plannedVisits: [],
  guestInvitations: [],
  invitations: [],
  activeVisit: null,
  activeGuestProfile: {} as GuestInvitationDetails
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
    guestInvitationsFetched: (state, { payload }: PayloadAction<GuestInvitationInfo[]>) => {
      state.guestInvitations = payload
    },
    invitationsFetched: (state, { payload }: PayloadAction<InvitationInfo[]>) => {
      state.invitations = payload
    },
    singleVisitFetched: (state, { payload }: PayloadAction<VisitDetails>) => {
      state.activeVisit = payload
    },
    guestProfileFetched: (state, { payload }: PayloadAction<GuestInvitationDetails | null>) => {
      state.activeGuestProfile = payload
    },
    visitSliceCleared: state => {
      state.visits = []
      state.plannedVisits = []
      state.guestInvitations = []
      state.activeVisit = null
      state.activeGuestProfile = null
    }
  }
})

export const { reducer } = visitSlice
export const { visitSliceCleared } = visitSlice.actions
const {
  visitsFetched,
  visitCreated,
  plannedVisitsFetched,
  guestInvitationsFetched,
  invitationsFetched,
  singleVisitFetched,
  guestProfileFetched
} = visitSlice.actions

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
 * Calls visit service to load all upcoming visits for the current guest.
 */
export const fetchGuestInvitations = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const userId = user.activeUser?.id ?? -1
    const guestInvitations = await VisitService.getGuestInvitations(userId)

    dispatch(guestInvitationsFetched(guestInvitations))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchGuestInvitationsFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls company service to load all scheduled visits for the current business host.
 */
export const fetchInvitations = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const buildingId = user.activeUser?.buildingId ?? -1
    const invitations = await OfficeBuildingService.getInvitations(buildingId)

    dispatch(invitationsFetched(invitations))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchInvitationsFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls visit service to load the visit specified by id.
 */
export const fetchVisitById = (visitId: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    const visit = await VisitService.getVisitById(visitId)

    dispatch(singleVisitFetched(visit))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchVisitByIdFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls visit service to load the visit specified by id.
 */
export const fetchGuestInvitationProfile = (visitId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState()

  dispatch(guestProfileFetched({} as GuestInvitationDetails))
  dispatch(setLoading(true))

  try {
    const userId = user.activeUser?.id ?? -1
    const guestProfile = await VisitService.getGuestInvitationProfile(userId, visitId)

    dispatch(guestProfileFetched(guestProfile))
  } catch (err) {
    dispatch(guestProfileFetched(null))
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.fetchGuestInvitationProfileFailure') }))
  }

  dispatch(setLoading(false))
}

/**
 * Calls visit service to update the visit guest data for specified guest user.
 */
export const updateGuestInvitationProfile = (visitId: number, data: GuestUpdateByUser) => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { user } = getState()

  dispatch(setLoading(true))

  try {
    const userId = user.activeUser?.id ?? -1
    await VisitService.updateGuestInvitationProfile(userId, visitId, data)

    dispatch(addNotification({ type: 'success', message: i18n.t('notification.updateGuestInvitationProfileSuccess') }))
  } catch (err) {
    dispatch(addNotification({ type: 'error', message: i18n.t('notification.updateGuestInvitationProfileFailure') }))
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
