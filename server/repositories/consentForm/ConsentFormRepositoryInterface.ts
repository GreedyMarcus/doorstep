import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormRepositoryInterface {
  findConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentForm>
  findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]>
  createGlobalConsentForm(title: string, content: string, adminId: number): Promise<ConsentForm>
  createGlobalConsentFormVersion(formId: number, content: string, versionNumber: number): Promise<ConsentFormVersion>
}

export default ConsentFormRepositoryInterface
