import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'
import { InputBinding } from '../../../components/shared/useInput'

type Props = {
  countryBinding: InputBinding
  zipCodeBinding: InputBinding
  cityBinding: InputBinding
  streetAddressBinding: InputBinding
  visible: boolean
}

const RegisterBuildingForm: React.FC<Props> = ({ countryBinding, zipCodeBinding, cityBinding, streetAddressBinding, visible }) => {
  const classes = useStyles({ visible })
  const [t] = useTranslation()

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} component="h1">
        {t('auth.registerBuildingDetails')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <TextField {...countryBinding} id="building-country" label={t('general.country')} variant="outlined" fullWidth />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField {...zipCodeBinding} id="building-zip-code" label={t('general.zipCode')} variant="outlined" fullWidth />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField {...cityBinding} id="building-city" label={t('general.city')} variant="outlined" fullWidth />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...streetAddressBinding}
            id="building-street-address"
            label={t('general.streetAddress')}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default RegisterBuildingForm
