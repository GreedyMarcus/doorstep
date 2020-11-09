import React from 'react'
import i18n from '../../plugins/i18n'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded'
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import CompanyEditorDialog from '../CompanyEditorDialog'
import ConsentFormDialog from '../ConsentFormDialog'
import { UserRole } from '../../data/enums/UserRole'
import { routes } from '../../app/routes'

type Navigation = {
  id: string
  route: string
  label: string
}

type Action = {
  id: string
  title: string
  icon: JSX.Element
  renderComponent?: (onActionFinish: () => void) => React.ReactElement
}

type NavigationAuthConfig = {
  navigations: { [key: string]: Navigation[] }
  actions: { [key: string]: Action[] }
}

export const navigationAuthConfig = {
  navigations: {
    [UserRole.ADMIN]: [
      { id: 'ADMIN-NAV-1', route: routes.COMPANIES, label: i18n.t('general.companies') },
      { id: 'ADMIN-NAV-2', route: routes.CONSENT_FORMS, label: i18n.t('general.consentForms') }
    ],
    [UserRole.COMPANY_ADMIN]: [
      { id: 'COMPANY-ADMIN-NAV-1', route: routes.VISITS, label: i18n.t('general.visits') },
      { id: 'COMPANY-ADMIN-NAV-2', route: routes.HOSTS, label: i18n.t('general.businessHosts') },
      { id: 'COMPANY-ADMIN-NAV-3', route: routes.CONSENT_FORMS, label: i18n.t('general.consentForms') }
    ],
    [UserRole.BUSINESS_HOST]: [{ id: 'BUSINESS-HOST-NAV-1', route: routes.PLANNED_VISITS, label: i18n.t('general.visits') }],
    [UserRole.RECEPTIONIST]: [{ id: 'RECEPTIONIST-NAV-1', route: routes.INVITATIONS, label: i18n.t('general.visits') }],
    [UserRole.GUEST]: []
  },
  actions: {
    [UserRole.ADMIN]: [
      {
        id: 'ADMIN-ACTION-1',
        title: i18n.t('action.addCompany'),
        icon: <BusinessCenterRoundedIcon />,
        renderComponent: onActionFinish => <CompanyEditorDialog onClose={onActionFinish} />
      },
      {
        id: 'ADMIN-ACTION-2',
        title: i18n.t('action.addConsentForm'),
        icon: <PostAddRoundedIcon />,
        renderComponent: onActionFinish => <ConsentFormDialog onClose={onActionFinish} />
      }
    ],
    [UserRole.COMPANY_ADMIN]: [
      { id: 'COMPANY-ADMIN-ACTION-1', title: i18n.t('action.addBusinessHost'), icon: <PersonAddRoundedIcon /> },
      { id: 'COMPANY-ADMIN-ACTION-2', title: i18n.t('action.addConsentForm'), icon: <PostAddRoundedIcon /> }
    ],
    [UserRole.BUSINESS_HOST]: [
      { id: 'BUSINESS-HOST-ACTION-1', title: i18n.t('action.addVisit'), icon: <InsertInvitationRoundedIcon /> }
    ],
    [UserRole.RECEPTIONIST]: [
      { id: 'RECEPTIONIST-ACTION-1', title: i18n.t('action.addVisit'), icon: <InsertInvitationRoundedIcon /> }
    ],
    [UserRole.GUEST]: []
  }
} as NavigationAuthConfig
