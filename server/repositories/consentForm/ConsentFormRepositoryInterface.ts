import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormRepositoryInterface {
  findConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentForm>
  findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]>
  findConsentFormVersionById(consentFormVersionId: number): Promise<ConsentFormVersion>
  createGlobalConsentForm(title: string, content: string, adminId: number): Promise<ConsentForm>
  createGlobalConsentFormVersion(formId: number, content: string, versionNumber: number): Promise<ConsentFormVersion>
  updateConsentFormVersion(versionId: number, content: string): Promise<ConsentFormVersion>
}

export default ConsentFormRepositoryInterface
