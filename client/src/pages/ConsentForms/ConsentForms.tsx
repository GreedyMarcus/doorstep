import React, { useEffect } from 'react'
import Widget from '../../components/shared/Widget'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import ResponsiveTableRow from '../../components/shared/ResponsiveTableRow'
import OpenTableCell from '../../components/shared/OpenTableCell'
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
    <Widget
      title={t('page.consentForms.pageTitle')}
      showContent={!!consentForms}
      hasContent={!!consentForms?.length}
      infoText={t('page.consentForms.noConsentFormsInfo')}
    >
      <TableContainer className={classes.tableContainer}>
        <Table>
          <ResponsiveTableHead
            labels={[t('page.consentForms.formTitle'), t('page.consentForms.activeVersion'), t('page.consentForms.createdDate')]}
            emptyEnd
          />
          <TableBody>
            {consentForms?.map(form => (
              <ResponsiveTableRow
                key={form.id}
                labels={[
                  form.title,
                  form.activeVersion?.toString() || t('page.consentForms.noActiveVersion'),
                  new Date(form.createdAt).toLocaleDateString(i18n.language)
                ]}
                extraCell={
                  <OpenTableCell tooltip={t('action.openConsentForm')} onOpen={() => history.push(`/consent-forms/${form.id}`)} />
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Widget>
  )
}

export default ConsentForms
