import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import config from '../../config'
import TYPES from '../../config/types'
import AuthServiceInterface from './AuthServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/office-building'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'
import { UserLoginDTO, UserLoginResultDTO } from '../../data/dtos/UserDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'

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

  public loginUser = async ({ email, password }: UserLoginDTO): Promise<UserLoginResultDTO> => {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw Boom.badRequest('Invalid password')
    }

    // Create jwt token and assign it to user
    const token = jwt.sign({ user: user.id }, config.auth.tokenSecret, { expiresIn: config.auth.tokenExpiration })
    const authenticatedUser: UserLoginResultDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      token
    }

    return authenticatedUser
  }

  public registerOfficeBuilding = async ({ buildingAdmin, buildingAddress }: OfficeBuildingRegistrationDTO): Promise<void> => {
    const adminExists = await this.userRepository.findUserByEmail(buildingAdmin.email)
    if (adminExists) {
      throw Boom.badRequest('Admin already exists')
    }

    const buildingExistsWithAddress = await this.officeBuildingRepository.findBuildingByAddress(buildingAddress)
    if (buildingExistsWithAddress) {
      throw Boom.badRequest('Office building already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(buildingAdmin.password, salt)

    // Save admin with hashed password
    const adminData = { ...buildingAdmin, password: hashedPassword }
    const createdAdmin = await this.userRepository.createUser(adminData, UserRoleType.ADMIN)
    if (!createdAdmin) {
      throw Boom.internal('Admin user was not created')
    }

    // Save office building with admin
    const createdBuilding = await this.officeBuildingRepository.createBuilding(buildingAddress, createdAdmin)
    if (!createdBuilding) {
      throw Boom.internal('Office building was not created')
    }
  }
}

export default AuthService
