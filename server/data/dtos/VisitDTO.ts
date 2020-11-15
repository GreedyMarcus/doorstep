import { GuestUserRegisterDTO } from './UserDTO'

export interface VisitInfoDTO {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export interface VisitCreateDTO {
  businessHostId: number
  purpose: string
  room: string
  plannedEntry: Date
  invitedGuests: GuestUserRegisterDTO[]
}
