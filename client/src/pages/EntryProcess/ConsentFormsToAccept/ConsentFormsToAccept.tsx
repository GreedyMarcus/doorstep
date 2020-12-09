import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../../components/ConsentFormVersionDialog'
import useStyles from '../useStyles'
import useConsentFormsToAccept from './useConsentFormsToAccept'
import { ConsentFormVersionDetails } from '../../../data/types/ConsentForm'
import { useTranslation } from 'react-i18next'

interface ConsentFormsToAcceptProps {
  visible: boolean
  forms: ConsentFormVersionDetails[] | undefined
  acceptedForms: number[] | undefined
  onBackClick: () => void
  onNextClick: (acceptedForms: number[]) => void
}

/**
 * Sub-component of the multi-step entry process form.
 * It handles the consent forms acceptance belongs to the guest user.
 */
const ConsentFormsToAccept: React.FC<ConsentFormsToAcceptProps> = ({
  visible,
  forms,
  acceptedForms,
  onBackClick,
  onNextClick
}) => {
  const classes = useStyles()

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  const [t] = useTranslation()
  const [checked, toggle, handleNextClick] = useConsentFormsToAccept({ forms, acceptedForms, onNextClick })

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Typography className={classes.formTitle} component="h3">
          {t('page.entryProcess.consentFormsToAccept')}
        </Typography>

        <List className={classes.formList}>
          {forms?.map(consentFormVersion => (
            <ListItem key={consentFormVersion.id}>
              <ListItemIcon onClick={() => toggle(consentFormVersion.id)}>
                <Tooltip title={t('action.acceptConsentForm').toString()}>
                  <Checkbox className={classes.checkbox} checked={checked.indexOf(consentFormVersion.id) !== -1} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={consentFormVersion.title} onClick={() => setOpenedFormVersion(consentFormVersion)} />
              <ListItemSecondaryAction>
                <Tooltip title={t('action.openConsentForm').toString()}>
                  <IconButton edge="end" onClick={() => setOpenedFormVersion(consentFormVersion)}>
                    <OpenInNewRoundedIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Grid container spacing={2} className={classes.grid}>
          <Grid className={classes.buttons} container justify="flex-end">
            <Button className={classes.button} onClick={onBackClick}>
              {t('action.back')}
            </Button>
            <Button className={classes.button} variant="contained" color="primary" type="submit">
              {t('action.next')}
            </Button>
          </Grid>
        </Grid>
      </form>

      {!!openedFormVersion && (
        <ConsentFormVersionDialog consentFormVersion={openedFormVersion} onClose={() => setOpenedFormVersion(null)} />
      )}
    </div>
  )
}

export default ConsentFormsToAccept
