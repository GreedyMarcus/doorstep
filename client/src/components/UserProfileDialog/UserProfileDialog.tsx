import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../../components/shared/PasswordField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useUserProfileDialog from './useUserProfileDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'

interface UserProfileDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to edit user credentials.
 */
const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [t] = useTranslation()
  const [isOpen, user, bindFirstName, bindLastName, bindPassword, handleSave, handleClose] = useUserProfileDialog({ onClose })

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('common.myProfile')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('common.userRole')}
        </Typography>

        <Typography className={classes.role} component="h1">
          {user ? t(`enum.userRole.${user.role}`) : ''}
        </Typography>

        <Typography className={classes.sectionTitle} component="h1">
          {t('common.basicData')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindFirstName} label={t('common.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} label={t('common.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <PasswordField {...bindPassword} label={t('common.password')} variant="outlined" fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default UserProfileDialog
