import { GuestUserRegisterDTO, UserShortInfoDTO } from './UserDTO'
import { ConsentFormVersionDetailsDTO } from './ConsentFormDTO'
import { CompanyShortInfoDTO } from './CompanyDTO'

export interface VisitInfoDTO {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export interface PlannedVisitInfoDTO {
  id: number
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

export interface VisitDetailsDTO {
  id: number
  companyName: string
  businessHost: UserShortInfoDTO
  purpose: string
  room: string
  plannedEntry: Date
  invitedGuests: VisitGuestInfoDTO[]
  consentFormVersionsToAccept: ConsentFormVersionDetailsDTO[]
}

export interface VisitGuestInfoDTO {
  id: number
  user: UserShortInfoDTO
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  company: CompanyShortInfoDTO
  actualEntry: Date | null
  actualExit: Date | null
  receptionistName: string
  guestCardNumber: string
  participationStatus: string
}
