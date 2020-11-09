import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import CompanyServiceInterface from './CompanyServiceInterface'
import { inject, injectable } from 'inversify'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO } from '../../data/dtos/CompanyDTO'

@injectable()
class CompanyService implements CompanyServiceInterface {
  private readonly companyRepository: CompanyRepositoryInterface
  private readonly visitRepository: VisitRepositoryInterface

  constructor(
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface
  ) {
    this.companyRepository = companyRepository
    this.visitRepository = visitRepository
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
}

export default CompanyService
