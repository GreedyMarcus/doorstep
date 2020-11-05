import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import ConsentFormServiceInterface from './ConsentFormServiceInterface'
import { inject, injectable } from 'inversify'
import { ConsentFormType } from '../../data/enums/ConsentFormType'
import { UserRepositoryInterface } from '../../repositories/user'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { ConsentFormInfoDTO, ConsentFormCreateDTO, ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'

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
      activeVersion: activeVersion?.versionNumber ?? null,
      createdAt
    }))

    return consentFormsInfo
  }

  public getConsentFormById = async (consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentFormDetailsDTO> => {
    const consentForm = await this.consentFormRepository.findConsentFormById(consentFormId, consentFormType)
    if (!consentForm) {
      throw Boom.badRequest('Consent form does not exist')
    }

    const consentFormDetails: ConsentFormDetailsDTO = {
      id: consentForm.id,
      title: consentForm.title,
      type: consentForm.type,
      activeVersion: consentForm.activeVersion,
      createdAt: consentForm.createdAt,
      versions: consentForm.versions
    }

    return consentFormDetails
  }

  public createGlobalConsentForm = async ({ title, content }: ConsentFormCreateDTO, adminId: number): Promise<ConsentFormInfoDTO> => {
    const buildingAdmin = await this.userRepository.findUserById(adminId)
    if (!buildingAdmin) {
      throw Boom.badRequest('Building admin does not exist')
    }

    const globalConsentForm = await this.consentFormRepository.createGlobalConsentForm(title, content, adminId)
    const globalConsentFormInfo: ConsentFormInfoDTO = {
      id: globalConsentForm.id,
      title: globalConsentForm.title,
      activeVersion: null,
      createdAt: globalConsentForm.createdAt
    }

    return globalConsentFormInfo
  }

  public createGlobalConsentFormVersion = async (consentFormId: number, versionContent: string): Promise<ConsentFormVersionInfoDTO> => {
    const consentForm = await this.consentFormRepository.findConsentFormById(consentFormId, ConsentFormType.GLOBAL)
    if (!consentForm) {
      throw Boom.badRequest('Consent form does not exist')
    }

    // Calculate next consent form version number
    const nextVersionNum = consentForm.versions.length + 1

    const createdVersion = await this.consentFormRepository.createGlobalConsentFormVersion(consentFormId, versionContent, nextVersionNum)
    const createdVersionInfo: ConsentFormVersionInfoDTO = {
      id: createdVersion.id,
      content: createdVersion.content,
      versionNumber: createdVersion.versionNumber
    }

    return createdVersionInfo
  }

  public updateConsentFormVersion = async (formId: number, versionId: number, content: string): Promise<ConsentFormVersionInfoDTO> => {
    const consentForm = await this.consentFormRepository.findConsentFormById(formId, ConsentFormType.GLOBAL)
    if (!consentForm) {
      throw Boom.badRequest('Consent form does not exist')
    }

    const consentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!consentFormVersion) {
      throw Boom.badRequest('Consent form version does not exist')
    }

    const versionBelongsToForm = consentForm.versions.find(version => version.id === consentFormVersion.id)
    if (!versionBelongsToForm) {
      throw Boom.badRequest('Consent form version does not belong to the provided consent form')
    }

    // Check if this consent form version is still editable
    if (consentForm.activeVersion) {
      if (consentForm.activeVersion.versionNumber === consentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot edit consent form version content because it is already activated')
      }

      if (consentForm.activeVersion.versionNumber > consentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot edit consent form version content because a newer version is already activated')
      }
    }

    if (consentForm.versions.length > consentFormVersion.versionNumber) {
      throw Boom.badRequest('Cannot edit consent form version content because a newer version is already exists')
    }

    const updatedVersion = await this.consentFormRepository.updateConsentFormVersion(versionId, content)
    const updatedVersionInfo: ConsentFormVersionInfoDTO = {
      id: updatedVersion.id,
      content: updatedVersion.content,
      versionNumber: updatedVersion.versionNumber
    }

    return updatedVersionInfo
  }

  public activateConsentFormVersion = async (consentFormId: number, versionId: number): Promise<void> => {
    const consentForm = await this.consentFormRepository.findConsentFormById(consentFormId, ConsentFormType.GLOBAL)
    if (!consentForm) {
      throw Boom.badRequest('Consent form does not exist')
    }

    const consentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!consentFormVersion) {
      throw Boom.badRequest('Consent form version does not exist')
    }

    const versionBelongsToForm = consentForm.versions.find(version => version.id === consentFormVersion.id)
    if (!versionBelongsToForm) {
      throw Boom.badRequest('Consent form version does not belong to the provided consent form')
    }

    // Check if this consent form version can get activated
    if (consentForm.activeVersion) {
      if (consentForm.activeVersion.versionNumber === consentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot activate consent form version because it is already activated')
      }

      if (consentForm.activeVersion.versionNumber > consentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot activate consent form version because a newer version is already activated')
      }
    }

    if (consentForm.versions.length > consentFormVersion.versionNumber) {
      throw Boom.badRequest('Cannot activate consent form version because a newer version is already exists')
    }

    await this.consentFormRepository.updateActiveConsentFormVersion(consentFormId, consentForm.type, versionId)
  }
}

export default ConsentFormService
