import { UserInfoDTO } from './UserDTO'
import { LongAddressDTO } from './AddressDTO'

export interface OfficeBuildingRegistrationDTO {
  buildingAdmin: UserInfoDTO
  buildingAddress: LongAddressDTO
}
