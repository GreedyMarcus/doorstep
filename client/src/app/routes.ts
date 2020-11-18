import { UserRole } from '../data/enums/UserRole'

/**
 * Client routes object.
 */
export const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  COMPANIES: '/companies',
  CONSENT_FORMS: '/consent-forms',
  CONSENT_FORM_DETAILS: '/consent-forms/:consentFormId',
  VISITS: '/visits',
  VISIT_DETAILS: '/visits/:visitId',
  HOSTS: '/hosts',
  PLANNED_VISITS: '/planned-visits',
  INVITATIONS: '/invitations',
  GUEST_INVITATIONS: '/guest-invitations',
  GUEST_INVITATION_DETAILS: '/guest-invitations/:visitId'
}

/**
 * Returns the default route for the authenticated user.
 *
 * @param role - role of the user
 */
export const getAuthRedirectRoute = (role: string) => {
  const redirectRoutes = {
    [UserRole.ADMIN]: routes.COMPANIES,
    [UserRole.COMPANY_ADMIN]: routes.VISITS,
    [UserRole.BUSINESS_HOST]: routes.PLANNED_VISITS,
    [UserRole.RECEPTIONIST]: routes.INVITATIONS,
    [UserRole.GUEST]: routes.GUEST_INVITATIONS
  }
  return redirectRoutes[role]
}
