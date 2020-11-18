import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import OfficeBuildingServiceInterface from './OfficeBuildingServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/officeBuilding'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO, EmployeeInfoDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO } from '../../data/dtos/UserDTO'
import { InvitationInfoDTO } from '../../data/dtos/VisitDTO'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
class OfficeBuildingService implements OfficeBuildingServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface
  private readonly companyRepository: CompanyRepositoryInterface
  private readonly consentFormRepository: ConsentFormRepositoryInterface
  private readonly visitRepository: VisitRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository) officeBuildingRepository: OfficeBuildingRepositoryInterface,
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface,
    @inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.officeBuildingRepository = officeBuildingRepository
    this.companyRepository = companyRepository
    this.consentFormRepository = consentFormRepository
    this.visitRepository = visitRepository
  }

  public registerBuilding = async ({ admin, address }: OfficeBuildingRegisterDTO): Promise<void> => {
    const foundBuildingAdmin = await this.userRepository.findUserByEmail(admin.email)
    if (foundBuildingAdmin) {
      throw Boom.badRequest('Building admin already exists.')
    }

    const foundBuilding = await this.officeBuildingRepository.findBuildingByAddress(address)
    if (foundBuilding) {
      throw Boom.badRequest('Office building already exists with provided address.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(admin.password, salt)

    const securedAdminData = { ...admin, password: hashedPassword }

    await this.officeBuildingRepository.createBuilding(securedAdminData, address)
  }

  public getCompanies = async (buildingId: number): Promise<CompanyInfoDTO[]> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Office building does not exists.')
    }

    const foundCompanies = await this.companyRepository.findCompaniesByBuildingId(buildingId)
    const foundCompaniesInfo: CompanyInfoDTO[] = foundCompanies.map(company => {
      const { address, admin } = company

      return {
        id: company.id,
        name: company.name,
        registrationNumber: company.registrationNumber,
        address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
        createdAt: company.createdAt,
        adminName: `${admin.firstName} ${admin.lastName}`,
        adminEmail: admin.email,
        adminJoinedAt: admin.createdAt
      }
    })

    return foundCompaniesInfo
  }

  public registerCompany = async (buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Office building does not exists.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.admin.password, salt)

    const securedAdminData = { ...data.admin, password: hashedPassword }
    const companyData = { name: data.name, registrationNumber: data.registrationNumber }

    const createdCompany = await this.companyRepository.createCompany(buildingId, companyData, data.address, securedAdminData)

    const { address, admin } = createdCompany
    const createdCompanyInfo: CompanyInfoDTO = {
      id: createdCompany.id,
      name: createdCompany.name,
      registrationNumber: createdCompany.registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      createdAt: createdCompany.createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoinedAt: admin.createdAt
    }

    return createdCompanyInfo
  }

  public getConsentForms = async (buildingId: number): Promise<ConsentFormInfoDTO[]> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Office building does not exists.')
    }

    const consentForms = await this.consentFormRepository.findConsentFormsByBuildingId(buildingId)
    const consentFormsInfo: ConsentFormInfoDTO[] = consentForms.map(({ id, title, activeVersion, createdAt }) => ({
      id,
      title,
      activeVersion: activeVersion?.versionNumber ?? null,
      createdAt
    }))

    return consentFormsInfo
  }

  public createConsentForm = async (buildingId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Building does not exists')
    }

    const consentForm = await this.consentFormRepository.createGlobalConsentForm(buildingId, data.title, data.content)
    const consentFormInfo: ConsentFormInfoDTO = {
      id: consentForm.id,
      title: consentForm.title,
      activeVersion: null,
      createdAt: consentForm.createdAt
    }

    return consentFormInfo
  }

  public getReceptionists = async (buildingId: number): Promise<EmployeeInfoDTO[]> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Building does not exists')
    }

    const receptionists = await this.officeBuildingRepository.findBuildingEmployees(buildingId, UserRoleType.RECEPTIONIST)
    const receptionistsInfo: EmployeeInfoDTO[] = receptionists.map(({ id, firstName, lastName, email, createdAt }) => ({
      id,
      firstName,
      lastName,
      email,
      createdAt
    }))

    return receptionistsInfo
  }

  public createReceptionist = async (buildingId: number, data: UserRegisterDTO): Promise<EmployeeInfoDTO> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Building does not exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const securedReceptionistData = { ...data, password: hashedPassword }

    const receptionist = await this.officeBuildingRepository.createReceptionist(buildingId, securedReceptionistData)
    const receptionistInfo: EmployeeInfoDTO = {
      id: receptionist.id,
      firstName: receptionist.firstName,
      lastName: receptionist.lastName,
      email: receptionist.email,
      createdAt: receptionist.createdAt
    }

    return receptionistInfo
  }

  public updateReceptionist = async (
    buildingId: number,
    receptionistId: number,
    data: UserUpdateDTO
  ): Promise<EmployeeInfoDTO> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Building does not exists')
    }

    const foundReceptionist = await this.userRepository.findUserById(receptionistId)
    if (!foundReceptionist || foundReceptionist.officeBuilding.id !== foundBuilding.id) {
      throw Boom.notFound('Receptionist does not exist.')
    }

    const updatedReceptionist = await this.officeBuildingRepository.updateReceptionist(receptionistId, data)
    const updatedReceptionistInfo: EmployeeInfoDTO = {
      id: updatedReceptionist.id,
      firstName: updatedReceptionist.firstName,
      lastName: updatedReceptionist.lastName,
      email: updatedReceptionist.email,
      createdAt: updatedReceptionist.createdAt
    }

    return updatedReceptionistInfo
  }

  public getInvitations = async (buildingId: number): Promise<InvitationInfoDTO[]> => {
    const foundBuilding = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!foundBuilding) {
      throw Boom.notFound('Building does not exists')
    }

    const foundInvitations = await this.visitRepository.findVisitsByBuildingId(buildingId)
    const invitationsInfo: InvitationInfoDTO[] = foundInvitations.map(
      ({ id, company, businessHost, purpose, room, plannedEntry }) => ({
        id,
        companyName: company.name,
        businessHostName: `${businessHost.firstName} ${businessHost.lastName}`,
        purpose,
        room,
        plannedEntry
      })
    )

    return invitationsInfo
  }
}

export default OfficeBuildingService
