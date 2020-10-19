import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'

type Props = {
  email: string
  firstName: string
  lastName: string
  country: string
  zipCode: string
  city: string
  streetAddress: string
  visible: boolean
}

const RegisterAdminForm: React.FC<Props> = ({
  email,
  firstName,
  lastName,
  country,
  zipCode,
  city,
  streetAddress,
  visible
}) => {
  const classes = useStyles({ visible })
  const [t] = useTranslation()

  const emailText = `${t('auth.email')}: ${email}`
  const firstNameText = `${t('general.firstName')}: ${firstName}`
  const lastNameText = `${t('general.lastName')}: ${lastName}`
  const countryText = `${t('general.country')}: ${country}`
  const zipCodeText = `${t('general.zipCode')}: ${zipCode}`
  const cityText = `${t('general.city')}: ${city}`
  const streetAddressText = `${t('general.streetAddress')}: ${streetAddress}`

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} component="h1">
        {t('auth.registerReview')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            {t('auth.registerAdminDetails')}
          </Typography>
          <Typography className={classes.item} gutterBottom>{emailText}</Typography>
          <Typography className={classes.item} gutterBottom>{firstNameText}</Typography>
          <Typography className={classes.item} gutterBottom>{lastNameText}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            {t('auth.registerBuildingDetails')}
          </Typography>
          <Typography className={classes.item} gutterBottom>{countryText}</Typography>
          <Typography className={classes.item} gutterBottom>{zipCodeText}</Typography>
          <Typography className={classes.item} gutterBottom>{cityText}</Typography>
          <Typography className={classes.item} gutterBottom>{streetAddressText}</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default RegisterAdminForm
