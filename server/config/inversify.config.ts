import TYPES from './types'
import AuthController from '../controllers/AuthController'
import OfficeBuildingsController from '../controllers/OfficeBuildingsController'
import CompaniesController from '../controllers/CompaniesController'
import ConsentFormsController from '../controllers/ConsentFormsController'
import { Repository } from 'typeorm'
import { Container, decorate, injectable } from 'inversify'
import { AuthService, AuthServiceInterface } from '../services/auth'
import { EmailService, EmailServiceInterface } from '../services/email'
import { OfficeBuildingService, OfficeBuildingServiceInterface } from '../services/officeBuilding'
import { CompanyService, CompanyServiceInterface } from '../services/company'
import { ConsentFormService, ConsentFormServiceInterface } from '../services/consentForm'
import { UserRepository, UserRepositoryInterface } from '../repositories/user'
import { OfficeBuildingRepository, OfficeBuildingRepositoryInterface } from '../repositories/officeBuilding'
import { CompanyRepository, CompanyRepositoryInterface } from '../repositories/company'
import { ConsentFormRepository, ConsentFormRepositoryInterface } from '../repositories/consentForm'

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
container.bind<OfficeBuildingServiceInterface>(TYPES.OfficeBuildingService).to(OfficeBuildingService).inSingletonScope()
container.bind<CompanyServiceInterface>(TYPES.CompanyService).to(CompanyService).inSingletonScope()
container.bind<ConsentFormServiceInterface>(TYPES.ConsentFormService).to(ConsentFormService).inSingletonScope()

// Controllers
container.bind(TYPES.Controller).to(AuthController)
container.bind(TYPES.Controller).to(OfficeBuildingsController)
container.bind(TYPES.Controller).to(CompaniesController)
container.bind(TYPES.Controller).to(ConsentFormsController)

export default container
