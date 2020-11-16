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

const BusinessHosts: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const businessHosts = useSelector(businessHostsSelector)
  const [t, i18n] = useTranslation()

  const [activeHostIndex, setActiveHostIndex] = useState(-1)

  const handleEditClick = (businessHostId: number) => {
    const hostIndex = businessHosts.findIndex(host => host.id === businessHostId)
    setActiveHostIndex(hostIndex)
  }

  useEffect(() => {
    dispatch(fetchBusinessHosts())
  }, [])

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('general.businessHosts')}
          </Typography>
          {!businessHosts.length ? (
            <InfoBox text={t('company.noBusinessHostsInfo')} type="info" />
          ) : (
            <ResponsiveTable
              labels={[t('company.businessHostName'), t('auth.email'), t('company.joiningDate')]}
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
        </Paper>
      </Container>
      {activeHostIndex !== -1 && (
        <BusinessHostEditorDialog
          businessHost={businessHosts[activeHostIndex]}
          isEditing={true}
          onClose={() => setActiveHostIndex(-1)}
        />
      )}
    </React.Fragment>
  )
}

export default BusinessHosts
