import Joi from 'joi'
import REGEXP from '../../utils/regexp'

export const UserLoginSchema = Joi.object({
  email: Joi.string().pattern(REGEXP.EMAIL).required(),
  password: Joi.string().pattern(REGEXP.PASSWORD).required()
})

export const UserRegisterSchema = Joi.object({
  email: Joi.string().pattern(REGEXP.EMAIL).required(),
  password: Joi.string().pattern(REGEXP.PASSWORD).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
})

export const UserUpdateSchema = Joi.object({
  id: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
})

export const ForgotPasswordSchema = Joi.object({
  email: Joi.string().pattern(REGEXP.EMAIL).required()
})

export const ResetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().pattern(REGEXP.PASSWORD).required()
})
