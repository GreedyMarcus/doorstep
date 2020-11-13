import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import ConsentFormServiceInterface from './ConsentFormServiceInterface'
import { inject, injectable } from 'inversify'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'

@injectable()
class ConsentFormService implements ConsentFormServiceInterface {
  private readonly consentFormRepository: ConsentFormRepositoryInterface

  constructor(@inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface) {
    this.consentFormRepository = consentFormRepository
  }

  public getConsentFormById = async (formId: number): Promise<ConsentFormDetailsDTO> => {
    const foundConsentForm = await this.consentFormRepository.findConsentFormById(formId)
    if (!foundConsentForm) {
      throw Boom.notFound('Consent form does not exist.')
    }

    const consentFormDetails: ConsentFormDetailsDTO = {
      id: foundConsentForm.id,
      title: foundConsentForm.title,
      type: foundConsentForm.type,
      activeVersion: foundConsentForm.activeVersion,
      createdAt: foundConsentForm.createdAt,
      versions: foundConsentForm.versions
    }

    return consentFormDetails
  }

  public createConsentFormVersion = async (formId: number, content: string): Promise<ConsentFormVersionInfoDTO> => {
    const foundConsentForm = await this.consentFormRepository.findConsentFormById(formId)
    if (!foundConsentForm) {
      throw Boom.notFound('Consent form does not exist.')
    }

    // Calculate next consent form version number
    const nextVersionNum = foundConsentForm.versions.length + 1

    const createdVersion = await this.consentFormRepository.createConsentFormVersion(formId, content, nextVersionNum)
    const createdVersionInfo: ConsentFormVersionInfoDTO = {
      id: createdVersion.id,
      content: createdVersion.content,
      versionNumber: createdVersion.versionNumber
    }

    return createdVersionInfo
  }

  public updateConsentFormVersion = async (
    formId: number,
    versionId: number,
    content: string
  ): Promise<ConsentFormVersionInfoDTO> => {
    const foundConsentForm = await this.consentFormRepository.findConsentFormById(formId)
    if (!foundConsentForm) {
      throw Boom.notFound('Consent form does not exist.')
    }

    const foundConsentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!foundConsentFormVersion) {
      throw Boom.notFound('Consent form version does not exist.')
    }

    const versionBelongsToForm = foundConsentForm.versions.findIndex(version => version.id === foundConsentFormVersion.id)
    if (versionBelongsToForm === -1) {
      throw Boom.badRequest('Consent form version does not belong to the provided consent form.')
    }

    // Check if this consent form version is still editable
    if (foundConsentForm.activeVersion) {
      if (foundConsentForm.activeVersion.versionNumber === foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot edit consent form version content because it is already activated.')
      }

      if (foundConsentForm.activeVersion.versionNumber > foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot edit consent form version content because a newer version is already activated.')
      }
    }

    if (foundConsentForm.versions.length > foundConsentFormVersion.versionNumber) {
      throw Boom.badRequest('Cannot edit consent form version content because a newer version is already exists.')
    }

    const updatedVersion = await this.consentFormRepository.updateConsentFormVersion(versionId, content)
    const updatedVersionInfo: ConsentFormVersionInfoDTO = {
      id: updatedVersion.id,
      content: updatedVersion.content,
      versionNumber: updatedVersion.versionNumber
    }

    return updatedVersionInfo
  }

  public activateConsentFormVersion = async (formId: number, versionId: number): Promise<void> => {
    const foundConsentForm = await this.consentFormRepository.findConsentFormById(formId)
    if (!foundConsentForm) {
      throw Boom.notFound('Consent form does not exist.')
    }

    const foundConsentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!foundConsentFormVersion) {
      throw Boom.notFound('Consent form version does not exist.')
    }

    const versionBelongsToForm = foundConsentForm.versions.find(version => version.id === foundConsentFormVersion.id)
    if (!versionBelongsToForm) {
      throw Boom.badRequest('Consent form version does not belong to the provided consent form.')
    }

    // Check if this consent form version can get activated
    if (foundConsentForm.activeVersion) {
      if (foundConsentForm.activeVersion.versionNumber === foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot activate consent form version because it is already activated.')
      }

      if (foundConsentForm.activeVersion.versionNumber > foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest('Cannot activate consent form version because a newer version is already activated.')
      }
    }

    if (foundConsentForm.versions.length > foundConsentFormVersion.versionNumber) {
      throw Boom.badRequest('Cannot activate consent form version because a newer version is already exists.')
    }

    await this.consentFormRepository.updateActiveConsentFormVersion(formId, versionId)
  }
}

export default ConsentFormService
