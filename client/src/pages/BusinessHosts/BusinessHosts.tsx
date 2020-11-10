import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
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

  useEffect(() => {
    dispatch(fetchBusinessHosts())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.businessHosts')}
        </Typography>
        {!businessHosts.length ? (
          <InfoBox text={t('company.noBusinessHostsInfo')} />
        ) : (
          <ResponsiveTable
            labels={[t('company.businessHostName'), t('auth.email'), t('company.joiningDate')]}
            data={businessHosts.map(host => ({
              id: host.id,
              name: `${host.firstName} ${host.lastName}`,
              email: host.email,
              createdAt: host.createdAt.toLocaleDateString(i18n.language)
            }))}
            tooltipLabel={t('action.editBusinessHost')}
            editable
          />
        )}
      </Paper>
    </Container>
  )
}

export default BusinessHosts
