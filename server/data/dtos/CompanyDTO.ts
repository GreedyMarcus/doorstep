import { LongAddressDTO } from './AddressDTO'
import { UserInfoDTO } from './UserDTO'

export interface CompanyInfoDTO {
  id: number
  name: string
  registrationNumber: string
  address: string
  joiningDate: Date
  adminName: string
  adminEmail: string
  adminJoiningDate: Date
}

export interface CompanyRegistrationDTO {
  name: string
  registrationNumber: string
  address: LongAddressDTO
  admin: UserInfoDTO
}

export interface CompanyUpdateDTO {
  name: string
  registrationNumber: string
  address: LongAddressDTO
  admin?: UserInfoDTO
}
