import User from '../../models/User'
import UserRole from '../../models/UserRole'
import UserRepositoryInterface from './UserRepositoryInterface'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'
import { UserInfoDTO } from '../../data/dtos/UserDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
@EntityRepository(User)
class UserRepository extends Repository<User> implements UserRepositoryInterface {
  public findUserByEmail(email: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne()
  }

  public async createUser(userInfo: UserInfoDTO, userRole: UserRoleType): Promise<User> {
    const foundUserRole = await getRepository(UserRole).findOne({ name: userRole })
    if (!foundUserRole) {
      return null
    }

    const newUser = new User()
    newUser.email = userInfo.email
    newUser.password = userInfo.password
    newUser.firstName = userInfo.firstName
    newUser.lastName = userInfo.lastName
    newUser.role = foundUserRole

    return getRepository(User).save(newUser)
  }
}

export default UserRepository
