import React from 'react'
import Widget from '../../components/shared/Widget'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import ResponsiveTableRow from '../../components/shared/ResponsiveTableRow'
import EditTableCell from '../../components/shared/EditTableCell'
import ReceptionistEditorDialog from '../../components/ReceptionistEditorDialog'
import useReceptionists from './useReceptionists'
import { useTranslation } from 'react-i18next'

/**
 * The receptionists page where the current receptionists are displayed.
 */
const Receptionists: React.FC = () => {
  const [t, i18n] = useTranslation()
  const [receptionists, editingReceptionist, handleReceptionistEditClick, handleReceptionistEditFinish] = useReceptionists()

  return (
    <>
      <Widget
        title={t('page.receptionists.pageTitle')}
        showContent={!!receptionists}
        hasContent={!!receptionists?.length}
        infoText={t('page.receptionists.noReceptionistsInfo')}
      >
        <TableContainer>
          <Table>
            <ResponsiveTableHead
              labels={[t('page.receptionists.receptionistName'), t('common.email'), t('page.receptionists.joiningDate')]}
              emptyEnd
            />
            <TableBody>
              {receptionists?.map(receptionist => (
                <ResponsiveTableRow
                  key={receptionist.id}
                  labels={[
                    `${receptionist.firstName} ${receptionist.lastName}`,
                    receptionist.email,
                    new Date(receptionist.createdAt).toLocaleDateString(i18n.language)
                  ]}
                  extraCell={
                    <EditTableCell
                      tooltip={t('action.editReceptionist')}
                      onEdit={() => handleReceptionistEditClick(receptionist)}
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Widget>
      {editingReceptionist && (
        <ReceptionistEditorDialog receptionist={editingReceptionist} isEditing={true} onClose={handleReceptionistEditFinish} />
      )}
    </>
  )
}

export default Receptionists
