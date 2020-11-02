import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CompanyInfo, RegisterCompanyDetails } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { registerCompany } from '../../store/company'

type Props = {
  company?: CompanyInfo
  isEditing?: boolean
  onClose: () => void
}

const CompanyEditorDialog: React.FC<Props> = ({ company, isEditing, onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [name, bindName, resetName] = useInput('', true)
  const [registrationNumber, bindRegistrationNumber, resetRegistrationNumber] = useInput('', true, REGEXP.COMPANY_REG_NUMBER)
  const [country, bindCountry, resetCountry] = useInput('', true)
  const [zipCode, bindZipCode, resetZipCode] = useInput('', true)
  const [city, bindCity, resetCity] = useInput('', true)
  const [streetAddress, bindStreetAddress, resetStreetAddress] = useInput('', true)
  const [firstName, bindFirstName, resetFirstName] = useInput('', true)
  const [lastName, bindLastName, resetLastName] = useInput('', true)
  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true, REGEXP.PASSWORD)

  const clearInputs = () => {
    resetName()
    resetRegistrationNumber()
    resetCountry()
    resetZipCode()
    resetCity()
    resetStreetAddress()
    resetFirstName()
    resetLastName()
    resetEmail()
    resetPassword()
  }

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const inputs = [name, registrationNumber, country, zipCode, city, streetAddress, firstName, lastName, email, password]

    const isCompanyDataValid = inputs.every(param => param.isValid)
    if (!isCompanyDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidCompanyData') }))
      return
    }

    const companyData: RegisterCompanyDetails = {
      name: name.value,
      registrationNumber: registrationNumber.value,
      address: {
        country: country.value,
        zipCode: zipCode.value,
        city: city.value,
        streetAddress: streetAddress.value
      },
      admin: {
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value
      }
    }

    dispatch(registerCompany(companyData))
    clearInputs()
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t(`action.${isEditing ? 'editCompany' : 'addCompany'}`)}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('company.companyDetails')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField {...bindName} id="company-name" label={t('company.name')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindRegistrationNumber}
              id="company-registration-number"
              label={t('company.registrationNumber')}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindCountry} id="company-country" label={t('general.country')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindZipCode} id="company-zip-code" label={t('general.zipCode')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindCity} id="company-city" label={t('general.city')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindStreetAddress} id="company-street-address" label={t('general.streetAddress')} variant="outlined" fullWidth />
          </Grid>
        </Grid>

        <Typography className={classes.sectionTitle} component="h1">
          {t('company.adminDetails')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField {...bindFirstName} id="company-admin-first-name" label={t('auth.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindLastName} id="company-admin-last-name" label={t('auth.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindEmail} id="company-admin-email" label={t('auth.email')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindPassword}
              id="company-admin-password"
              label={t('auth.password')}
              type="password"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          {t('general.cancel')}
        </Button>
        <Button color="primary" onClick={handleSave}>
          {t('general.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompanyEditorDialog
