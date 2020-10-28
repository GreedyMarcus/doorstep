import User from '../../models/User'

interface UserRepositoryInterface {
  findUserById(userId: number): Promise<User>
  findUserByEmail(email: string): Promise<User>
  saveUser(user: User): Promise<User>
}

export default UserRepositoryInterface
