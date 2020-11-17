import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'

const GuestProfile: React.FC = () => {
  const classes = useStyles()
  const [t] = useTranslation()

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.guestProfile')}
        </Typography>
      </Paper>
    </Container>
  )
}

export default GuestProfile
