import TYPES from './types'
import AuthController from '../controllers/AuthController'
import CompaniesController from '../controllers/CompaniesController'
import ConsentFormsController from '../controllers/ConsentFormsController'
import { Repository } from 'typeorm'
import { Container, decorate, injectable } from 'inversify'
import { AuthService, AuthServiceInterface } from '../services/auth'
import { EmailService, EmailServiceInterface } from '../services/email'
import { CompanyService, CompanyServiceInterface } from '../services/company'
import { CompanyRepository, CompanyRepositoryInterface } from '../repositories/company'
import { ConsentFormService, ConsentFormServiceInterface } from '../services/consentForm'
import { ConsentFormRepository, ConsentFormRepositoryInterface } from '../repositories/consentForm'
import { OfficeBuildingRepository, OfficeBuildingRepositoryInterface } from '../repositories/officeBuilding'
import { UserRepository, UserRepositoryInterface } from '../repositories/user'

decorate(injectable(), Repository)
const container = new Container()

// Repositories
container.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<OfficeBuildingRepositoryInterface>(TYPES.OfficeBuildingRepository).to(OfficeBuildingRepository).inSingletonScope()
container.bind<CompanyRepositoryInterface>(TYPES.CompanyRepository).to(CompanyRepository).inSingletonScope()
container.bind<ConsentFormRepositoryInterface>(TYPES.ConsentFormRepository).to(ConsentFormRepository).inSingletonScope()

// Services
container.bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind<EmailServiceInterface>(TYPES.EmailService).to(EmailService).inSingletonScope()
container.bind<CompanyServiceInterface>(TYPES.CompanyService).to(CompanyService).inSingletonScope()
container.bind<ConsentFormServiceInterface>(TYPES.ConsentFormService).to(ConsentFormService).inSingletonScope()

// Controllers
container.bind(TYPES.Controller).to(AuthController)
container.bind(TYPES.Controller).to(CompaniesController)
container.bind(TYPES.Controller).to(ConsentFormsController)

export default container
