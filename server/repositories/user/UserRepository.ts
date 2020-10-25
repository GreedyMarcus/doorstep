import User from '../../models/User'
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
      .where('user.id = :userId', { userId })
      .getOne()
  }

  public findUserByEmail(email: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne()
  }
}

export default UserRepository
