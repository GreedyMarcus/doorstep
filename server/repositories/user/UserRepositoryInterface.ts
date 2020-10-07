import { UserInfoDTO } from '../../data/dtos/UserDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'
import User from '../../models/User'

interface UserRepositoryInterface {
  findUserByEmail(email: string): Promise<User>
  createUser(userInfo: UserInfoDTO, userRole: UserRoleType): Promise<User>
}

export default UserRepositoryInterface
