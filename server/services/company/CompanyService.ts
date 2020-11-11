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
import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO, CompanyHostInfoDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'
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
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
    }

    // Check if admin changed
    let companyAdmin
    if (data.admin) {
      // Hash company admin password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(data.admin.password, salt)

      companyAdmin = { ...data.admin, password: hashedPassword }
    }

    // Save company changes with optional admin data
    const { id, name, registrationNumber, address } = data

    const updatedCompany = await this.companyRepository.updateCompany({ id, name, registrationNumber }, address, companyAdmin)
    if (!updatedCompany) {
      throw Boom.internal('Could not update company')
    }

    const { createdAt, admin } = updatedCompany
    const updatedCompanyInfo: CompanyInfoDTO = {
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoinedAt: admin.createdAt
    }

    return updatedCompanyInfo
  }

  public getVisits = async (companyId: number): Promise<CompanyVisitInfoDTO[]> => {
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
    }

    const visits = await this.visitRepository.findVisitsByCompanyId(companyId)
    const visitsInfo: CompanyVisitInfoDTO[] = visits.map(({ id, businessHost, purpose, room, plannedEntry }) => ({
      id,
      businessHostName: `${businessHost.firstName} ${businessHost.lastName}`,
      purpose,
      room,
      plannedEntry
    }))

    return visitsInfo
  }

  public getBusinessHosts = async (companyId: number): Promise<CompanyHostInfoDTO[]> => {
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
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
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
    }

    // Hash company business host password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    // Save business host
    const businessHost = await this.companyRepository.createBusinessHost(companyId, { ...data, password: hashedPassword })
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
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
    }

    const businessHost = await this.userRepository.findUserById(hostId)
    if (!businessHost) {
      throw Boom.badRequest('Business host does not exist')
    }

    // Update business host
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
    const company = await this.companyRepository.findCompanyById(companyId)
    if (!company) {
      throw Boom.badRequest('Company does not exist')
    }

    // const consentForms = await this.companyRepository.find(companyId, UserRoleType.BUSINESS_HOST)
    const consentForms = await this.consentFormRepository.findConsentFormsByCompanyId(companyId)
    const consentFormsInfo: ConsentFormInfoDTO[] = consentForms.map(({ id, title, activeVersion, createdAt }) => ({
      id,
      title,
      activeVersion: activeVersion?.versionNumber,
      createdAt
    }))

    return consentFormsInfo
  }
}

export default CompanyService
