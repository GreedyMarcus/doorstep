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
  const [t, i18n] = useTranslation()

  const receptionists = useSelector(receptionistsSelector)
  const [activeReceptionistIndex, setActiveReceptionistIndex] = useState(-1)

  /**
   * Sets the specified receptionist to the active receptionist.
   */
  const handleEditClick = (receptionistId: number) => {
    const receptionistIndex = receptionists.findIndex(receptionist => receptionist.id === receptionistId)
    setActiveReceptionistIndex(receptionistIndex)
  }

  /**
   * Loads receptionists when component mounted.
   */
  useEffect(() => {
    dispatch(fetchReceptionists())
  }, [])

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('page.receptionists.pageTitle')}
          </Typography>

          {!receptionists.length ? (
            <InfoBox text={t('page.receptionists.noReceptionistsInfo')} type="info" />
          ) : (
            <ResponsiveTable
              labels={[t('page.receptionists.receptionistName'), t('common.email'), t('page.receptionists.joiningDate')]}
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
    </>
  )
}

export default BusinessHosts
