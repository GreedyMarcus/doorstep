import Joi from 'joi'
import { GuestUserRegisterSchema } from './UserSchema'
import { VisitPurpose } from '../enums/VisitPurpose'

export const VisitCreateSchema = Joi.object({
  businessHostId: Joi.number().required(),
  purpose: Joi.string()
    .valid(...Object.values(VisitPurpose))
    .required(),
  room: Joi.string().required(),
  plannedEntry: Joi.date().required(),
  invitedGuests: Joi.array().items(GuestUserRegisterSchema).min(1).required()
})
