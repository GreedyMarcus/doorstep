import Joi from 'joi'
import { default as REGEXP } from '../../utils/RegexpConstants'
import { LongAddressSchema } from './AddressSchema'

export const OfficeBuildingRegistrationSchema = Joi.object({
  adminEmail: Joi.string().pattern(REGEXP.EMAIL).required(),
  adminPassword: Joi.string().pattern(REGEXP.PASSWORD).required(),
  adminFirstName: Joi.string().required(),
  adminLastName: Joi.string().required(),
  buildingAddress: LongAddressSchema
})
