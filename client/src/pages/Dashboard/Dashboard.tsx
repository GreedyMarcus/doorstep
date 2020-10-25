import React, { useCallback } from 'react'
import NavigationBar from '../../components/NavigationBar'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded'
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
        { id: 'ADMIN-NAV-2', route: '/consent-forms', label: t('general.consentForms') }
      ]
    }

    if (userRole === UserRole.COMPANY_ADMIN) {
      return []
    }

    if (userRole === UserRole.BUSINESS_HOST) {
      return []
    }

    if (userRole === UserRole.RECEPTIONIST) {
      return []
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
      return []
    }

    if (userRole === UserRole.BUSINESS_HOST) {
      return []
    }

    if (userRole === UserRole.RECEPTIONIST) {
      return []
    }

    return []
  }, [userRole, t])

  return <NavigationBar navigations={getNavigations()} operations={getOperations()} />
}

export default Dashboard
