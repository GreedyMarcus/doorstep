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
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { userRoleSelector, logoutUser } from '../../store/user'
import { navigationAuthConfig } from './navigationAuthConfig'

const NavigationBar: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const showNavs = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const dispatch = useAppDispatch()
  const userRole = useSelector(userRoleSelector)
  const [activeActionId, setActiveActionId] = useState('')
  const [mobileNav, setMobileNav] = useState(0)
  const [t] = useTranslation()

  const getNavigations = useCallback(() => (userRole ? navigationAuthConfig.navigations[userRole] : []), [userRole])
  const getActions = useCallback(() => (userRole ? navigationAuthConfig.actions[userRole] : []), [userRole])

  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/login')
  }

  const handleMobileNavChange = (e, value: number) => {
    setMobileNav(value)
    history.push(navigations[value].route)
  }

  const renderActionComponent = () => {
    const action = actions.find(action => action.id === activeActionId)
    if (action && action.renderComponent) {
      return action.renderComponent(() => setActiveActionId(''))
    }
  }

  useEffect(() => {
    const currentNavIndex = navigations.findIndex(nav => nav.route === history.location.pathname)
    setMobileNav(currentNavIndex === -1 ? 0 : currentNavIndex)
  }, [history.location])

  const navigations = getNavigations()
  const actions = getActions()
  const actionComponent = renderActionComponent()

  // Show navigation only for authorized users
  if (!userRole) {
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

            {actions.map(({ id, title, icon }) => (
              <Tooltip key={id} title={title}>
                <IconButton color="inherit" onClick={() => setActiveActionId(id)}>
                  {icon}
                </IconButton>
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

      {actionComponent}

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
