import React from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import useStyles from './useStyles'
import useWindowWidth from '../shared/useWindowWidth'
import { Link as RouteLink, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { logoutUser } from '../../store/user'

type Props = {
  navigations: Array<{ id: string; route: string; label: string }>
  operations: Array<{ id: string; icon: JSX.Element; title: string }>
}

const NavigationBar: React.FC<Props> = ({ navigations, operations }) => {
  const classes = useStyles()
  const history = useHistory()
  const windowWidth = useWindowWidth()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const showNavs = windowWidth >= 600

  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/login')
  }

  return (
    <AppBar position="static">
      <Container maxWidth="lg" disableGutters>
        <Toolbar>
          <IconButton color="inherit" aria-label="home">
            <MeetingRoomRoundedIcon className={classes.homeIcon} />
            <Typography className={classes.homeTitle} variant="h6">
              Doorstep
            </Typography>
          </IconButton>

          {showNavs &&
            navigations.map(({ id, route, label }) => (
              <Button key={id} color="inherit" component={RouteLink} to={route}>
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
  )
}

export default NavigationBar
