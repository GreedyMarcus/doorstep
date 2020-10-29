import User from '../../models/User'

interface UserRepositoryInterface {
  findUserById(userId: number): Promise<User>
  findUserByEmail(email: string): Promise<User>
  findUserByPasswordToken(token: string): Promise<User>
  saveUser(user: User): Promise<User>
  getPermissionsForUser(userId: number): Promise<string[]>
}

export default UserRepositoryInterface
