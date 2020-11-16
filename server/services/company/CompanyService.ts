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
import { CompanyUpdateDTO, CompanyInfoDTO, CompanyHostInfoDTO, CompanyRegisterConfigDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO, GuestUserRegisterDTO } from '../../data/dtos/UserDTO'
import { VisitInfoDTO, VisitCreateDTO, PlannedVisitInfoDTO } from '../../data/dtos/VisitDTO'
import { VisitPurpose } from '../../data/enums/VisitPurpose'

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

  public getVisits = async (companyId: number): Promise<VisitInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
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

  public createVisit = async (companyId: number, data: VisitCreateDTO): Promise<VisitInfoDTO> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const foundBusinessHost = await this.userRepository.findUserById(data.businessHostId)
    if (!foundBusinessHost) {
      throw Boom.notFound('Business host does not exist.')
    }

    // Check for email duplications
    const emails = data.invitedGuests.map(guest => guest.email)
    const uniqueEmails = new Set(emails)
    if (emails.length !== uniqueEmails.size) {
      throw Boom.badRequest('Duplicated guest email.')
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

    return visitInfo
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
    if (!foundBusinessHost || foundBusinessHost.company.id !== foundCompany.id) {
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

  public getPlannedVisits = async (companyId: number, hostId: number): Promise<PlannedVisitInfoDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
    }

    const foundBusinessHost = await this.userRepository.findUserById(hostId)
    if (!foundBusinessHost || foundBusinessHost.company.id !== foundCompany.id) {
      throw Boom.notFound('Business host does not exist.')
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

  public getAvailableGuestUsers = async (companyId: number): Promise<GuestUserRegisterDTO[]> => {
    const foundCompany = await this.companyRepository.findCompanyById(companyId)
    if (!foundCompany) {
      throw Boom.notFound('Company does not exist.')
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
