import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import useStyles from '../useStyles'
import useRegisterBuilding from './useRegisterBuilding'
import { Address } from '../../../data/types/Address'
import { useTranslation } from 'react-i18next'

interface RegisterBuildingProps {
  visible: boolean
  onBackClick: () => void
  onNextClick: (buildingAddressData: Address) => void
}

/**
 * Sub-component of the multi-step registration form.
 * It handles the data belongs to the office building, including validation.
 */
const RegisterBuilding: React.FC<RegisterBuildingProps> = ({ visible, onBackClick, onNextClick }) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [bindCountry, bindZipCode, bindCity, bindStreetAddress, handleNextClick] = useRegisterBuilding({ onNextClick })

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Typography className={classes.title} component="h1">
          {t('page.register.buildingDetails')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField {...bindCountry} label={t('common.country')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindZipCode} label={t('common.zipCode')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindCity} label={t('common.city')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindStreetAddress} label={t('common.streetAddress')} variant="outlined" fullWidth />
          </Grid>
        </Grid>

        <Grid className={classes.buttons} container justify="flex-end">
          <Button className={classes.button} onClick={onBackClick}>
            {t('action.back')}
          </Button>
          <Button className={classes.button} variant="contained" color="primary" type="submit">
            {t('action.next')}
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default RegisterBuilding
