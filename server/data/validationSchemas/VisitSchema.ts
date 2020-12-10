import Joi from 'joi'
import REGEXP from '../../utils/regexp'
import { GuestUserRegisterSchema } from './UserSchema'
import { AddressSchema } from './AddressSchema'
import { VisitPurpose } from '../enums/VisitPurpose'
import { IdentifierCardType } from '../enums/IdentifierCardType'

export const VisitCreateSchema = Joi.object({
  businessHostId: Joi.number().required(),
  purpose: Joi.string()
    .valid(...Object.values<string>(VisitPurpose))
    .required(),
  room: Joi.string().required(),
  plannedEntry: Joi.date().required(),
  invitedGuests: Joi.array().items(GuestUserRegisterSchema).min(1).required()
})

export const GuestUpdateByUserSchema = Joi.object({
  receptionistId: Joi.number().optional(),
  nationality: Joi.string().allow(null),
  phoneNumber: Joi.string().allow(null),
  birthplace: Joi.string().allow(null),
  birthDate: Joi.string().allow(null),
  motherName: Joi.string().allow(null),
  address: AddressSchema.allow(null),
  identifierCardType: Joi.string()
    .valid(...Object.values<string>(IdentifierCardType))
    .required(),
  identifierCardNumber: Joi.string().allow(null),
  company: Joi.object({
    name: Joi.string().required(),
    registrationNumber: Joi.string().pattern(REGEXP.REGISTRATION_NUMBER).required(),
    address: AddressSchema
  }).allow(null),
  imageUrl: Joi.string().allow(null),
  signature: Joi.string().allow(null),
  consentFormVersionsAccepted: Joi.array().items(Joi.number()).required()
})
