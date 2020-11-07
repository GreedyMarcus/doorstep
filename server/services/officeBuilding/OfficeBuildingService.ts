import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import OfficeBuildingServiceInterface from './OfficeBuildingServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/officeBuilding'
import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'

@injectable()
class OfficeBuildingService implements OfficeBuildingServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository) officeBuildingRepository: OfficeBuildingRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.officeBuildingRepository = officeBuildingRepository
  }

  public registerBuilding = async ({ admin, address }: OfficeBuildingRegisterDTO): Promise<void> => {
    const buildingAdmin = await this.userRepository.findUserByEmail(admin.email)
    if (buildingAdmin) {
      throw Boom.badRequest('Admin already exists')
    }

    const buildingWithAddress = await this.officeBuildingRepository.findBuildingByAddress(address)
    if (buildingWithAddress) {
      throw Boom.badRequest('Office building already exists with address')
    }

    // Hash password for building admin
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(buildingAdmin.password, salt)

    // Save office building
    const adminData = { ...admin, password: hashedPassword }

    const createdBuilding = await this.officeBuildingRepository.createBuilding(adminData, address)
    if (!createdBuilding) {
      throw Boom.internal('Could not register office building')
    }
  }
}

export default OfficeBuildingService
