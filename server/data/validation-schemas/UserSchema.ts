import Joi from 'joi'
import REGEXP from '../../utils/regexp'

export const UserInfoSchema = Joi.object({
  email: Joi.string().pattern(REGEXP.EMAIL).required(),
  password: Joi.string().pattern(REGEXP.PASSWORD).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
})

export const UserLoginSchema = Joi.object({
  email: Joi.string().pattern(REGEXP.EMAIL).required(),
  password: Joi.string().pattern(REGEXP.PASSWORD).required()
})
