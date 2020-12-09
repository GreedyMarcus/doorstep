import React from 'react'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded'
import ContactPhoneRoundedIcon from '@material-ui/icons/ContactPhoneRounded'
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import CompanyEditorDialog from '../CompanyEditorDialog'
import ConsentFormDialog from '../ConsentFormDialog'
import ReceptionistEditorDialog from '../ReceptionistEditorDialog'
import BusinessHostEditorDialog from '../BusinessHostEditorDialog'
import VisitSchedulerDialog from '../VisitSchedulerDialog'
import { UserRole, isValidRole } from '../../data/enums/UserRole'

/**
 * Navigation item for navigation bar.
 */
export interface NavigationItem {
  /**
   * The redirect path of the item.
   */
  routePath: string

  /**
   * The language key to use when rendering label for the item.
   */
  labelLanguageKey: string
}

/**
 * Returns the navigation items for the specified user role.
 */
export const getNavigations = (role: UserRole): NavigationItem[] => {
  const navigations = {
    [UserRole.ADMIN]: [
      { routePath: '/companies', labelLanguageKey: 'page.companies.pageTitle' },
      { routePath: '/consent-forms', labelLanguageKey: 'page.consentForms.pageTitle' },
      { routePath: '/receptionists', labelLanguageKey: 'page.receptionists.pageTitle' }
    ],
    [UserRole.COMPANY_ADMIN]: [
      { routePath: '/visits', labelLanguageKey: 'page.visits.pageTitle' },
      { routePath: '/hosts', labelLanguageKey: 'page.businessHosts.pageTitle' },
      { routePath: '/consent-forms', labelLanguageKey: 'page.consentForms.pageTitle' }
    ],
    [UserRole.BUSINESS_HOST]: [{ routePath: '/planned-visits', labelLanguageKey: 'page.plannedVisits.pageTitle' }],
    [UserRole.RECEPTIONIST]: [{ routePath: '/invitations', labelLanguageKey: 'page.invitations.pageTitle' }],
    [UserRole.GUEST]: [{ routePath: '/guest-invitations', labelLanguageKey: 'page.invitations.pageTitle' }]
  }
  return isValidRole(role) ? navigations[role] : []
}

/**
 * Navigation action for navigation bar.
 */
export interface NavigationAction {
  /**
   * The language key to use when rendering tooltip title for the action.
   */
  titleLanguageKey: string

  /**
   * The display icon for the action.
   */
  icon: JSX.Element

  /**
   * The (optional) component to render when the action is invoked.
   * It has a callback function that is invoked when the actions is finished.
   */
  renderComponent?: (onActionFinish: () => void) => React.ReactElement
}

/**
 * Returns the navigation actions for the specified user role.
 */
export const getActions = (role: UserRole): NavigationAction[] => {
  const actions = {
    [UserRole.ADMIN]: [
      {
        titleLanguageKey: 'action.addCompany',
        icon: <BusinessCenterRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <CompanyEditorDialog onClose={onActionFinish} />
      },
      {
        titleLanguageKey: 'action.addConsentForm',
        icon: <PostAddRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <ConsentFormDialog onClose={onActionFinish} />
      },
      {
        titleLanguageKey: 'action.addReceptionist',
        icon: <ContactPhoneRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <ReceptionistEditorDialog onClose={onActionFinish} />
      }
    ],
    [UserRole.COMPANY_ADMIN]: [
      {
        titleLanguageKey: 'action.addBusinessHost',
        icon: <PersonAddRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <BusinessHostEditorDialog onClose={onActionFinish} />
      },
      {
        titleLanguageKey: 'action.addConsentForm',
        icon: <PostAddRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <ConsentFormDialog onClose={onActionFinish} />
      }
    ],
    [UserRole.BUSINESS_HOST]: [
      {
        titleLanguageKey: 'action.addVisit',
        icon: <InsertInvitationRoundedIcon />,
        renderComponent: (onActionFinish: () => void) => <VisitSchedulerDialog onClose={onActionFinish} />
      }
    ],
    [UserRole.RECEPTIONIST]: [],
    [UserRole.GUEST]: []
  }
  return isValidRole(role) ? actions[role] : []
}
