import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import ReceptionistEditorDialog from '../../components/ReceptionistEditorDialog'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { receptionistsSelector, fetchReceptionists } from '../../store/building'

const BusinessHosts: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const receptionists = useSelector(receptionistsSelector)
  const [t, i18n] = useTranslation()

  const [activeReceptionistIndex, setActiveReceptionistIndex] = useState(-1)

  const handleEditClick = (receptionistId: number) => {
    const receptionistIndex = receptionists.findIndex(receptionist => receptionist.id === receptionistId)
    setActiveReceptionistIndex(receptionistIndex)
  }

  useEffect(() => {
    dispatch(fetchReceptionists())
  }, [])

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('general.receptionists')}
          </Typography>
          {!receptionists.length ? (
            <InfoBox text={t('building.noReceptionistsInfo')} type="info" />
          ) : (
            <ResponsiveTable
              labels={[t('building.receptionistName'), t('auth.email'), t('company.joiningDate')]}
              data={receptionists.map(receptionist => ({
                id: receptionist.id,
                name: `${receptionist.firstName} ${receptionist.lastName}`,
                email: receptionist.email,
                createdAt: new Date(receptionist.createdAt).toLocaleDateString(i18n.language)
              }))}
              tooltipLabel={t('action.editReceptionist')}
              onEditClick={handleEditClick}
            />
          )}
        </Paper>
      </Container>
      {activeReceptionistIndex !== -1 && (
        <ReceptionistEditorDialog
          receptionist={receptionists[activeReceptionistIndex]}
          isEditing={true}
          onClose={() => setActiveReceptionistIndex(-1)}
        />
      )}
    </React.Fragment>
  )
}

export default BusinessHosts
