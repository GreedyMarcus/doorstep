import React, { useState, useEffect } from 'react'
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
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import UserProfileDialog from '../UserProfileDialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { userRoleSelector, userNameSelector, logoutUser } from '../../store/user'
import { getNavigations, getActions } from './navigations'

/**
 * Responsive authorized navigation component for the application.
 */
const NavigationBar: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const showNavs = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const userRole = useSelector(userRoleSelector)
  const userName = useSelector(userNameSelector)

  const [activeAction, setActiveAction] = useState(-1)
  const [activeMobileNav, setActiveMobileNav] = useState(0)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  /**
   * Logs out the current user.
   */
  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/login')
  }

  /**
   * Handles the navigation events of the mobile view navigation bar.
   */
  const handleMobileNavChange = (e, value: number) => {
    setActiveMobileNav(value)
    history.push(navigations[value].routePath)
  }

  /**
   * Renders the action component if action fired and component is present.
   */
  const renderActionComponent = () => {
    const foundAction = actions[activeAction]
    if (foundAction && foundAction.renderComponent) {
      return foundAction.renderComponent(() => setActiveAction(-1))
    }
    return null
  }

  const navigations = getNavigations(userRole)
  const actions = getActions(userRole)

  /**
   * Synchronizes the mobile navigation view with the history location.
   */
  useEffect(() => {
    const currentNavIndex = navigations.findIndex(nav => nav.routePath === history.location.pathname)
    setActiveMobileNav(currentNavIndex === -1 ? 0 : currentNavIndex)
  }, [history.location])

  // Show navigation only for authorized users
  if (!userRole) {
    return null
  }

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <IconButton color="inherit" onClick={() => history.push(navigations[0].routePath)}>
              <MeetingRoomRoundedIcon className={classes.homeIcon} />
              <Typography className={classes.homeTitle} variant="h6">
                Doorstep
              </Typography>
            </IconButton>

            {showNavs &&
              navigations.map(({ routePath, labelLanguageKey }) => (
                <Button key={labelLanguageKey} color="inherit" onClick={() => history.push(routePath)}>
                  {t(labelLanguageKey)}
                </Button>
              ))}

            <div className={classes.grow} />

            {actions.map(({ titleLanguageKey, icon }, index) => (
              <Tooltip key={titleLanguageKey} title={t(titleLanguageKey).toString()}>
                <IconButton color="inherit" onClick={() => setActiveAction(index)}>
                  {icon}
                </IconButton>
              </Tooltip>
            ))}

            {showNavs && (
              <Tooltip title={userName}>
                <IconButton onClick={() => setShowProfileDialog(true)} color="inherit">
                  <AccountCircleRoundedIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={t('common.logout').toString()}>
              <IconButton onClick={handleLogout} color="inherit">
                <ExitToAppRoundedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      {renderActionComponent()}

      {!showNavs && (
        <AppBar position="static">
          <Tabs variant="fullWidth" value={activeMobileNav} onChange={handleMobileNavChange}>
            {navigations.map(({ labelLanguageKey }) => (
              <Tab key={labelLanguageKey} label={t(labelLanguageKey)} />
            ))}
          </Tabs>
        </AppBar>
      )}

      {showProfileDialog && <UserProfileDialog onClose={() => setShowProfileDialog(false)} />}
    </>
  )
}

export default NavigationBar
