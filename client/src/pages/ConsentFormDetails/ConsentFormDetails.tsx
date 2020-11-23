import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import InfoBox from '../../components/shared/InfoBox'
import TextEditor from '../../components/TextEditor'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import {
  activeConsentFormSelector,
  fetchConsentFormById,
  createConsentFormVersion,
  updateConsentFormVersion,
  activateConsentFormVersion
} from '../../store/consentForm'

const ConsentFormDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const classes = useStyles({ fullScreen })
  const dispatch = useAppDispatch()
  const [t, i18n] = useTranslation()

  const activeConsentForm = useSelector(activeConsentFormSelector)
  const [openedVersion, setOpenedVersion] = useState(1)
  const [content, bindContent] = useInput({ required: true })

  // Store active version status in local state
  const [status, setStatus] = useState({
    disabled: false,
    edited: false,
    createdNew: false,
    openedDifferent: false
  })

  /**
   * Opens the specified consent form version.
   */
  const openConsentFormVersion = (versionNumber: number) => {
    setOpenedVersion(versionNumber)
    setStatus({ ...status, openedDifferent: true })

    if (activeConsentForm) {
      bindContent.change(activeConsentForm.versions[versionNumber - 1].content)
    }
  }

  /**
   * Drops all changes that made to the consent forms's content.
   */
  const handleDropContentChanges = () => {
    if (activeConsentForm) {
      bindContent.change(activeConsentForm.versions[openedVersion - 1].content)
    }
    setStatus({ ...status, openedDifferent: true })
  }

  /**
   * Creates new consent form version with the copy of the last one's content.
   */
  const handleConsentFormVersionCreation = () => {
    setStatus({ ...status, disabled: false, edited: false, createdNew: true })
    dispatch(createConsentFormVersion(content.value))
  }

  /**
   * Updates the current consent form version.
   */
  const handleConsentFormVersionUpdate = () => {
    if (activeConsentForm) {
      dispatch(updateConsentFormVersion(activeConsentForm.versions[openedVersion - 1].id, content.value))
    }
    setStatus({ ...status, disabled: false, edited: false })
  }

  /**
   * Actives the current consent form version, therefore that will be the version to accept.
   */
  const handleConsentFormVersionActivation = () => {
    if (activeConsentForm) {
      dispatch(activateConsentFormVersion(activeConsentForm.versions[openedVersion - 1].id))
    }
    setStatus({ ...status, disabled: true, edited: false })
  }

  /**
   * Reacts to the changes of the consent form.
   */
  useEffect(() => {
    if (!activeConsentForm) {
      dispatch(fetchConsentFormById(routeParams['consentFormId']))
      return
    }

    if (status.createdNew || !status.openedDifferent) {
      const openVersionNumber = activeConsentForm.versions.length
      setOpenedVersion(openVersionNumber)
      setStatus({ ...status, openedDifferent: true })
      bindContent.change(activeConsentForm.versions[openVersionNumber - 1].content)
    }
  }, [activeConsentForm])

  /**
   * Reacts to the changes of the consent form version.
   */
  useEffect(() => {
    if (content.value) {
      if (status.createdNew) {
        setStatus({ ...status, createdNew: false })
        return
      }

      if (status.openedDifferent) {
        let disabled = true
        if (activeConsentForm) {
          if (!activeConsentForm.activeVersion) {
            disabled = false
          } else if (
            activeConsentForm.activeVersion.versionNumber !== openedVersion &&
            activeConsentForm.versions.length === openedVersion
          ) {
            disabled = false
          }
        }
        setStatus({ ...status, openedDifferent: false, disabled, edited: false })
        return
      }

      setStatus({ ...status, disabled: false, edited: true })
    }
  }, [content.value, openedVersion])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        {!activeConsentForm ? (
          <InfoBox text={t('page.consentForms.notFound')} type="error" />
        ) : (
          <>
            <Typography className={classes.title} variant="h1">
              {t('page.consentForms.formDetails')}
            </Typography>

            <Grid className={classes.grid} container spacing={1}>
              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('page.consentForms.formTitle')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Typography variant="h2" className={classes.item}>
                  {activeConsentForm.title}
                </Typography>
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('page.consentForms.activeVersion')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Chip
                  className={classes.chip}
                  label={activeConsentForm.activeVersion?.versionNumber ?? t('page.consentForms.noActiveVersion')}
                />
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('page.consentForms.createdDate')}
                </Typography>
              </Grid>
              <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
                <Typography variant="h2" className={classes.item}>
                  {new Date(activeConsentForm.createdAt).toLocaleDateString(i18n.language)}
                </Typography>
              </Grid>

              <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
                <Typography variant="h2" className={classes.label}>
                  {t('page.consentForms.openedVersion')}
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
                    <MenuItem className={classes.menuItem} key={id} value={versionNumber}>
                      {versionNumber}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Typography className={classes.contentTitle} variant="h2">
              {t('page.consentForms.content')}
            </Typography>
            <Grid className={classes.grid} container spacing={2}>
              <Grid item xs={12}>
                <TextEditor {...bindContent} heightMultiplier={0.3} disabled={status.disabled} fullScreen={fullScreen} />
              </Grid>
            </Grid>

            <Grid className={classes.buttons} container justify="space-between">
              <Button
                style={
                  fullScreen
                    ? { display: !status.edited && !status.disabled ? 'inline' : 'none' }
                    : { visibility: !status.edited && !status.disabled ? 'visible' : 'hidden' }
                }
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={handleConsentFormVersionActivation}
              >
                {t('action.activate')}
              </Button>

              <div>
                <Button
                  style={{ display: status.edited ? 'inline' : 'none' }}
                  className={classes.button}
                  onClick={handleDropContentChanges}
                >
                  {t('action.cancel')}
                </Button>

                <Button
                  style={{ display: status.edited ? 'inline' : 'none' }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={content.error}
                  onClick={handleConsentFormVersionUpdate}
                >
                  {t('action.save')}
                </Button>

                <Button
                  style={{ display: !status.edited ? 'inline' : 'none' }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={handleConsentFormVersionCreation}
                >
                  {t('action.addConsentFormVersion')}
                </Button>
              </div>
            </Grid>
          </>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentFormDetails
