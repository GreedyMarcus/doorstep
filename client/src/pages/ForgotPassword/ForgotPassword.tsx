import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import LockRoundedIcon from '@material-ui/icons/LockRounded'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import useStyles from './useStyles'
import useForgotPassword from './useForgotPassword'
import { Link as RouteLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * The Forgot Password page where users can request password reset.
 */
const ForgotPassword: React.FC = () => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [bindEmail, handlePasswordReset] = useForgotPassword()

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <LockRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          {t('page.forgotPassword.pageTitle')}
        </Typography>
        <Typography className={classes.helper} component="h2">
          {t('page.forgotPassword.helper')}
        </Typography>

        <form className={classes.form} onSubmit={handlePasswordReset} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...bindEmail} label={t('common.email')} autoComplete="email" variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <Button className={classes.submit} type="submit" variant="contained" color="primary" size="large" fullWidth>
                {t('page.forgotPassword.submit')}
              </Button>
              <Grid container justify="center">
                <Link component={RouteLink} to="/login">
                  {t('page.forgotPassword.loginRedirect')}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
