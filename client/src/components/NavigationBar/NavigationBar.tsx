import React, { useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded'
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { UserRole } from '../../data/enums/UserRole'
import { userRoleSelector, logoutUser } from '../../store/user'

const NavigationBar: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const showNavs = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const dispatch = useAppDispatch()
  const userRole = useSelector(userRoleSelector)
  const [mobileNav, setMobileNav] = useState(0)
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

  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/login')
  }

  const handleMobileNavChange = (e, value: number) => {
    setMobileNav(value)
    history.push(navigations[value].route)
  }

  useEffect(() => {
    const currentNavIndex = navigations.findIndex(nav => nav.route === history.location.pathname)
    setMobileNav(currentNavIndex === -1 ? 0 : currentNavIndex)
  }, [history.location])

  useEffect(() => {
    // Redirect for authorized users
    if (navigations.length) {
      history.push(navigations[0].route)
    }

    // Redirect unauthorized users from root route
    if (history.location.pathname === '/') {
      history.push('/login')
    }
  }, [userRole])

  const navigations = getNavigations()
  const operations = getOperations()

  // Show navigation only for authorized users
  if (!userRole || !userRole.length) {
    return null
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <IconButton color="inherit" aria-label="home" onClick={() => history.push(navigations[0].route)}>
              <MeetingRoomRoundedIcon className={classes.homeIcon} />
              <Typography className={classes.homeTitle} variant="h6">
                Doorstep
              </Typography>
            </IconButton>

            {showNavs &&
              navigations.map(({ id, route, label }) => (
                <Button key={id} color="inherit" onClick={() => history.push(route)}>
                  {label}
                </Button>
              ))}

            <div className={classes.grow} />

            {operations.map(({ id, title, icon }) => (
              <Tooltip key={id} title={title}>
                <IconButton color="inherit">{icon}</IconButton>
              </Tooltip>
            ))}

            <Tooltip title={t('auth.logout').toString()}>
              <IconButton onClick={handleLogout} color="inherit" aria-label="logout">
                <ExitToAppRoundedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      {!showNavs && (
        <AppBar position="static">
          <Tabs variant="fullWidth" value={mobileNav} onChange={handleMobileNavChange} aria-label="Mobile navigation tabs">
            {navigations.map(({ id, label }) => (
              <Tab key={id} label={label} />
            ))}
          </Tabs>
        </AppBar>
      )}
    </React.Fragment>
  )
}

export default NavigationBar
