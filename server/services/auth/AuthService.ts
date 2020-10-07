import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/office-building'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'
import { UserLoginDTO } from '../../data/dtos/UserDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'
import AuthServiceInterface from './AuthServiceInterface'
import TYPES from '../../config/types'
import config from '../../config'
import Boom from '@hapi/boom'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

@injectable()
class AuthService implements AuthServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository) officeBuildingRepository: OfficeBuildingRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.officeBuildingRepository = officeBuildingRepository
  }

  public loginUser = async ({ email, password }: UserLoginDTO): Promise<string> => {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw Boom.badRequest('Invalid password')
    }

    // Create jwt token
    const { tokenSecret, tokenExpiration } = config.auth
    return jwt.sign({ user: user.id }, tokenSecret, { expiresIn: tokenExpiration })
  }

  public registerOfficeBuilding = async (registration: OfficeBuildingRegistrationDTO): Promise<void> => {
    const adminExists = await this.userRepository.findUserByEmail(registration.buildingAdmin.email)
    if (adminExists) {
      throw Boom.badRequest('Admin already exists')
    }

    const buildingExistsWithAddress = await this.officeBuildingRepository.findBuildingByAddress(registration.buildingAddress)
    if (buildingExistsWithAddress) {
      throw Boom.badRequest('Office building already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(registration.buildingAdmin.password, salt)


    // Save admin with hashed password
    const adminData = { ...registration.buildingAdmin, password: hashedPassword }
    const createdAdmin = await this.userRepository.createUser(adminData, UserRoleType.ADMIN)
    if (!createdAdmin) {
      throw Boom.internal('Admin user was not created')
    }

    // Save office building with admin
    const createdBuilding = await this.officeBuildingRepository.createBuilding(registration.buildingAddress, createdAdmin)
    if (!createdBuilding) {
      throw Boom.internal('Office building was not created')
    }
  }
}

export default AuthService
