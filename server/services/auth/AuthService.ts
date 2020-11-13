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
import { OfficeBuildingRepositoryInterface } from '../../repositories/officeBuilding'
import { UserRoleType } from '../../data/enums/UserRoleType'
import { UserLoginDTO, UserInfoDTO } from '../../data/dtos/UserDTO'

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

  public loginUser = async ({ email, password }: UserLoginDTO): Promise<UserInfoDTO> => {
    const foundUser = await this.userRepository.findUserByEmail(email)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordValid) {
      throw Boom.badRequest('Wrong password.')
    }

    // Load building if user is admin
    let foundBuilding
    if (foundUser.role.name === UserRoleType.ADMIN) {
      foundBuilding = await this.officeBuildingRepository.findBuildingByAdminId(foundUser.id)
    }

    // Create new JWT token and assign it to user
    const token = jwt.sign({ user: foundUser.id }, config.auth.tokenSecret, { expiresIn: config.auth.tokenExpiration })
    const loggedInUser: UserInfoDTO = {
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      role: foundUser.role.name,
      buildingId: foundBuilding?.id,
      companyId: foundUser.company?.id,
      token
    }

    return loggedInUser
  }

  public getCurrentUser = async (userId: number): Promise<UserInfoDTO> => {
    const foundUser = await this.userRepository.findUserById(userId)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    // Load building if user is admin
    let foundBuilding
    if (foundUser.role.name === UserRoleType.ADMIN) {
      foundBuilding = await this.officeBuildingRepository.findBuildingByAdminId(foundUser.id)
    }

    const currentUser: UserInfoDTO = {
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      role: foundUser.role.name,
      buildingId: foundBuilding?.id,
      companyId: foundUser.company?.id
    }

    return currentUser
  }

  public forgotUserPassword = async (email: string, language: string): Promise<void> => {
    const foundUser = await this.userRepository.findUserByEmail(email)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    // Generate and save password token
    const generatedToken = uuidv4()
    foundUser.passwordToken = generatedToken
    await this.userRepository.saveUser(foundUser)

    await this.emailService.sendPasswordResetLink(email, generatedToken, language)
  }

  public resetUserPassword = async (token: string, password: string): Promise<UserInfoDTO> => {
    const foundUser = await this.userRepository.findUserByPasswordToken(token)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    foundUser.passwordToken = null
    foundUser.password = hashedPassword
    await this.userRepository.saveUser(foundUser)

    return this.loginUser({ email: foundUser.email, password })
  }
}

export default AuthService
