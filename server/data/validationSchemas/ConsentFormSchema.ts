import Joi from 'joi'

export const ConsentFormCreateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
})

export const ConsentFormVersionCreateSchema = Joi.object({
  content: Joi.string().required()
})
