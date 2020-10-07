import { UserLoginDTO } from '../../data/dtos/UserDTO'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'

interface AuthServiceInterface {
  loginUser(loginCredentials: UserLoginDTO): Promise<string>
  registerOfficeBuilding(registration: OfficeBuildingRegistrationDTO): Promise<void>
}

export default AuthServiceInterface
