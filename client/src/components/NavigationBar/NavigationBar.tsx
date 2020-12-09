import React, { useState } from 'react'
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
import useNavigationBar from './useNavigationBar'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

/**
 * Responsive authorized navigation component for the application.
 */
const NavigationBar: React.FC = () => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const history = useHistory()

  const [t] = useTranslation()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [
    userRole,
    userName,
    navigations,
    actions,
    activeMobileNav,
    setActiveAction,
    renderActionComponent,
    handleMobileNavChange,
    handleLogout
  ] = useNavigationBar()

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

            {!fullScreen &&
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

            {!fullScreen && (
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

      {fullScreen && (
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
