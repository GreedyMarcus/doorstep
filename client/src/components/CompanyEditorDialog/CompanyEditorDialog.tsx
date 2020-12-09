import React from 'react'
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
import useCompanyEditorDialog from './useCompanyEditorDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CompanyInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'

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
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [t] = useTranslation()
  const [
    isOpen,
    adminEditingChecked,
    bindName,
    bindRegistrationNumber,
    bindCountry,
    bindZipCode,
    bindCity,
    bindStreetAddress,
    bindFirstName,
    bindLastName,
    bindEmail,
    bindPassword,
    handleAdminEditingCheck,
    handleSave,
    handleClose
  ] = useCompanyEditorDialog({ company, isEditing, onClose })

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
            <Grid item sm={6} xs={12} key={labelLanguageKey}>
              <TextField {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
            </Grid>
          ))}
        </Grid>

        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.adminDetails')}
        </Typography>

        <Grid container spacing={2}>
          {companyAdminData.map(({ labelLanguageKey, binding }) => (
            <Grid item sm={6} xs={12} key={labelLanguageKey}>
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
            control={<Checkbox checked={adminEditingChecked} onChange={handleAdminEditingCheck} />}
          />
        )}
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyEditorDialog
