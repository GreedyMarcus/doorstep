import { UserLoginDTO, UserInfoDTO } from '../../data/dtos/UserDTO'

interface AuthServiceInterface {
  loginUser(data: UserLoginDTO): Promise<UserInfoDTO>
  getCurrentUser(userId: number): Promise<UserInfoDTO>
  forgotUserPassword(email: string, language: string): Promise<void>
  resetUserPassword(token: string, password: string): Promise<UserInfoDTO>
}

export default AuthServiceInterface
