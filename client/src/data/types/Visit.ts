import { GuestUserRegister } from './User'

export type VisitInfo = {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export type VisitCreate = {
  businessHostId: number
  purpose: string
  room: string
  plannedEntry: Date | string
  invitedGuests: GuestUserRegister[]
}
