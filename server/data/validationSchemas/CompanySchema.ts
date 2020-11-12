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

export const CompanyConfigSchema = Joi.object({
  storeNationality: Joi.boolean().required(),
  storeAddress: Joi.boolean().required(),
  storePhoneNumber: Joi.boolean().required(),
  storeBirthplace: Joi.boolean().required(),
  storeBirthDate: Joi.boolean().required(),
  storeMotherName: Joi.boolean().required(),
  storeCompany: Joi.boolean().required(),
  registerGuestCard: Joi.boolean().required(),
  trackActualExit: Joi.boolean().required()
})
