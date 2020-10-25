import React, { useCallback } from 'react'
import NavigationBar from '../../components/NavigationBar'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded'
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { userRoleSelector } from '../../store/user'
import { UserRole } from '../../data/enums/UserRole'

const Dashboard: React.FC = () => {
  const userRole = useSelector(userRoleSelector)
  const [t] = useTranslation()

  const getNavigations = useCallback(() => {
    if (userRole === UserRole.ADMIN) {
      return [
        { id: 'ADMIN-NAV-1', route: '/companies', label: t('general.companies') },
        { id: 'ADMIN-NAV-2', route: '/consents', label: t('general.consentForms') }
      ]
    }

    if (userRole === UserRole.COMPANY_ADMIN) {
      return [
        { id: 'COMPANY-ADMIN-NAV-1', route: '/visits', label: t('general.visits') },
        { id: 'COMPANY-ADMIN-NAV-2', route: '/hosts', label: t('general.businessHosts') },
        { id: 'COMPANY-ADMIN-NAV-3', route: '/consents', label: t('general.consentForms') }
      ]
    }

    if (userRole === UserRole.BUSINESS_HOST) {
      return [{ id: 'BUSINESS-HOST-NAV-1', route: '/planned-visits', label: t('general.visits') }]
    }

    if (userRole === UserRole.RECEPTIONIST) {
      return [{ id: 'RECEPTIONIST-NAV-1', route: '/invitations', label: t('general.visits') }]
    }

    return []
  }, [userRole, t])

  const getOperations = useCallback(() => {
    if (userRole === UserRole.ADMIN) {
      return [
        { id: 'ADMIN-OP-1', icon: <BusinessCenterRoundedIcon />, title: t('action.addCompany') },
        { id: 'ADMIN-OP-2', icon: <PostAddRoundedIcon />, title: t('action.addConsentForm') }
      ]
    }

    if (userRole === UserRole.COMPANY_ADMIN) {
      return [
        { id: 'COMPANY-ADMIN-OP-1', icon: <PersonAddRoundedIcon />, title: t('action.addBusinessHost') },
        { id: 'COMPANY-ADMIN-OP-2', icon: <PostAddRoundedIcon />, title: t('action.addConsentForm') }
      ]
    }

    if (userRole === UserRole.BUSINESS_HOST) {
      return [{ id: 'BUSINESS-HOST-OP-1', icon: <InsertInvitationRoundedIcon />, title: t('action.addVisit') }]
    }

    if (userRole === UserRole.RECEPTIONIST) {
      return [{ id: 'RECEPTIONIST-OP-1', icon: <InsertInvitationRoundedIcon />, title: t('action.addVisit') }]
    }

    return []
  }, [userRole, t])

  return <NavigationBar navigations={getNavigations()} operations={getOperations()} />
}

export default Dashboard
