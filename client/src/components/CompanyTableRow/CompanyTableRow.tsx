import React, { useState } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useStyles from './useStyles'
import { CompanyInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'

type Props = {
  company: CompanyInfo
  showMore: boolean
}

const CompanyTableRow: React.FC<Props> = ({ company, showMore }) => {
  const classes = useStyles({ collapseRowIndent: showMore ? 'medium' : 'small' })
  const [isOpen, setOpen] = useState(false)
  const [t, i18n] = useTranslation()

  const handleExpand = () => setOpen(!isOpen)

  const companyNameText = `${t('company.name')}: ${company.name}`
  const companyRegistrationNumberText = `${t('company.registrationNumber')}: ${company.registrationNumber}`
  const companyAddressText = `${t('company.address')}: ${company.address}`
  const companyJoiningDateText = `${t('company.joiningDate')}: ${company.joiningDate.toLocaleDateString(i18n.language)}`
  const companyAdminNameText = `${t('company.adminName')}: ${company.adminName}`
  const companyAdminEmailText = `${t('company.adminEmail')}: ${company.adminEmail}`
  const companyAdminJoiningDateText = `${t('company.joiningDate')}: ${company.adminJoiningDate.toLocaleDateString(i18n.language)}`

  return (
    <React.Fragment>
      <TableRow className={classes.mainTableRow}>
        <TableCell className={classes.expandTableCell} onClick={handleExpand}>
          <IconButton size="small" aria-label="expand company table row" onClick={handleExpand}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell} onClick={handleExpand}>
          {company.name}
        </TableCell>
        {showMore && (
          <React.Fragment>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {company.registrationNumber}
            </TableCell>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {company.adminName}
            </TableCell>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {company.joiningDate.toLocaleDateString(i18n.language)}
            </TableCell>
          </React.Fragment>
        )}
      </TableRow>
      <TableRow>
        <TableCell className={classes.collapseTableCell} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Grid container className={classes.collapseTableRowGrid}>
              <Grid item xs={12}>
                <Typography className={classes.collapseContentTitle} component="h1">
                  {t('general.details')}
                </Typography>
              </Grid>
              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('company.companyDetails')}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyNameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyRegistrationNumberText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyAddressText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyJoiningDateText}
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('company.adminDetails')}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyAdminNameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyAdminEmailText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyAdminJoiningDateText}
                </Typography>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default CompanyTableRow
