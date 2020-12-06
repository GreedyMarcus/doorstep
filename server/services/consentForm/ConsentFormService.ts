import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import ERROR from '../../utils/error'
import ConsentFormServiceInterface from './ConsentFormServiceInterface'
import { inject, injectable } from 'inversify'
import { ConsentFormRepositoryInterface } from '../../repositories/consentForm'
import { ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'

/**
 * Service that handles consent form business logic.
 */
@injectable()
class ConsentFormService implements ConsentFormServiceInterface {
  private readonly consentFormRepository: ConsentFormRepositoryInterface

  constructor(@inject(TYPES.ConsentFormRepository) consentFormRepository: ConsentFormRepositoryInterface) {
    this.consentFormRepository = consentFormRepository
  }

  public getConsentFormById = async (formId: number): Promise<ConsentFormDetailsDTO> => {
    const foundConsentForm = await this.consentFormRepository.findConsentFormById(formId)
    if (!foundConsentForm) {
      throw Boom.notFound(ERROR.CONSENT_FORM_DOES_NOT_EXIST)
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
      throw Boom.notFound(ERROR.CONSENT_FORM_DOES_NOT_EXIST)
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
      throw Boom.notFound(ERROR.CONSENT_FORM_DOES_NOT_EXIST)
    }

    const foundConsentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!foundConsentFormVersion) {
      throw Boom.notFound(ERROR.CONSENT_FORM_VERSION_DOES_NOT_EXIST)
    }

    const versionBelongsToForm = foundConsentForm.versions.findIndex(version => version.id === foundConsentFormVersion.id)
    if (versionBelongsToForm === -1) {
      throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_DOES_NOT_BELONG_TO_CONSENT_FORM)
    }

    // Check if this consent form version is still editable
    if (foundConsentForm.activeVersion) {
      if (foundConsentForm.activeVersion.versionNumber === foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_ACTIVATED)
      }

      if (foundConsentForm.activeVersion.versionNumber > foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_ACTIVATED_NEWER)
      }
    }

    if (foundConsentForm.versions.length > foundConsentFormVersion.versionNumber) {
      throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_EXISTS_NEWER)
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
      throw Boom.notFound(ERROR.CONSENT_FORM_DOES_NOT_EXIST)
    }

    const foundConsentFormVersion = await this.consentFormRepository.findConsentFormVersionById(versionId)
    if (!foundConsentFormVersion) {
      throw Boom.notFound(ERROR.CONSENT_FORM_VERSION_DOES_NOT_EXIST)
    }

    const versionBelongsToForm = foundConsentForm.versions.find(version => version.id === foundConsentFormVersion.id)
    if (!versionBelongsToForm) {
      throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_DOES_NOT_BELONG_TO_CONSENT_FORM)
    }

    // Check if this consent form version can get activated
    if (foundConsentForm.activeVersion) {
      if (foundConsentForm.activeVersion.versionNumber === foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_ACTIVATED)
      }

      if (foundConsentForm.activeVersion.versionNumber > foundConsentFormVersion.versionNumber) {
        throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_ACTIVATED_NEWER)
      }
    }

    if (foundConsentForm.versions.length > foundConsentFormVersion.versionNumber) {
      throw Boom.badRequest(ERROR.CONSENT_FORM_VERSION_ALREADY_EXISTS_NEWER)
    }

    await this.consentFormRepository.updateActiveConsentFormVersion(formId, versionId)
  }
}

export default ConsentFormService
