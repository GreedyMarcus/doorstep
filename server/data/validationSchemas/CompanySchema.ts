import Joi from 'joi'
import { LongAddressSchema } from './AddressSchema'
import { UserInfoSchema } from './UserSchema'

export const CompanyRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  address: LongAddressSchema,
  admin: UserInfoSchema
})
