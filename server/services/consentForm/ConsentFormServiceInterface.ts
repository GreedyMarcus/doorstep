import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'

interface ConsentFormServiceInterface {
  getConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentFormInfoDTO[]>
  createGlobalConsentForm(consentFormData: ConsentFormCreateDTO, adminId: number): Promise<ConsentFormInfoDTO>
}

export default ConsentFormServiceInterface
