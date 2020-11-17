import { GuestUserRegister, UserShortInfo } from './User'
import { CompanyShortInfo } from './Company'
import { ConsentFormVersionDetails } from './ConsentForm'

export type VisitInfo = {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export type PlannedVisitInfo = {
  id: number
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

export type VisitDetails = {
  id: number
  companyName: string
  businessHost: UserShortInfo
  purpose: string
  room: string
  plannedEntry: Date
  invitedGuests: VisitGuestInfo[]
  consentFormVersionsToAccept: ConsentFormVersionDetails[]
}

export type VisitGuestInfo = {
  id: number
  user: UserShortInfo
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  company: CompanyShortInfo
  actualEntry: Date | null
  actualExit: Date | null
  receptionistName: string | null
  guestCardNumber: string | null
  participationStatus: string
}

export type VisitGuestDetails = {
  id: number
  user: UserShortInfo
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  address: string | null
  identifierCardType: string
  identifierCardNumber: string | null
  company: CompanyShortInfo
  imageUrl: string | null
  signatureImageUrl: string | null
  actualEntry: Date | null
  actualExit: Date | null
  receptionistName: string | null
  guestCardNumber: string | null
  participationStatus: string
}

export type GuestInvitationInfo = {
  id: number
  companyName: string
  buildingAddress: string
  businessHost: UserShortInfo
  purpose: string
  room: string
  plannedEntry: Date
}

export type GuestInvitationDetails = {
  invitationInfo: GuestInvitationInfo
  guestDetails: VisitGuestDetails
  consentFormVersionsToAccept: ConsentFormVersionDetails[]
  consentFormVersionsAccepted: number[] // To store consent form version ids
}
