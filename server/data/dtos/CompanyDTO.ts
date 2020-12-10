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

export interface CompanyShortInfoDTO {
  name: string
  registrationNumber: string
  address: string
}

export interface CompanyShortUpdateDTO {
  name: string
  registrationNumber: string
  address: AddressDTO
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

export interface EmployeeInfoDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: Date
}

export interface CompanyRegisterConfigDTO {
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
