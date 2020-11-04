import { UserRole } from '../data/enums/UserRole'

export const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  COMPANIES: '/companies',
  CONSENT_FORMS: '/consent-forms',
  VISITS: '/visits',
  HOSTS: '/hosts',
  PLANNED_VISITS: '/planned-visits',
  INVITATIONS: '/invitations'
}

export const getAuthRedirectRoute = (role: string) => {
  const redirectRoutes = {
    [UserRole.ADMIN]: routes.COMPANIES,
    [UserRole.COMPANY_ADMIN]: routes.VISITS,
    [UserRole.BUSINESS_HOST]: routes.PLANNED_VISITS,
    [UserRole.RECEPTIONIST]: routes.INVITATIONS
  }
  return redirectRoutes[role]
}
