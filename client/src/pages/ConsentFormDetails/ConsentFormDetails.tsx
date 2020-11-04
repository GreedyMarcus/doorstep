import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import TextEditor from '../../components/TextEditor'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeConsentFormSelector, fetchConsentFormById } from '../../store/consentForm'

const ConsentFormDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const classes = useStyles({ fullScreen })
  const dispatch = useAppDispatch()
  const activeConsentForm = useSelector(activeConsentFormSelector)
  const [t, i18n] = useTranslation()

  const [openedVersion, setOpenedVersion] = useState(1)
  const [content, bindContent] = useInput('', true)
  const [editDisabled, setEditDisabled] = useState(false)
  const [edited, setEdited] = useState(false)
  const [isVersionChanged, setVersionChanged] = useState(true)

  const openConsentFormVersion = (versionNumber: number) => {
    if (activeConsentForm) {
      bindContent.onChange({ target: { value: activeConsentForm.versions[versionNumber - 1].content } })
    }
    setOpenedVersion(versionNumber)
    setVersionChanged(true)
  }

  const dropContentChanges = () => {
    setVersionChanged(true)
    bindContent.onChange({ target: { value: activeConsentForm?.versions[openedVersion - 1].content || '' } })
  }

  useEffect(() => {
    if (!activeConsentForm) {
      dispatch(fetchConsentFormById(routeParams['consentFormId']))
      return
    }

    const version = activeConsentForm.activeVersion?.versionNumber ?? activeConsentForm.versions.length
    setOpenedVersion(version)
    bindContent.onChange({ target: { value: activeConsentForm.versions[version - 1].content } })

    // Disable old and active form's editing
    if (version <= (activeConsentForm.activeVersion?.versionNumber || 0)) {
      setEditDisabled(true)
    }
  }, [activeConsentForm])

  useEffect(() => {
    // Check if we passed mounting
    if (content.value) {
      if (isVersionChanged) {
        setVersionChanged(false)
        setEdited(false)
      } else if (!edited) {
        setEdited(true)
      }
    }
  }, [content.value])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        {!activeConsentForm ? (
          <div className={classes.infoContainer}>
            <ErrorOutlineRoundedIcon className={classes.infoIcon} />
            <Typography className={classes.infoText} variant="h1">
              {t('consentForm.notFound')}
            </Typography>
          </div>
        ) : (
          <React.Fragment>
            <Typography className={classes.title} variant="h1">
              {t('consentForm.details')}
            </Typography>
            <Grid className={classes.grid} container spacing={1}>
              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('consentForm.title')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Typography variant="h2" className={classes.item}>
                  {activeConsentForm.title}
                </Typography>
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('consentForm.activeVersion')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Chip className={classes.chip} label={activeConsentForm.activeVersion?.versionNumber ?? t('consentForm.noActiveVersion')} />
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('consentForm.createdDate')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Typography variant="h2" className={classes.item}>
                  {new Date(activeConsentForm.createdAt).toLocaleDateString(i18n.language)}
                </Typography>
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('consentForm.openedVersion')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Select
                  className={classes.select}
                  fullWidth={fullScreen}
                  variant="outlined"
                  value={openedVersion}
                  onChange={e => openConsentFormVersion(Number(e.target.value))}
                >
                  {activeConsentForm.versions.map(({ id, versionNumber }) => (
                    <MenuItem key={id} value={versionNumber}>
                      {versionNumber}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Typography className={classes.contentTitle} variant="h2">
              {t('consentForm.content')}
            </Typography>
            <Grid className={classes.grid} container spacing={2}>
              <Grid item xs={12}>
                <TextEditor {...bindContent} heightMultiplier={0.3} disabled={editDisabled} fullScreen={fullScreen} />
              </Grid>
            </Grid>

            <Grid className={classes.buttons} container justify="space-between">
              <Button
                style={{ visibility: !editDisabled && !edited ? 'visible' : 'hidden' }}
                variant="contained"
                color="secondary"
                onClick={() => console.log('VERSION ACTIVATED')}
              >
                {t('general.activate')}
              </Button>

              <div>
                <Button style={{ display: edited ? 'inline' : 'none' }} className={classes.button} onClick={() => dropContentChanges()}>
                  {t('general.cancel')}
                </Button>

                <Button
                  style={{ display: edited ? 'inline' : 'none' }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => console.log('VERSION SAVED')}
                >
                  {t('general.save')}
                </Button>

                <Button
                  style={{ display: !editDisabled && !edited ? 'inline' : 'none' }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => console.log('NEW VERSION ADDED')}
                >
                  {t('action.addConsentFormVersion')}
                </Button>
              </div>
            </Grid>
          </React.Fragment>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentFormDetails
