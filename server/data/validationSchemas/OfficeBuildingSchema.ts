import Joi from 'joi'
import { UserRegisterSchema } from './UserSchema'
import { AddressSchema } from './AddressSchema'

export const OfficeBuildingRegisterSchema = Joi.object({
  admin: UserRegisterSchema,
  address: AddressSchema
})
