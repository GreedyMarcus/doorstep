import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import ConsentFormServiceInterface from './ConsentFormServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { ConsentFormInfoDTO } from 'server/data/dtos/ConsentFormDTO'

@injectable()
class ConsentFormService implements ConsentFormServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly consentFormRepository: ConsentFormRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.consentFormRepository = consentFormRepository
  }

  public getConsentFormsByBuildingAdminId = async (adminId: number): Promise<ConsentFormInfoDTO[]> => {
    const buildingAdmin = await this.userRepository.findUserById(adminId)
    if (!buildingAdmin) {
      throw Boom.badRequest('Building admin does not exist')
    }

    const consentForms = await this.consentFormRepository.findConsentFormsByBuildingAdminId(adminId)
    const consentFormsInfo: ConsentFormInfoDTO[] = consentForms.map(({ id, title, activeVersion, createdAt }) => ({
      id,
      title,
      activeVersion: activeVersion.versionNumber,
      createdAt
    }))

    return consentFormsInfo
  }
}

export default ConsentFormService