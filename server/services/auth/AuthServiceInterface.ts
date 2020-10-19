import { UserLoginDTO, UserLoginResultDTO } from '../../data/dtos/UserDTO'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'

interface AuthServiceInterface {
  loginUser(loginCredentials: UserLoginDTO): Promise<UserLoginResultDTO>
  registerOfficeBuilding(registration: OfficeBuildingRegistrationDTO): Promise<void>
}

export default AuthServiceInterface
