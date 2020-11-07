import Joi from 'joi'
import REGEXP from '../../utils/regexp'
import { AddressSchema } from './AddressSchema'
import { UserRegisterSchema } from './UserSchema'

export const CompanyRegisterSchema = Joi.object({
  name: Joi.string().required(),
  registrationNumber: Joi.string().pattern(REGEXP.REGISTRATION_NUMBER).required(),
  address: AddressSchema,
  admin: UserRegisterSchema
})

export const CompanyUpdateSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  registrationNumber: Joi.string().pattern(REGEXP.REGISTRATION_NUMBER).required(),
  address: AddressSchema,
  admin: UserRegisterSchema.optional()
})
