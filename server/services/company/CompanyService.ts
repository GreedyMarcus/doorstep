import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import CompanyServiceInterface from './CompanyServiceInterface'
import { inject, injectable } from 'inversify'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { UserRepositoryInterface } from '../../repositories/user'
import { UserRoleType } from '../../data/enums/UserRoleType'
import {
  CompanyUpdateDTO,
  CompanyInfoDTO,
  CompanyVisitInfoDTO,
  CompanyHostInfoDTO,
  CompanyRegisterConfigDTO
} from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO } from '../../data/dtos/UserDTO'

@injectable()
class CompanyService implements CompanyServiceInterface {
  private readonly companyRepository: CompanyRepositoryInterface
  private readonly visitRepository: VisitRepositoryInterface
  private readonly consentFormRepository: ConsentFormRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface,
    @inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface
  ) {
    this.companyRepository = companyRepository
    this.visitRepository = visitRepository
    this.consentFormRepository = consentFormRepository
    this.userRepository = userRepository
  }

  public updateCompany = async (companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    // Check if admin changed
    let adminData
    if (data.admin) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(data.admin.password, salt)

      adminData = { ...data.admin, password: hashedPassword }
    }

    const companyData = {
      id: data.id,
      name: data.name,
      registrationNumber: data.registrationNumber
    }

    const updatedCompany = await this.companyRepository.updateCompany(companyData, data.address, adminData)

    const { address, admin } = updatedCompany
    const updatedCompanyInfo: CompanyInfoDTO = {
      id: updatedCompany.id,
      name: updatedCompany.name,
      registrationNumber: updatedCompany.registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      createdAt: updatedCompany.createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoinedAt: admin.createdAt
    }

    return updatedCompanyInfo
  }

  public getVisits = async (companyId: number): Promise<CompanyVisitInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const foundVisits = await this.visitRepository.findVisitsByCompanyId(companyId)
    const visitsInfo: CompanyVisitInfoDTO[] = foundVisits.map(({ id, businessHost, purpose, room, plannedEntry }) => ({
      id,
      businessHostName: `${businessHost.firstName} ${businessHost.lastName}`,
      purpose,
      room,
      plannedEntry
    }))

    return visitsInfo
  }

  public getBusinessHosts = async (companyId: number): Promise<CompanyHostInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const businessHosts = await this.companyRepository.findCompanyEmployees(companyId, UserRoleType.BUSINESS_HOST)
    const businessHostsInfo: CompanyHostInfoDTO[] = businessHosts.map(({ id, firstName, lastName, email, createdAt }) => ({
      id,
      firstName,
      lastName,
      email,
      createdAt
    }))

    return businessHostsInfo
  }

  public createBusinessHost = async (companyId: number, data: UserRegisterDTO): Promise<CompanyHostInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const securedBusinessHostData = { ...data, password: hashedPassword }

    const businessHost = await this.companyRepository.createBusinessHost(companyId, securedBusinessHostData)
    const businessHostInfo: CompanyHostInfoDTO = {
      id: businessHost.id,
      firstName: businessHost.firstName,
      lastName: businessHost.lastName,
      email: businessHost.email,
      createdAt: businessHost.createdAt
    }

    return businessHostInfo
  }

  public updateBusinessHost = async (companyId: number, hostId: number, data: UserUpdateDTO): Promise<CompanyHostInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const foundBusinessHost = await this.userRepository.findUserById(hostId)
    if (!foundBusinessHost) {
      throw Boom.notFound('Business host does not exist.')
    }

    const updatedBusinessHost = await this.companyRepository.updateBusinessHost(hostId, data)
    const updatedBusinessHostInfo: CompanyHostInfoDTO = {
      id: updatedBusinessHost.id,
      firstName: updatedBusinessHost.firstName,
      lastName: updatedBusinessHost.lastName,
      email: updatedBusinessHost.email,
      createdAt: updatedBusinessHost.createdAt
    }

    return updatedBusinessHostInfo
  }

  public getConsentForms = async (companyId: number): Promise<ConsentFormInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const foundConsentForms = await this.consentFormRepository.findConsentFormsByCompanyId(companyId)
    const consentFormsInfo: ConsentFormInfoDTO[] = foundConsentForms.map(({ id, title, activeVersion, createdAt }) => ({
      id,
      title,
      activeVersion: activeVersion?.versionNumber,
      createdAt
    }))

    return consentFormsInfo
  }

  public createConsentForm = async (companyId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const createdConsentForm = await this.consentFormRepository.createLocalConsentForm(companyId, data.title, data.content)
    const consentFormInfo: ConsentFormInfoDTO = {
      id: createdConsentForm.id,
      title: createdConsentForm.title,
      activeVersion: null,
      createdAt: createdConsentForm.createdAt
    }

    return consentFormInfo
  }

  public getCompanyConfig = async (companyId: number): Promise<CompanyRegisterConfigDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const registerConfigInfo: CompanyRegisterConfigDTO = {
      storeNationality: foundCompany.registerConfig.storeNationality,
      storeAddress: foundCompany.registerConfig.storeAddress,
      storePhoneNumber: foundCompany.registerConfig.storePhoneNumber,
      storeBirthplace: foundCompany.registerConfig.storeBirthplace,
      storeBirthDate: foundCompany.registerConfig.storeBirthDate,
      storeMotherName: foundCompany.registerConfig.storeMotherName,
      storeCompany: foundCompany.registerConfig.storeCompany,
      registerGuestCard: foundCompany.registerConfig.registerGuestCard,
      trackActualExit: foundCompany.registerConfig.trackActualExit
    }

    return registerConfigInfo
  }

  public updateCompanyConfig = async (companyId: number, data: CompanyRegisterConfigDTO): Promise<void> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    await this.companyRepository.updateCompanyConfig(companyId, data)
  }
}

export default CompanyService
