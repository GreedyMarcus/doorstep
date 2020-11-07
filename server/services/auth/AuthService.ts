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
import { UserLoginDTO, UserInfoDTO } from '../../data/dtos/UserDTO'

@injectable()
class AuthService implements AuthServiceInterface {
  private readonly emailService: EmailServiceInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(
    @inject(TYPES.EmailService) emailService: EmailServiceInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface
  ) {
    this.emailService = emailService
    this.userRepository = userRepository
  }

  public loginUser = async ({ email, password }: UserLoginDTO): Promise<UserInfoDTO> => {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw Boom.badRequest('Invalid password')
    }

    // Create new JWT token and assign it to user
    const token = jwt.sign({ user: user.id }, config.auth.tokenSecret, { expiresIn: config.auth.tokenExpiration })
    const loggedInUser: UserInfoDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      token
    }

    return loggedInUser
  }

  public getCurrentUser = async (userId: number): Promise<UserInfoDTO> => {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    const currentUser: UserInfoDTO = {
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
    const generatedToken = uuidv4()
    user.passwordToken = generatedToken
    await this.userRepository.saveUser(user)

    // Send password reset link to user via email
    await this.emailService.sendPasswordResetLink(email, generatedToken, language)
  }

  public resetUserPassword = async (token: string, password: string): Promise<UserInfoDTO> => {
    const user = await this.userRepository.findUserByPasswordToken(token)
    if (!user) {
      throw Boom.badRequest('User does not exist')
    }

    // Hash the new password and reset password token
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.passwordToken = null
    user.password = hashedPassword
    await this.userRepository.saveUser(user)

    // Login user
    return this.loginUser({ email: user.email, password })
  }
}

export default AuthService
