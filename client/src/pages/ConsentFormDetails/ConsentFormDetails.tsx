import React from 'react'
import Widget from '../../components/shared/Widget'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import TextEditor from '../../components/TextEditor'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useConsentFormDetails from './useConsentFormDetails'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * The consent form details page where the current consent form is displayed.
 */
const ConsentFormDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const classes = useStyles({ fullScreen })

  const [t, i18n] = useTranslation()
  const [
    status,
    activeConsentForm,
    openedVersion,
    content,
    bindContent,
    changeContent,
    openConsentFormVersion,
    handleDropContentChanges,
    handleConsentFormVersionCreation,
    handleConsentFormVersionUpdate,
    handleConsentFormVersionActivation
  ] = useConsentFormDetails({
    consentFormId: Number(routeParams['consentFormId'])
  })

  return (
    <Widget
      title={t('page.consentForms.formDetails')}
      showContent={!!activeConsentForm}
      hasContent={!!activeConsentForm}
      infoText={t('page.consentForms.notFound')}
    >
      <Grid className={classes.grid} container spacing={1}>
        <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
          <Typography variant="h2" className={classes.label}>
            {t('page.consentForms.formTitle')}
          </Typography>
        </Grid>
        <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
          <Typography variant="h2" className={classes.item}>
            {activeConsentForm?.title}
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
            label={activeConsentForm?.activeVersion?.versionNumber ?? t('page.consentForms.noActiveVersion')}
          />
        </Grid>

        <Grid className={classes.gridItemHeader} item md={2} sm={6} xs={12}>
          <Typography variant="h2" className={classes.label}>
            {t('page.consentForms.createdDate')}
          </Typography>
        </Grid>
        <Grid className={classes.gridItem} item md={4} sm={6} xs={12}>
          <Typography variant="h2" className={classes.item}>
            {activeConsentForm ? new Date(activeConsentForm.createdAt).toLocaleDateString(i18n.language) : ''}
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
            {activeConsentForm?.versions.map(({ id, versionNumber }) => (
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
          <TextEditor
            {...bindContent}
            onValueChange={changeContent}
            heightMultiplier={0.3}
            disabled={status.disabled}
            fullScreen={fullScreen}
          />
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
    </Widget>
  )
}

export default ConsentFormDetails
