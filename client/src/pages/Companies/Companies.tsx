import React from 'react'
import Widget from '../../components/shared/Widget'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import CollapsibleTableRow from '../../components/shared/CollapsibleTableRow'
import EditTableCell from '../../components/shared/EditTableCell'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CompanyEditorDialog from '../../components/CompanyEditorDialog'
import useStyles from './useStyles'
import useCompanies from './useCompanies'
import { useTranslation } from 'react-i18next'

/**
 * The companies page where current companies are displayed.
 */
const Companies: React.FC = () => {
  const classes = useStyles()
  const [t, i18n] = useTranslation()
  const [
    companies,
    editingCompany,
    getCompanyDetails,
    getCompanyAdminDetails,
    handleCompanyEditClick,
    handleCompanyEditFinish
  ] = useCompanies()

  return (
    <>
      <Widget
        title={t('page.companies.pageTitle')}
        showContent={!!companies}
        hasContent={!!companies?.length}
        infoText={t('page.companies.noCompanyInfo')}
      >
        <TableContainer className={classes.tableContainer}>
          <Table>
            <ResponsiveTableHead
              labels={[
                t('page.companies.companyName'),
                t('page.companies.registrationNumber'),
                t('page.companies.admin'),
                t('page.companies.joiningDate')
              ]}
              emptyStart
              emptyEnd
            />
            <TableBody>
              {companies?.map(company => (
                <CollapsibleTableRow
                  key={company.id}
                  labels={[
                    company.name,
                    company.registrationNumber,
                    company.adminName,
                    new Date(company.createdAt).toLocaleDateString(i18n.language)
                  ]}
                  extraCell={<EditTableCell tooltip={t('action.editCompany')} onEdit={() => handleCompanyEditClick(company)} />}
                >
                  <Grid container className={classes.tableRowGrid}>
                    <Grid item xs={12}>
                      <Typography className={classes.contentTitle} component="h1">
                        {t('common.details')}
                      </Typography>
                    </Grid>

                    <Grid className={classes.item} item sm={6} xs={12}>
                      <Typography variant="h2" className={classes.sectionTitle}>
                        {t('page.companies.companyDetails')}
                      </Typography>

                      {getCompanyDetails(company).map(({ labelLanguageKey, value }) => (
                        <Typography className={classes.item} gutterBottom key={labelLanguageKey}>
                          <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                        </Typography>
                      ))}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <Typography variant="h2" className={classes.sectionTitle}>
                        {t('page.companies.adminDetails')}
                      </Typography>

                      {getCompanyAdminDetails(company).map(({ labelLanguageKey, value }) => (
                        <Typography className={classes.item} gutterBottom key={labelLanguageKey}>
                          <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </CollapsibleTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Widget>
      {editingCompany && <CompanyEditorDialog company={editingCompany} isEditing={true} onClose={handleCompanyEditFinish} />}
    </>
  )
}

export default Companies
