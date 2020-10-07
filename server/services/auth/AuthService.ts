import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/office-building'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'
import AuthServiceInterface from './AuthServiceInterface'
import TYPES from '../../config/types'
import Boom from '@hapi/boom'
import bcrypt from 'bcryptjs'

@injectable()
class AuthService implements AuthServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository)
    officeBuildingRepository: OfficeBuildingRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.officeBuildingRepository = officeBuildingRepository
  }

  public loginUser = async (email: string, password: string) => {
    throw new Error('Method not implemented.')
  }

  public registerOfficeBuilding = async (registration: OfficeBuildingRegistrationDTO) => {
    const adminExists = await this.userRepository.findUserByEmail(registration.buildingAdmin.email)
    if (adminExists) {
      throw Boom.badRequest('Admin already exists')
    }

    const buildingExistsWithAddress = await this.officeBuildingRepository.findBuildingByAddress(registration.buildingAddress)
    if (buildingExistsWithAddress) {
      throw Boom.badRequest('Office building already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(registration.buildingAdmin.password, salt)

    const adminData = { ...registration.buildingAdmin, password: hashedPassword }
    const createdAdmin = await this.userRepository.createUser(adminData, UserRoleType.ADMIN)
    if (!createdAdmin) {
      throw Boom.internal('Admin user was not created')
    }

    const createdBuilding = await this.officeBuildingRepository.createBuilding(registration.buildingAddress, createdAdmin)
    if (!createdBuilding) {
      throw Boom.internal('Office building was not created')
    }
  }
}

export default AuthService
