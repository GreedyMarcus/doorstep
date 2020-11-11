import { UserLoginDTO, UserInfoDTO } from '../../data/dtos/UserDTO'

interface AuthServiceInterface {
  /**
   * Authenticates user with the provided credentials.
   */
  loginUser(data: UserLoginDTO): Promise<UserInfoDTO>

  /**
   * Returns the currently authenticated user.
   */
  getCurrentUser(userId: number): Promise<UserInfoDTO>

  /**
   * Sends forgotten password link to the user via email.
   *
   * @param email - the email of the user
   * @param language - the language of the email content
   */
  forgotUserPassword(email: string, language: string): Promise<void>

  /**
   * Create a new password for the specified user with the provided credentials.
   *
   * @param token - the password token
   * @param password - the new password
   */
  resetUserPassword(token: string, password: string): Promise<UserInfoDTO>
}

export default AuthServiceInterface
