import ConsentForm from '../../models/ConsentForm'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormRepositoryInterface {
  findConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentForm>
  findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]>
  createGlobalConsentForm(title: string, content: string, adminId: number): Promise<ConsentForm>
}

export default ConsentFormRepositoryInterface
