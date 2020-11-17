import User from '../../models/User'
import UserRole from '../../models/UserRole'
import UserRepositoryInterface from './UserRepositoryInterface'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'

@injectable()
@EntityRepository(User)
class UserRepository extends Repository<User> implements UserRepositoryInterface {
  public findUserById(userId: number): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.id = :userId', { userId })
      .getOne()
  }

  public findUserByEmail(email: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.email = :email', { email })
      .getOne()
  }

  public findAllUsersByEmails(emails: string[]): Promise<User[]> {
    return getRepository(User).createQueryBuilder('user').where('user.email IN (:emails)', { emails }).getMany()
  }

  public findUserByPasswordToken(token: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.passwordToken = :token', { token })
      .getOne()
  }

  public async getPermissionsForUser(userId: number): Promise<string[]> {
    const role = await getRepository(UserRole)
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .leftJoinAndSelect(User, 'user', 'user.role = role.id')
      .where('user.id = :userId', { userId })
      .getOne()

    return role?.permissions.map(permission => permission.name)
  }

  public saveUser(user: User): Promise<User> {
    return getRepository(User).save(user)
  }
}

export default UserRepository
