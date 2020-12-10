import { UserRegisterDTO } from './UserDTO'
import { AddressDTO } from './AddressDTO'

export interface OfficeBuildingRegisterDTO {
  admin: UserRegisterDTO
  address: AddressDTO
}
