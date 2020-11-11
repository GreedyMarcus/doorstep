import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'

interface ConsentFormRepositoryInterface {
  /**
   * Returns the consent form that has the specified id.
   */
  findConsentFormById(formId: number): Promise<ConsentForm>

  /**
   * Returns all consent forms that has the specified office building id.
   */
  findConsentFormsByBuildingId(buildingId: number): Promise<ConsentForm[]>

  /**
   * Returns the consent form version that has the specified id.
   */
  findConsentFormVersionById(versionId: number): Promise<ConsentFormVersion>

  /**
   * Creates new global consent form with the provided data in the specified office building.
   */
  createGlobalConsentForm(buildingId: number, title: string, content: string): Promise<ConsentForm>

  /**
   * Creates new consent form version with the provided data for the specified consent form.
   */
  createConsentFormVersion(formId: number, content: string, versionNumber: number): Promise<ConsentFormVersion>

  /**
   * Updates the content of the specified consent form version.
   */
  updateConsentFormVersion(versionId: number, content: string): Promise<ConsentFormVersion>

  /**
   * Updates the active consent form version for the specified consent form.
   */
  updateActiveConsentFormVersion(formId: number, versionId: number): Promise<void>
}

export default ConsentFormRepositoryInterface
