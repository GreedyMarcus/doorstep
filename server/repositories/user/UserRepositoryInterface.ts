import User from '../../models/User'

interface UserRepositoryInterface {
  findUserByEmail(email: string): Promise<User>
}

export default UserRepositoryInterface
