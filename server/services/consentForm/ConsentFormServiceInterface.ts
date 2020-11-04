import { ConsentFormInfoDTO, ConsentFormCreateDTO, ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormServiceInterface {
  getConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentFormInfoDTO[]>
  getConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentFormDetailsDTO>
  createGlobalConsentForm(consentFormData: ConsentFormCreateDTO, adminId: number): Promise<ConsentFormInfoDTO>
  createGlobalConsentFormVersion(consentFormId: number, versionContent: string): Promise<ConsentFormVersionInfoDTO>
  updateConsentFormVersion(formId: number, versionId: number, content: string): Promise<ConsentFormVersionInfoDTO>
  activateConsentFormVersion(consentFormId: number, versionId: number): Promise<void>
}

export default ConsentFormServiceInterface
