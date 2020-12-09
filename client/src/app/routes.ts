import { RouteProps } from 'react-router-dom'
import { UserRole } from '../data/enums/UserRole'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Companies from '../pages/Companies'
import Receptionists from '../pages/Receptionists'
import BusinessHosts from '../pages/BusinessHosts'
import ConsentForms from '../pages/ConsentForms'
import ConsentFormDetails from '../pages/ConsentFormDetails'
import Visits from '../pages/Visits'
import VisitDetails from '../pages/VisitDetails'
import PlannedVisits from '../pages/PlannedVisits'
import Invitations from '../pages/Invitations'
import InvitationDetails from '../pages/InvitationDetails'
import VisitGuest from '../pages/VisitGuest'
import EntryProcess from '../pages/EntryProcess'
import GuestInvitations from '../pages/GuestInvitations'
import GuestInvitationDetails from '../pages/GuestInvitationDetails'

/**
 * Authorized React route props interface.
 */
export interface ProtectedRouteProps extends RouteProps {
  /**
   * The React functional Component to render when the route path matches.
   */
  Component: React.FC<any>

  /**
   * The user roles that can access the route.
   */
  auth?: UserRole[]

  /**
   * If present, the route unreachable for authenticated users.
   */
  noAuth?: boolean

  /**
   * The relative route path.
   */
  path: string
}

/**
 * Application routes.
 */
export const routes: ProtectedRouteProps[] = [
  {
    path: '/login',
    Component: Login,
    noAuth: true,
    exact: true
  },
  {
    path: '/register',
    Component: Register,
    noAuth: true,
    exact: true
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
    noAuth: true,
    exact: true
  },
  {
    path: '/reset-password/:token',
    Component: ResetPassword,
    noAuth: true,
    exact: true
  },
  {
    path: '/companies',
    Component: Companies,
    auth: [UserRole.ADMIN],
    exact: true
  },
  {
    path: '/receptionists',
    Component: Receptionists,
    auth: [UserRole.ADMIN],
    exact: true
  },
  {
    path: '/hosts',
    Component: BusinessHosts,
    auth: [UserRole.COMPANY_ADMIN],
    exact: true
  },
  {
    path: '/consent-forms',
    Component: ConsentForms,
    auth: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    exact: true
  },
  {
    path: '/consent-forms/:consentFormId',
    Component: ConsentFormDetails,
    auth: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    exact: true
  },
  {
    path: '/visits',
    Component: Visits,
    auth: [UserRole.COMPANY_ADMIN],
    exact: true
  },
  {
    path: '/visits/:visitId',
    Component: VisitDetails,
    auth: [UserRole.COMPANY_ADMIN, UserRole.BUSINESS_HOST],
    exact: true
  },
  {
    path: '/planned-visits',
    Component: PlannedVisits,
    auth: [UserRole.BUSINESS_HOST],
    exact: true
  },
  {
    path: '/invitations',
    Component: Invitations,
    auth: [UserRole.RECEPTIONIST],
    exact: true
  },
  {
    path: '/invitations/:visitId',
    Component: InvitationDetails,
    auth: [UserRole.RECEPTIONIST],
    exact: true
  },
  {
    path: '/invitations/:visitId/guests/:guestId',
    Component: VisitGuest,
    auth: [UserRole.RECEPTIONIST],
    exact: true
  },
  {
    path: '/invitations/:visitId/guests/:guestId/entry',
    Component: EntryProcess,
    auth: [UserRole.RECEPTIONIST],
    exact: true
  },
  {
    path: '/guest-invitations',
    Component: GuestInvitations,
    auth: [UserRole.GUEST],
    exact: true
  },
  {
    path: '/guest-invitations/:visitId',
    Component: GuestInvitationDetails,
    auth: [UserRole.GUEST],
    exact: true
  }
]

/**
 * Returns the default route path for the specified user role.
 */
export const getDefaultRoutePath = (role: UserRole) => {
  const defaultRoutes = {
    [UserRole.ADMIN]: '/companies',
    [UserRole.COMPANY_ADMIN]: '/visits',
    [UserRole.BUSINESS_HOST]: '/planned-visits',
    [UserRole.RECEPTIONIST]: '/invitations',
    [UserRole.GUEST]: '/guest-invitations'
  }
  return defaultRoutes[role]
}
