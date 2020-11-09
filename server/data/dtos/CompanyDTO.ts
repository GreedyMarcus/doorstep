import { AddressDTO } from './AddressDTO'
import { UserRegisterDTO } from './UserDTO'

export interface CompanyInfoDTO {
  id: number
  name: string
  registrationNumber: string
  address: string
  createdAt: Date
  adminName: string
  adminEmail: string
  adminJoinedAt: Date
}

export interface CompanyRegisterDTO {
  name: string
  registrationNumber: string
  address: AddressDTO
  admin: UserRegisterDTO
}

export interface CompanyUpdateDTO {
  id: number
  name: string
  registrationNumber: string
  address: AddressDTO
  admin?: UserRegisterDTO
}

export interface CompanyVisitInfoDTO {
  id: number
  businessHostName: string
  purpose: string
  room: string
  plannedEntry: Date
}
