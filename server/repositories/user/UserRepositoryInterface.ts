import User from '../../models/User'

interface UserRepositoryInterface {
  /**
   * Returns the user that has the specified id.
   */
  findUserById(userId: number): Promise<User>

  /**
   * Returns the user that has the specified email address.
   */
  findUserByEmail(email: string): Promise<User>

  /**
   * Returns the user that has the specified password token.
   */
  findUserByPasswordToken(token: string): Promise<User>

  /**
   * Returns all permissions that the specified user has.
   */
  getPermissionsForUser(userId: number): Promise<string[]>

  /**
   * Save the provided user.
   */
  saveUser(user: User): Promise<User>
}

export default UserRepositoryInterface
