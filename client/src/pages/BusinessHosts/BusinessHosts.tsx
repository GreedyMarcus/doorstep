import React from 'react'
import Widget from '../../components/shared/Widget'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import ResponsiveTableRow from '../../components/shared/ResponsiveTableRow'
import EditTableCell from '../../components/shared/EditTableCell'
import BusinessHostEditorDialog from '../../components/BusinessHostEditorDialog'
import useBusinessHosts from './useBusinessHosts'
import { useTranslation } from 'react-i18next'

/**
 * The business hosts page where the current business hosts are displayed.
 */
const BusinessHosts: React.FC = () => {
  const [t, i18n] = useTranslation()
  const [businessHosts, editingBusinessHost, handleBusinessHostEditClick, handleBusinessHostEditFinish] = useBusinessHosts()

  return (
    <>
      <Widget
        title={t('page.businessHosts.pageTitle')}
        showContent={!!businessHosts}
        hasContent={!!businessHosts?.length}
        infoText={t('page.businessHosts.noBusinessHostsInfo')}
      >
        <TableContainer>
          <Table>
            <ResponsiveTableHead
              labels={[t('page.businessHosts.businessHostName'), t('common.email'), t('page.businessHosts.joiningDate')]}
              emptyEnd
            />
            <TableBody>
              {businessHosts?.map(host => (
                <ResponsiveTableRow
                  key={host.id}
                  labels={[
                    `${host.firstName} ${host.lastName}`,
                    host.email,
                    new Date(host.createdAt).toLocaleDateString(i18n.language)
                  ]}
                  extraCell={
                    <EditTableCell tooltip={t('action.editBusinessHost')} onEdit={() => handleBusinessHostEditClick(host)} />
                  }
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Widget>
      {editingBusinessHost && (
        <BusinessHostEditorDialog businessHost={editingBusinessHost} isEditing={true} onClose={handleBusinessHostEditFinish} />
      )}
    </>
  )
}

export default BusinessHosts
