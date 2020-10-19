import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'
import { InputBinding } from '../../../components/shared/useInput'

type Props = {
  emailBinding: InputBinding
  passwordBinding: InputBinding
  firstNameBinding: InputBinding
  lastNameBinding: InputBinding
  visible: boolean
}

const RegisterAdminForm: React.FC<Props> = ({
  emailBinding,
  passwordBinding,
  firstNameBinding,
  lastNameBinding,
  visible
}) => {
  const classes = useStyles({ visible })
  const [t] = useTranslation()

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} component="h1">
        {t('auth.registerAdminDetails')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <TextField
            {...emailBinding}
            id="admin-email"
            label={t('auth.email')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...passwordBinding}
            id="admin-password"
            label={t('auth.password')}
            type="password"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...firstNameBinding}
            id="admin-first-name"
            label={t('auth.firstName')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...lastNameBinding}
            id="admin-last-name"
            label={t('auth.lastName')}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default RegisterAdminForm
