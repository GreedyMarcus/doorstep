import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import CompanyTableRow from '../../components/CompanyTableRow'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { companiesSelector, fetchCompanies } from '../../store/company'

/**
 * The companies page where current companies are displayed.
 */
const Companies: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const showMore = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const companies = useSelector(companiesSelector)

  /**
   * Loads companies when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchCompanies())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('page.companies.pageTitle')}
        </Typography>

        {companies && (
          <>
            {!companies.length ? (
              <InfoBox text={t('page.companies.noCompanyInfo')} type="info" />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.emptyCell} />
                      <TableCell className={classes.tableCell}>{t('page.companies.companyName')}</TableCell>
                      {showMore && (
                        <>
                          <TableCell className={classes.tableCell}>{t('page.companies.registrationNumber')}</TableCell>
                          <TableCell className={classes.tableCell}>{t('page.companies.admin')}</TableCell>
                          <TableCell className={classes.tableCell}>{t('page.companies.joiningDate')}</TableCell>
                        </>
                      )}
                      <TableCell className={classes.emptyCell} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.map(company => (
                      <CompanyTableRow key={company.id} company={company} showMore={showMore} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>
    </Container>
  )
}

export default Companies
