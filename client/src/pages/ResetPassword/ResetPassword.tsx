import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import LockRoundedIcon from '@material-ui/icons/LockRounded'
import Typography from '@material-ui/core/Typography'
import PasswordField from '../../components/shared/PasswordField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import useStyles from './useStyles'
import useResetPassword from './useResetPassword'
import { Link as RouteLink, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * The Reset Password page where users can change their password.
 */
const ResetPassword: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [bindPassword, handlePasswordReset] = useResetPassword({ token: routeParams['token'] })

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <LockRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          {t('page.resetPassword.pageTitle')}
        </Typography>
        <Typography className={classes.helper} component="h2">
          {t('page.resetPassword.helper')}
        </Typography>

        <form className={classes.form} onSubmit={handlePasswordReset} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PasswordField {...bindPassword} label={t('common.password')} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <Button className={classes.submit} type="submit" variant="contained" color="primary" size="large" fullWidth>
                {t('page.resetPassword.submit')}
              </Button>
              <Grid container justify="center">
                <Link component={RouteLink} to="/login">
                  {t('page.resetPassword.loginRedirect')}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default ResetPassword
