import TYPES from '../config/types'
import ERROR from '../utils/error'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { ConsentFormType } from '../data/enums/ConsentFormType'
import { ConsentFormRepositoryInterface } from '../repositories/consentForm'

/**
 * Custom middleware that verifies if the user has association with the specified consent form.
 * - Sends a 404 Not Found error if the specified consent form does not exist.
 * - Sends a 403 Forbidden error if user has no association with the consent form.
 */
export default (formType: ConsentFormType) => async (req: Request, res: Response, next: NextFunction) => {
  const consentFormRepository = container.get<ConsentFormRepositoryInterface>(TYPES.ConsentFormRepository)
  const consentForm = await consentFormRepository.findConsentFormById(Number(req.params.consentFormId))

  if (!consentForm) {
    return next(Boom.notFound(ERROR.CONSENT_FORM_DOES_NOT_EXIST))
  }

  if (formType === ConsentFormType.GLOBAL && consentForm.officeBuilding.admin.id === res.locals.userId) {
    return next()
  }

  if (formType === ConsentFormType.LOCAL && consentForm.company.admin.id === res.locals.userId) {
    return next()
  }

  next(Boom.forbidden(ERROR.USER_DOES_NOT_BELONG_TO_THE_CONSENT_FORM))
}
