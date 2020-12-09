import { Address } from './Address'
import { UserRegister } from './User'

export interface CompanyInfo {
  id: number
  name: string
  registrationNumber: string
  address: string
  createdAt: Date
  adminName: string
  adminEmail: string
  adminJoinedAt: Date
}

export interface CompanyShortInfo {
  name: string
  registrationNumber: string
  address: string
}

export interface CompanyShortUpdate {
  name: string
  registrationNumber: string
  address: Address
}

export interface CompanyRegister {
  name: string
  registrationNumber: string
  address: Address
  admin: UserRegister
}

export interface CompanyUpdate {
  id: number
  name: string
  registrationNumber: string
  address: Address
  admin?: UserRegister
}

export interface EmployeeInfo {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: Date
}

export interface CompanyConfig {
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
