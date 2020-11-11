import { ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'

interface ConsentFormServiceInterface {
  /**
   * Returns a consent form specified by id.
   */
  getConsentFormById(formId: number): Promise<ConsentFormDetailsDTO>

  /**
   * Creates a new consent form version.
   *
   * @param content - the textual content of the consent form version
   */
  createConsentFormVersion(formId: number, content: string): Promise<ConsentFormVersionInfoDTO>

  /**
   * Updates the specified consent form version's content.
   *
   * @param content - the textual content of the consent form version
   */
  updateConsentFormVersion(formId: number, versionId: number, content: string): Promise<ConsentFormVersionInfoDTO>

  /**
   * Actives the specified consent form version,
   * therefore updates the acceptable version of the consent form.
   */
  activateConsentFormVersion(formId: number, versionId: number): Promise<void>
}

export default ConsentFormServiceInterface
