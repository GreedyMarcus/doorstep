import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useCompanyConfigDialog from './useCompanyConfigDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'

interface CompanyConfigDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to edit company configs.
 */
const CompanyConfigDialog: React.FC<CompanyConfigDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [t] = useTranslation()
  const [isOpen, guestDataSettings, otherSettings, handleSave, handleClose] = useCompanyConfigDialog({ onClose })

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('page.companies.companySettings')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.storedGuestData')}
        </Typography>

        {guestDataSettings.map(({ labelLanguageKey, checked, onChange }) => (
          <Grid className={classes.grid} container key={labelLanguageKey}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {t(labelLanguageKey)}
              </Typography>
            </Grid>

            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="secondary" />
            </Grid>
          </Grid>
        ))}

        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.otherSettings')}
        </Typography>

        {otherSettings.map(({ labelLanguageKey, checked, onChange }) => (
          <Grid className={classes.grid} container key={labelLanguageKey}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {t(labelLanguageKey)}
              </Typography>
            </Grid>

            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="secondary" />
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyConfigDialog
