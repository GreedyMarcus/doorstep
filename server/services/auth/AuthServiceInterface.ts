import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'

interface AuthServiceInterface {
  loginUser(email: string, password: string)
  registerOfficeBuilding(registration: OfficeBuildingRegistrationDTO)
}

export default AuthServiceInterface
