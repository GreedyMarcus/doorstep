import { GuestUserRegister, UserShortInfo } from './User'
import { CompanyConfig, CompanyShortInfo, CompanyShortUpdate } from './Company'
import { ConsentFormVersionDetails } from './ConsentForm'
import { Address } from './Address'

export interface VisitInfo {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export interface PlannedVisitInfo {
  id: number
  purpose: string
  room: string
  plannedEntry: Date
}

export interface InvitationInfo {
  id: number
  companyName: string
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}

export interface VisitCreate {
  businessHostId: number
  purpose: string
  room: string
  plannedEntry: Date | string
  invitedGuests: GuestUserRegister[]
}

export interface VisitDetails {
  id: number
  companyName: string
  businessHost: UserShortInfo
  purpose: string
  room: string
  plannedEntry: Date
  invitedGuests: VisitGuestInfo[]
  consentFormVersionsToAccept: ConsentFormVersionDetails[]
}

export interface VisitGuestInfo {
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

export interface VisitGuestDetails {
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

export interface GuestInvitationInfo {
  id: number
  companyName: string
  buildingAddress: string
  businessHost: UserShortInfo
  purpose: string
  room: string
  plannedEntry: Date
}

export interface GuestInvitationDetails {
  invitationInfo?: GuestInvitationInfo
  guestDetails: VisitGuestDetails
  consentFormVersionsToAccept: ConsentFormVersionDetails[]
  consentFormVersionsAccepted: number[] // To store consent form version ids,
  companyRegisterConfig: CompanyConfig
}

export interface GuestUpdateByUser {
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  address: Address | null
  identifierCardType: string
  identifierCardNumber: string | null
  company: CompanyShortUpdate | null
  imageUrl: string | null
  signatureImageUrl: string | null
  consentFormVersionsAccepted: number[] // Consent form version ids
}
