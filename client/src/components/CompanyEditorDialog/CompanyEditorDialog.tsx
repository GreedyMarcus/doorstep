import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CompanyInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { registerCompany, editCompany } from '../../store/company'

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

  const [name, bindName, resetName] = useInput(company?.name || '', true)
  const [regNumber, bindRegNumber, resetRegNumber] = useInput(company?.registrationNumber || '', true, REGEXP.REGISTRATION_NUMBER)
  const [country, bindCountry, resetCountry] = useInput(company?.address.split(', ')[0] || '', true)
  const [zipCode, bindZipCode, resetZipCode] = useInput(company?.address.split(', ')[1] || '', true)
  const [city, bindCity, resetCity] = useInput(company?.address.split(', ')[2] || '', true)
  const [streetAddress, bindStreetAddress, resetStreetAddress] = useInput(company?.address.split(', ')[3] || '', true)
  const [firstName, bindFirstName, resetFirstName] = useInput(company?.adminName.split(' ')[0] || '', true)
  const [lastName, bindLastName, resetLastName] = useInput(company?.adminName.split(' ')[1] || '', true)
  const [email, bindEmail, resetEmail] = useInput(company?.adminEmail || '', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true, REGEXP.PASSWORD)
  const [adminEditingChecked, setAdminEditingChecked] = useState(false)

  const clearInputs = () => {
    resetName()
    resetRegNumber()
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

  const validateCompanyData = (): boolean => {
    const companyInputs = [name, regNumber, country, zipCode, city, streetAddress]
    const adminInputs = [firstName, lastName, email, password]

    const inputsToValidate = isEditing && !adminEditingChecked ? companyInputs : [...companyInputs, ...adminInputs]
    return inputsToValidate.every(param => param.isValid)
  }

  const handleSave = () => {
    const isCompanyDataValid = validateCompanyData()
    if (!isCompanyDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidCompanyData') }))
      return
    }

    const companyData = {
      name: name.value,
      registrationNumber: regNumber.value,
      address: {
        country: country.value,
        zipCode: zipCode.value,
        city: city.value,
        streetAddress: streetAddress.value
      }
    }

    const adminData = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value
    }

    if (!isEditing) {
      dispatch(registerCompany({ ...companyData, admin: adminData }))
    } else {
      const companyId = company?.id || 0
      const admin = adminEditingChecked ? adminData : undefined

      dispatch(editCompany({ ...companyData, id: companyId || 0, admin }))
    }

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
              {...bindRegNumber}
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
            <TextField
              {...bindStreetAddress}
              id="company-street-address"
              label={t('general.streetAddress')}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>

        <Typography className={classes.sectionTitle} component="h1">
          {t('company.adminDetails')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindFirstName}
              id="company-admin-first-name"
              label={t('auth.firstName')}
              disabled={isEditing && !adminEditingChecked}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindLastName}
              id="company-admin-last-name"
              label={t('auth.lastName')}
              disabled={isEditing && !adminEditingChecked}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindEmail}
              id="company-admin-email"
              label={t('auth.email')}
              disabled={isEditing && !adminEditingChecked}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindPassword}
              id="company-admin-password"
              label={t('auth.password')}
              disabled={isEditing && !adminEditingChecked}
              type="password"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        {isEditing && (
          <FormControlLabel
            className={classes.checkbox}
            label={t('company.changeAdminText')}
            control={
              <Checkbox
                name="checked-admin-editing"
                checked={adminEditingChecked}
                onChange={() => setAdminEditingChecked(!adminEditingChecked)}
              />
            }
          />
        )}
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
