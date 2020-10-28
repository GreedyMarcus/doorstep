import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import config from '../../config'
import TYPES from '../../config/types'
import AuthServiceInterface from './AuthServiceInterface'
import { v4 as uuidv4 } from 'uuid'
import { inject, injectable } from 'inversify'
import { EmailServiceInterface } from '../email'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/office-building'
import { OfficeBuildingRegistrationDTO } from '../../data/dtos/OfficeBuildingDTO'
import { UserLoginDTO, UserLoginResultDTO } from '../../data/dtos/UserDTO'

@injectable()
class AuthService implements AuthServiceInterface {
  private readonly emailService: EmailServiceInterface
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface

  constructor(
    @inject(TYPES.EmailService) emailService: EmailServiceInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository) officeBuildingRepository: OfficeBuildingRepositoryInterface
  ) {
    this.emailService = emailService
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
      throw Boom.badRequest('Office building already exists with address')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(buildingAdmin.password, salt)

    // Save office building with admin
    const adminData = { ...buildingAdmin, password: hashedPassword }
    const createdBuilding = await this.officeBuildingRepository.createBuilding(buildingAddress, adminData)
    if (!createdBuilding) {
      throw Boom.internal('Could not register office building')
    }
  }

  public getCurrentUser = async (userId: number): Promise<UserLoginResultDTO> => {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    const currentUser: UserLoginResultDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name
    }
    return currentUser
  }

  public forgotUserPassword = async (email: string, language: string): Promise<void> => {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    // Generate and save password token
    const token = uuidv4()
    user.passwordToken = token
    await this.userRepository.saveUser(user)

    // Send password reset link to user via email
    await this.emailService.sendPasswordResetLink(email, token, language)
  }
}

export default AuthService
