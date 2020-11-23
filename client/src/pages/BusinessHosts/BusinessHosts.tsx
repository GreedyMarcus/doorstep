import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import BusinessHostEditorDialog from '../../components/BusinessHostEditorDialog'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { businessHostsSelector, fetchBusinessHosts } from '../../store/company'

/**
 * The business hosts page where the current business hosts are displayed.
 */
const BusinessHosts: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t, i18n] = useTranslation()

  const businessHosts = useSelector(businessHostsSelector)
  const [activeHost, setActiveHost] = useState(-1)

  /**
   * Sets the specified host to the active host.
   */
  const handleEditClick = (hostId: number) => {
    const hostIndex = businessHosts.findIndex(host => host.id === hostId)
    setActiveHost(hostIndex)
  }

  /**
   * Loads business hosts when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchBusinessHosts())
  }, [])

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('page.businessHosts.pageTitle')}
          </Typography>

          {businessHosts && (
            <>
              {!businessHosts.length ? (
                <InfoBox text={t('page.businessHosts.noBusinessHostsInfo')} type="info" />
              ) : (
                <ResponsiveTable
                  labels={[t('page.businessHosts.businessHostName'), t('common.email'), t('page.businessHosts.joiningDate')]}
                  data={businessHosts.map(host => ({
                    id: host.id,
                    name: `${host.firstName} ${host.lastName}`,
                    email: host.email,
                    createdAt: new Date(host.createdAt).toLocaleDateString(i18n.language)
                  }))}
                  tooltipLabel={t('action.editBusinessHost')}
                  onEditClick={handleEditClick}
                />
              )}
            </>
          )}
        </Paper>
      </Container>

      {activeHost !== -1 && (
        <BusinessHostEditorDialog businessHost={businessHosts[activeHost]} isEditing={true} onClose={() => setActiveHost(-1)} />
      )}
    </React.Fragment>
  )
}

export default BusinessHosts
