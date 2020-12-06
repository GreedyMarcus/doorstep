import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import ERROR from '../../utils/error'
import CompanyServiceInterface from './CompanyServiceInterface'
import { inject, injectable } from 'inversify'
import { EmailServiceInterface } from '../../services/email'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { UserRepositoryInterface } from '../../repositories/user'
import { UserRoleType } from '../../data/enums/UserRoleType'
import { CompanyUpdateDTO, CompanyInfoDTO, EmployeeInfoDTO, CompanyRegisterConfigDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO, GuestUserRegisterDTO } from '../../data/dtos/UserDTO'
import { VisitInfoDTO, VisitCreateDTO, PlannedVisitInfoDTO, VisitNotificationDTO } from '../../data/dtos/VisitDTO'
import { VisitPurpose } from '../../data/enums/VisitPurpose'

/**
 * Service that handles company business logic.
 */
@injectable()
class CompanyService implements CompanyServiceInterface {
  private readonly emailService: EmailServiceInterface
  private readonly companyRepository: CompanyRepositoryInterface
  private readonly visitRepository: VisitRepositoryInterface
  private readonly consentFormRepository: ConsentFormRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(
    @inject(TYPES.EmailService) emailService: EmailServiceInterface,
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface,
    @inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface
  ) {
    this.emailService = emailService
    this.companyRepository = companyRepository
    this.visitRepository = visitRepository
    this.consentFormRepository = consentFormRepository
    this.userRepository = userRepository
  }

  public updateCompany = async (companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
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

  public getVisits = async (companyId: number): Promise<VisitInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const foundVisits = await this.visitRepository.findVisitsByCompanyId(companyId)
    const visitsInfo: VisitInfoDTO[] = foundVisits.map(({ id, businessHost, purpose, room, plannedEntry }) => ({
      id,
      businessHostName: `${businessHost.firstName} ${businessHost.lastName}`,
      purpose,
      room,
      plannedEntry
    }))

    return visitsInfo
  }

  public createVisit = async (companyId: number, data: VisitCreateDTO, language: string): Promise<VisitInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const foundBusinessHost = await this.userRepository.findUserById(data.businessHostId)
    if (!foundBusinessHost) {
      throw Boom.notFound(ERROR.BUSINESS_HOST_DOES_NOT_EXIST)
    }

    // Check for email duplications
    const emails = data.invitedGuests.map(guest => guest.email)
    const uniqueEmails = new Set(emails)
    if (emails.length !== uniqueEmails.size) {
      throw Boom.badRequest(ERROR.DUPLICATED_GUEST_EMAIL)
    }

    // Generate hashed password for all invited guests
    const salt = await bcrypt.genSalt(10)

    const guestDataPromises: Promise<UserRegisterDTO>[] = data.invitedGuests.map(guest => {
      return new Promise(async resolve => {
        const generatedPassword = Math.random().toString(36).slice(2)
        const hashedPassword = await bcrypt.hash(generatedPassword, salt)

        return resolve({ ...guest, password: hashedPassword })
      })
    })

    // Get visit data
    const securedGuestData = await Promise.all(guestDataPromises)
    const hostId = data.businessHostId
    const visitData = {
      purpose: data.purpose as VisitPurpose,
      room: data.room,
      plannedEntry: data.plannedEntry
    }

    const visit = await this.visitRepository.createVisit(companyId, hostId, visitData, securedGuestData)
    const visitInfo: VisitInfoDTO = {
      id: visit.id,
      businessHostName: `${visit.businessHost.firstName} ${visit.businessHost.lastName}`,
      purpose: visit.purpose,
      room: visit.room,
      plannedEntry: visit.plannedEntry
    }

    // Send notification email about visit
    const { country, zipCode, city, streetAddress } = foundCompany.officeBuilding.address
    const visitNotification: VisitNotificationDTO = {
      companyName: foundCompany.name,
      buildingAddress: `${country}, ${zipCode}, ${city}, ${streetAddress}`,
      businessHost: {
        fullName: `${foundBusinessHost.firstName} ${foundBusinessHost.lastName}`,
        email: foundBusinessHost.email
      },
      purpose: visit.purpose,
      room: visit.room,
      plannedEntry: visit.plannedEntry
    }

    await this.emailService.sendVisitNotification(emails, visitNotification, language)

    return visitInfo
  }

  public getBusinessHosts = async (companyId: number): Promise<EmployeeInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const businessHosts = await this.companyRepository.findCompanyEmployees(companyId, UserRoleType.BUSINESS_HOST)
    const businessHostsInfo: EmployeeInfoDTO[] = businessHosts.map(({ id, firstName, lastName, email, createdAt }) => ({
      id,
      firstName,
      lastName,
      email,
      createdAt
    }))

    return businessHostsInfo
  }

  public createBusinessHost = async (companyId: number, data: UserRegisterDTO): Promise<EmployeeInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const securedBusinessHostData = { ...data, password: hashedPassword }

    const businessHost = await this.companyRepository.createBusinessHost(companyId, securedBusinessHostData)
    const businessHostInfo: EmployeeInfoDTO = {
      id: businessHost.id,
      firstName: businessHost.firstName,
      lastName: businessHost.lastName,
      email: businessHost.email,
      createdAt: businessHost.createdAt
    }

    return businessHostInfo
  }

  public updateBusinessHost = async (companyId: number, hostId: number, data: UserUpdateDTO): Promise<EmployeeInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const foundBusinessHost = await this.userRepository.findUserById(hostId)
    if (!foundBusinessHost || foundBusinessHost.company.id !== foundCompany.id) {
      throw Boom.notFound(ERROR.BUSINESS_HOST_DOES_NOT_EXIST)
    }

    const updatedBusinessHost = await this.companyRepository.updateBusinessHost(hostId, data)
    const updatedBusinessHostInfo: EmployeeInfoDTO = {
      id: updatedBusinessHost.id,
      firstName: updatedBusinessHost.firstName,
      lastName: updatedBusinessHost.lastName,
      email: updatedBusinessHost.email,
      createdAt: updatedBusinessHost.createdAt
    }

    return updatedBusinessHostInfo
  }

  public getPlannedVisits = async (companyId: number, hostId: number): Promise<PlannedVisitInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const foundBusinessHost = await this.userRepository.findUserById(hostId)
    if (!foundBusinessHost || foundBusinessHost.company.id !== foundCompany.id) {
      throw Boom.notFound(ERROR.BUSINESS_HOST_DOES_NOT_EXIST)
    }

    const foundPlannedVisits = await this.visitRepository.findPlannedVisitsByHostId(hostId)
    const plannedVisitsInfo: PlannedVisitInfoDTO[] = foundPlannedVisits.map(({ id, purpose, room, plannedEntry }) => ({
      id,
      purpose,
      room,
      plannedEntry
    }))

    return plannedVisitsInfo
  }

  public getConsentForms = async (companyId: number): Promise<ConsentFormInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
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
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
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
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
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
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    await this.companyRepository.updateCompanyConfig(companyId, data)
  }

  public getAvailableGuestUsers = async (companyId: number): Promise<GuestUserRegisterDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST)
    }

    const guestUsers = await this.companyRepository.findCompanyGuestUsers(companyId)
    const guestUsersData: GuestUserRegisterDTO[] = guestUsers.map(user => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }))

    return guestUsersData
  }
}

export default CompanyService
