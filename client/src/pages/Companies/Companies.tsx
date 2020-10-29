import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import CompanyTableRow from '../../components/CompanyTableRow'
import useWindowWidth from '../../components/shared/useWindowWidth'
import useStyles from './useStyles'
import { useTranslation } from 'react-i18next'

const Companies: React.FC = () => {
  const classes = useStyles()
  const windowWidth = useWindowWidth()
  const [t] = useTranslation()

  const showMore = windowWidth >= 600

  const testCompany = {
    id: 1,
    name: 'Test company',
    registrationNumber: '1234457854',
    address: 'Magyarorszag, 1141, Budapest, Mogyorodi ut 79.',
    joiningDate: new Date(),
    adminName: 'Teszt Tamas',
    adminEmail: 'test.tamas@example.com',
    adminJoiningDate: new Date()
  }

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.companies')}
        </Typography>
        <TableContainer>
          <Table aria-label="companies table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.emptyCell} />
                <TableCell className={classes.tableCell}>{t('company.name')}</TableCell>
                {showMore && (
                  <React.Fragment>
                    <TableCell className={classes.tableCell}>{t('company.registrationNumber')}</TableCell>
                    <TableCell className={classes.tableCell}>{t('company.admin')}</TableCell>
                    <TableCell className={classes.tableCell}>{t('company.joiningDate')}</TableCell>
                  </React.Fragment>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <CompanyTableRow company={testCompany} showMore={showMore} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default Companies
