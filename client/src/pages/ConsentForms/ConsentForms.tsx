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
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { consentFormsSelector, fetchConsentForms } from '../../store/consentForm'

const ConsentForms: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
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
                  <TableCell className={classes.tableEmptyCell} />
                </TableRow>
              </TableHead>
              <TableBody>
                {consentForms.map(form => (
                  <TableRow key={form.id}>
                    <TableCell className={classes.tableBodyCell}>{form.title}</TableCell>
                    {showMore && (
                      <React.Fragment>
                        <TableCell className={classes.tableBodyCell}>{form.activeVersion || t('consentForm.noActiveVersion')}</TableCell>
                        <TableCell className={classes.tableBodyCell}>
                          {new Date(form.createdAt).toLocaleDateString(i18n.language)}
                        </TableCell>
                      </React.Fragment>
                    )}
                    <TableCell className={classes.tableEmptyCell}>
                      <Tooltip title={t('action.openConsentForm').toString()}>
                        <IconButton size="small" aria-label="show consent form" onClick={() => history.push(`/consent-forms/${form.id}`)}>
                          <OpenInNewRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentForms
