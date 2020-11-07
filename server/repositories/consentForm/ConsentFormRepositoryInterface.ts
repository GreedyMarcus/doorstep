import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'

interface ConsentFormRepositoryInterface {
  findConsentFormsByBuildingId(buildingId: number): Promise<ConsentForm[]>
  createGlobalConsentForm(buildingId: number, title: string, content: string): Promise<ConsentForm>
  findConsentFormById(formId: number): Promise<ConsentForm>
  findConsentFormVersionById(versionId: number): Promise<ConsentFormVersion>
  createConsentFormVersion(formId: number, content: string, versionNumber: number): Promise<ConsentFormVersion>
  updateConsentFormVersion(versionId: number, content: string): Promise<ConsentFormVersion>
  updateActiveConsentFormVersion(formId: number, versionId: number): Promise<void>
}

export default ConsentFormRepositoryInterface
