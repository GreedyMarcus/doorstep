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
import InfoIcon from '@material-ui/icons/Info'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { consentFormsSelector, fetchConsentForms } from '../../store/consentForm'

const ConsentForms: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const showMore = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const consentForms = useSelector(consentFormsSelector)
  const [t, i18n] = useTranslation()

  useEffect(() => {
    dispatch(fetchConsentForms())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.consentForms')}
        </Typography>
        {!consentForms.length ? (
          <div className={classes.infoContainer}>
            <InfoIcon className={classes.infoIcon} />
            <Typography className={classes.infoText} variant="h1">
              {t('consentForm.noConsentFormsInfo')}
            </Typography>
          </div>
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table aria-label="consent forms table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>{t('consentForm.title')}</TableCell>
                  {showMore && (
                    <React.Fragment>
                      <TableCell className={classes.tableHeaderCell}>{t('consentForm.activeVersion')}</TableCell>
                      <TableCell className={classes.tableHeaderCell}>{t('consentForm.createdDate')}</TableCell>
                    </React.Fragment>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {consentForms.map(form => {
                  const activeVersion = form.activeVersion || t('consentForm.noActiveVersion')
                  const createdDate = new Date(form.createdAt).toLocaleDateString(i18n.language)

                  return (
                    <TableRow key={form.id}>
                      <TableCell className={classes.tableBodyCell}>{form.title}</TableCell>
                      {showMore && (
                        <React.Fragment>
                          <TableCell className={classes.tableBodyCell}>{activeVersion}</TableCell>
                          <TableCell className={classes.tableBodyCell}>{createdDate}</TableCell>
                        </React.Fragment>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentForms
