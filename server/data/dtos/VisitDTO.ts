import { GuestUserRegisterDTO, UserShortInfoDTO } from './UserDTO'
import { ConsentFormVersionDetailsDTO } from './ConsentFormDTO'
import { CompanyRegisterConfigDTO, CompanyShortInfoDTO, CompanyShortUpdateDTO } from './CompanyDTO'
import { AddressDTO } from './AddressDTO'

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

export interface InvitationInfoDTO {
  id: number
  companyName: string
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

export interface VisitNotificationDTO {
  companyName: string
  buildingAddress: string
  businessHost: UserShortInfoDTO
  purpose: string
  room: string
  plannedEntry: Date
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
  receptionistName: string | null
  guestCardNumber: string | null
  participationStatus: string
}

export interface VisitGuestDetailsDTO {
  id: number
  user: UserShortInfoDTO
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  address: string | null
  identifierCardType: string
  identifierCardNumber: string | null
  company: CompanyShortInfoDTO
  imageUrl: string | null
  signature: string | null
  actualEntry: Date | null
  actualExit: Date | null
  receptionistName: string | null
  guestCardNumber: string | null
  participationStatus: string
}

export interface GuestInvitationInfoDTO {
  id: number
  companyName: string
  buildingAddress: string
  businessHost: UserShortInfoDTO
  purpose: string
  room: string
  plannedEntry: Date
}

export interface GuestInvitationDetailsDTO {
  invitationInfo?: GuestInvitationInfoDTO
  guestDetails: VisitGuestDetailsDTO
  consentFormVersionsToAccept: ConsentFormVersionDetailsDTO[]
  consentFormVersionsAccepted: number[] // To store consent form version ids
  companyRegisterConfig: CompanyRegisterConfigDTO
}

export interface GuestUpdateByUserDTO {
  receptionistId?: number
  nationality: string | null
  phoneNumber: string | null
  birthplace: string | null
  birthDate: string | null
  motherName: string | null
  address: AddressDTO | null
  identifierCardType: string
  identifierCardNumber: string | null
  company: CompanyShortUpdateDTO | null
  imageUrl: string | null
  signature: string | null
  consentFormVersionsAccepted: number[] // Consent form version ids
}
