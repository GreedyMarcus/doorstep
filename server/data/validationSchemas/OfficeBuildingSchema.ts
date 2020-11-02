import Joi from 'joi'
import { UserInfoSchema } from './UserSchema'
import { LongAddressSchema } from './AddressSchema'

export const OfficeBuildingRegistrationSchema = Joi.object({
  buildingAdmin: UserInfoSchema,
  buildingAddress: LongAddressSchema
})
