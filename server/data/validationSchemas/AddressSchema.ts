import Joi from 'joi'

export const AddressSchema = Joi.object({
  country: Joi.string().required(),
  zipCode: Joi.string().required(),
  city: Joi.string().required(),
  streetAddress: Joi.string().required()
})
