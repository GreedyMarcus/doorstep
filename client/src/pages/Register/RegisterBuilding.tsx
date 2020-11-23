import React, { FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import { Address } from '../../data/types/Address'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'

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
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [country, bindCountry] = useInput({ initialValue: '', required: true })
  const [zipCode, bindZipCode] = useInput({ initialValue: '', required: true })
  const [city, bindCity] = useInput({ initialValue: '', required: true })
  const [streetAddress, bindStreetAddress] = useInput({ initialValue: '', required: true })

  /**
   * Submits the office building address data to the register form.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isBuildingAddressDataValid = [country, zipCode, city, streetAddress].every(param => param.valid)
    if (!isBuildingAddressDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.building') }))
      return
    }

    const buildingAddressData = {
      country: country.value,
      zipCode: zipCode.value,
      city: city.value,
      streetAddress: streetAddress.value
    }

    onNextClick(buildingAddressData)
  }

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
