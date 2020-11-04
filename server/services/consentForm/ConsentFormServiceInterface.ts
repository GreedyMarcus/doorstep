import { ConsentFormInfoDTO, ConsentFormCreateDTO, ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormServiceInterface {
  getConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentFormInfoDTO[]>
  getConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentFormDetailsDTO>
  createGlobalConsentForm(consentFormData: ConsentFormCreateDTO, adminId: number): Promise<ConsentFormInfoDTO>
  createGlobalConsentFormVersion(consentFormId: number, versionContent: string): Promise<ConsentFormVersionInfoDTO>
}

export default ConsentFormServiceInterface
