import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CompanyInfo, CompanyInfoFormatted } from '../../data/types/Company'
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

  const formatCompanyData = (company: CompanyInfo | undefined): CompanyInfoFormatted => {
    const address = company?.address.split(', ')
    const adminName = company?.adminName.split(' ')

    return {
      name: company?.name || '',
      registrationNumber: company?.registrationNumber || '',
      address: {
        country: address ? address[0] : '',
        zipCode: address ? address[1] : '',
        city: address ? address[2] : '',
        streetAddress: address ? address[3] : ''
      },
      admin: {
        firstName: adminName ? adminName[0] : '',
        lastName: adminName ? adminName[1] : '',
        email: company?.adminEmail || '',
        password: ''
      }
    }
  }

  const companyData = formatCompanyData(company)

  const [name, bindName] = useInput(companyData.name, true)
  const [regNumber, bindRegNumber] = useInput(companyData.registrationNumber, true, REGEXP.REGISTRATION_NUMBER)
  const [country, bindCountry] = useInput(companyData.address.country, true)
  const [zipCode, bindZipCode] = useInput(companyData.address.zipCode, true)
  const [city, bindCity] = useInput(companyData.address.city, true)
  const [streetAddress, bindStreetAddress] = useInput(companyData.address.streetAddress, true)
  const [firstName, bindFirstName] = useInput(companyData.admin.firstName, true)
  const [lastName, bindLastName] = useInput(companyData.admin.lastName, true)
  const [email, bindEmail] = useInput(companyData.admin.email, true, REGEXP.EMAIL)
  const [password, bindPassword] = useInput(companyData.admin.password, true, REGEXP.PASSWORD)
  const [adminEditingChecked, setAdminEditingChecked] = useState(false)

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
      const companyId = company?.id || -1
      const admin = adminEditingChecked ? adminData : undefined

      dispatch(editCompany({ ...companyData, id: companyId || 0, admin }))
    }

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
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyEditorDialog
