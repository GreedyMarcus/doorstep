import { UserLoginDTO, UserLoginResultDTO } from '../../data/dtos/UserDTO'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'

interface AuthServiceInterface {
  loginUser(loginCredentials: UserLoginDTO): Promise<UserLoginResultDTO>
  registerOfficeBuilding(registration: OfficeBuildingRegistrationDTO): Promise<void>
  getCurrentUser(userId: number): Promise<UserLoginResultDTO>
  forgotUserPassword(email: string, language: string): Promise<void>
  resetUserPassword(token: string, password: string): Promise<UserLoginResultDTO>
}

export default AuthServiceInterface
