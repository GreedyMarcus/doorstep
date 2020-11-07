import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'

interface OfficeBuildingServiceInterface {
  registerBuilding(data: OfficeBuildingRegisterDTO): Promise<void>
}

export default OfficeBuildingServiceInterface
