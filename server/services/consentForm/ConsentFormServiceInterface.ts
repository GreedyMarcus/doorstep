import { ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'

interface ConsentFormServiceInterface {
  getConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentFormInfoDTO[]>
}

export default ConsentFormServiceInterface
