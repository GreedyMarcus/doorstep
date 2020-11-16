import { Address } from './General'
import { UserRegister } from './User'

export type CompanyInfo = {
  id: number
  name: string
  registrationNumber: string
  address: string
  createdAt: Date
  adminName: string
  adminEmail: string
  adminJoinedAt: Date
}

export type CompanyInfoFormatted = {
  name: string
  registrationNumber: string
  address: Address
  admin: UserRegister
}

export type CompanyShortInfo = {
  name: string
  registrationNumber: string
  address: string
}

export type CompanyRegister = {
  name: string
  registrationNumber: string
  address: Address
  admin: UserRegister
}

export type CompanyUpdate = {
  id: number
  name: string
  registrationNumber: string
  address: Address
  admin?: UserRegister
}

export type CompanyConfig = {
  storeNationality: boolean
  storeAddress: boolean
  storePhoneNumber: boolean
  storeBirthplace: boolean
  storeBirthDate: boolean
  storeMotherName: boolean
  storeCompany: boolean
  registerGuestCard: boolean
  trackActualExit: boolean
}
