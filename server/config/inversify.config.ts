import TYPES from './types'
import AuthController from '../controllers/AuthController'
import { Repository } from 'typeorm'
import { Container, decorate, injectable } from 'inversify'
import { AuthService, AuthServiceInterface } from '../services/auth'
import { EmailService, EmailServiceInterface } from '../services/email'
import { UserRepository, UserRepositoryInterface } from '../repositories/user'
import { OfficeBuildingRepository, OfficeBuildingRepositoryInterface } from '../repositories/office-building'

decorate(injectable(), Repository)
const container = new Container()

// Repositories
container.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<OfficeBuildingRepositoryInterface>(TYPES.OfficeBuildingRepository).to(OfficeBuildingRepository).inSingletonScope()

// Services
container.bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind<EmailServiceInterface>(TYPES.EmailService).to(EmailService).inSingletonScope()

// Controllers
container.bind(TYPES.Controller).to(AuthController)

export default container
