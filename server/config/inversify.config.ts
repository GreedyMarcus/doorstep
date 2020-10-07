import { Repository } from 'typeorm'
import { Container, decorate, injectable } from 'inversify'
import { AuthService, AuthServiceInterface } from '../services/auth'
import { UserRepository, UserRepositoryInterface } from '../repositories/user'
import { OfficeBuildingRepository, OfficeBuildingRepositoryInterface } from '../repositories/office-building'
import AuthController from '../controllers/AuthController'
import TYPES from './types'

decorate(injectable(), Repository)
const container = new Container()

// Repositories
container.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<OfficeBuildingRepositoryInterface>(TYPES.OfficeBuildingRepository).to(OfficeBuildingRepository).inSingletonScope()

// Services
container.bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService).inSingletonScope()

// Controllers
container.bind(TYPES.Controller).to(AuthController)

export default container
