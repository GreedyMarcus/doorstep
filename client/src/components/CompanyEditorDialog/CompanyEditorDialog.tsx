import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../shared/PasswordField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CompanyInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { registerCompany, updateCompany } from '../../store/company'

interface CompanyEditorDialogProps {
  company?: CompanyInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom dialog component to create or edit companies.
 */
const CompanyEditorDialog: React.FC<CompanyEditorDialogProps> = ({ company, isEditing, onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [isOpen, setOpen] = useState(true)
  const [adminEditingChecked, setAdminEditingChecked] = useState(false)

  const [name, bindName] = useInput({ initialValue: company?.name, required: true })
  const [registrationNumber, bindRegistrationNumber] = useInput({
    initialValue: company?.registrationNumber,
    required: true,
    validator: REGEXP.REGISTRATION_NUMBER
  })

  const address = company?.address.split(', ')

  const [country, bindCountry] = useInput({ initialValue: address && address[0], required: true })
  const [zipCode, bindZipCode] = useInput({ initialValue: address && address[1], required: true })
  const [city, bindCity] = useInput({ initialValue: address && address[2], required: true })
  const [streetAddress, bindStreetAddress] = useInput({ initialValue: address && address[3], required: true })

  const adminName = company?.adminName.split(' ')

  const [firstName, bindFirstName] = useInput({ initialValue: adminName && adminName[0], required: true })
  const [lastName, bindLastName] = useInput({ initialValue: adminName && adminName[1], required: true })
  const [email, bindEmail] = useInput({ initialValue: company?.adminEmail, required: true })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Validates the company data and optionally the admin data as well.
   */
  const validateCompanyData = (): boolean => {
    const companyInputs = [name, registrationNumber, country, zipCode, city, streetAddress]
    const adminInputs = [firstName, lastName, email, password]

    const inputsToValidate = isEditing && !adminEditingChecked ? companyInputs : [...companyInputs, ...adminInputs]
    return inputsToValidate.every(param => param.valid)
  }

  /**
   * Saves the new or modified company and optionalliy the company admin as well.
   */
  const handleSave = () => {
    const isCompanyDataValid = validateCompanyData()
    if (!isCompanyDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.company') }))
      return
    }

    const companyData = {
      name: name.value,
      registrationNumber: registrationNumber.value,
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

    if (isEditing) {
      const updateCompanyData = {
        ...companyData,
        id: company?.id || -1,
        admin: adminEditingChecked ? adminData : undefined
      }

      dispatch(updateCompany(updateCompanyData))
    } else {
      dispatch(registerCompany({ ...companyData, admin: adminData }))
    }

    handleClose()
  }

  const companyData = [
    { labelLanguageKey: 'page.companies.companyName', binding: bindName },
    { labelLanguageKey: 'page.companies.registrationNumber', binding: bindRegistrationNumber },
    { labelLanguageKey: 'common.country', binding: bindCountry },
    { labelLanguageKey: 'common.zipCode', binding: bindZipCode },
    { labelLanguageKey: 'common.city', binding: bindCity },
    { labelLanguageKey: 'common.streetAddress', binding: bindStreetAddress }
  ]

  const companyAdminData = [
    { labelLanguageKey: 'common.firstName', binding: bindFirstName },
    { labelLanguageKey: 'common.lastName', binding: bindLastName },
    { labelLanguageKey: 'common.email', binding: bindEmail }
  ]

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t(`action.${isEditing ? 'editCompany' : 'addCompany'}`)}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.companyDetails')}
        </Typography>

        <Grid container spacing={2}>
          {companyData.map(({ labelLanguageKey, binding }) => (
            <Grid item sm={6} xs={12}>
              <TextField {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
            </Grid>
          ))}
        </Grid>

        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.adminDetails')}
        </Typography>

        <Grid container spacing={2}>
          {companyAdminData.map(({ labelLanguageKey, binding }) => (
            <Grid item sm={6} xs={12}>
              <TextField
                {...binding}
                label={t(labelLanguageKey)}
                disabled={isEditing && !adminEditingChecked}
                variant="outlined"
                fullWidth
              />
            </Grid>
          ))}

          <Grid item sm={6} xs={12}>
            <PasswordField
              {...bindPassword}
              label={t('common.password')}
              disabled={isEditing && !adminEditingChecked}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>

        {isEditing && (
          <FormControlLabel
            className={classes.checkbox}
            label={t('page.companies.changeAdminCheck')}
            control={<Checkbox checked={adminEditingChecked} onChange={() => setAdminEditingChecked(!adminEditingChecked)} />}
          />
        )}
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyEditorDialog
