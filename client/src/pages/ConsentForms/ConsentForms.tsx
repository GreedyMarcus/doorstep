import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { consentFormsSelector, fetchConsentForms } from '../../store/consentForm'

/**
 * The consent forms page where the current consent forms are displayed.
 */
const ConsentForms: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const consentForms = useSelector(consentFormsSelector)
  const [t, i18n] = useTranslation()

  /**
   * Loads consent forms when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchConsentForms())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('page.consentForms.pageTitle')}
        </Typography>

        {consentForms && (
          <>
            {!consentForms.length ? (
              <InfoBox text={t('page.consentForms.noConsentFormsInfo')} type="info" />
            ) : (
              <ResponsiveTable
                labels={[
                  t('page.consentForms.formTitle'),
                  t('page.consentForms.activeVersion'),
                  t('page.consentForms.createdDate')
                ]}
                data={consentForms.map(form => ({
                  id: form.id,
                  title: form.title,
                  activeVersion: form.activeVersion || t('page.consentForms.noActiveVersion'),
                  createdAt: new Date(form.createdAt).toLocaleDateString(i18n.language)
                }))}
                tooltipLabel={t('action.openConsentForm')}
                onOpenClick={formId => history.push(`/consent-forms/${formId}`)}
              />
            )}
          </>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentForms
