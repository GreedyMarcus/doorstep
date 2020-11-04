import { ConsentFormInfoDTO, ConsentFormCreateDTO, ConsentFormDetailsDTO } from '../../data/dtos/ConsentFormDTO'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

interface ConsentFormServiceInterface {
  getConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentFormInfoDTO[]>
  getConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentFormDetailsDTO>
  createGlobalConsentForm(consentFormData: ConsentFormCreateDTO, adminId: number): Promise<ConsentFormInfoDTO>
}

export default ConsentFormServiceInterface
