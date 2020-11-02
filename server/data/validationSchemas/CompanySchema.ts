import Joi from 'joi'
import REGEXP from '../../utils/regexp'
import { LongAddressSchema } from './AddressSchema'
import { UserInfoSchema } from './UserSchema'

export const CompanyRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  registrationNumber: Joi.string().pattern(REGEXP.COMPANY_REG_NUMBER).required(),
  address: LongAddressSchema,
  admin: UserInfoSchema
})
