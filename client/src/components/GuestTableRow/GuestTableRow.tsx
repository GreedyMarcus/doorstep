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
import { VisitGuestInfo } from '../../data/types/Visit'
import { useTranslation } from 'react-i18next'
import { getLocaleDateFormat } from '../../utils'

type Props = {
  guest: VisitGuestInfo
  showMore: boolean
}

/**
 * Custom table row component that display guest data.
 */
const GuestTableRow: React.FC<Props> = ({ guest, showMore }) => {
  const classes = useStyles({ collapseRowIndent: showMore ? 'medium' : 'small' })
  const [isOpen, setOpen] = useState(false)
  const [t] = useTranslation()

  const handleExpand = () => setOpen(!isOpen)
  const unknownText = t('general.unknown')

  const actualEntryDate = guest.actualEntry ? getLocaleDateFormat(new Date(guest.actualEntry)) : unknownText
  const actualExitDate = guest.actualExit ? getLocaleDateFormat(new Date(guest.actualExit)) : unknownText
  const receptionistName = guest.receptionistName ?? unknownText
  const participationStatus = t(`guest.${guest.participationStatus}`)

  // Basic data texts
  const nameText = `${t('guest.name')}: ${guest.user.fullName}`
  const emailText = `${t('auth.email')}: ${guest.user.email}`
  const actualEntryText = `${t('guest.actualEntry')}: ${actualEntryDate}`
  const actualExitText = `${t('guest.actualExit')}: ${actualExitDate}`
  const receptionistNameText = `${t('guest.receptionistName')}: ${receptionistName}`
  const participationStatusText = `${t('guest.participationStatus')}: ${participationStatus}`

  // Additinal data texts
  const nationalityText = `${t('guest.nationality')}: ${guest.nationality || unknownText}`
  const phoneNumberText = `${t('guest.phoneNumber')}: ${guest.phoneNumber || unknownText}`
  const birthplaceText = `${t('guest.birthplace')}: ${guest.birthplace || unknownText}`
  const birthDateText = `${t('guest.birthDate')}: ${guest.birthDate || unknownText}`
  const motherNameText = `${t('guest.motherName')}: ${guest.motherName || unknownText}`
  const companyNameText = `${t('company.name')}: ${guest.company?.name || unknownText}`
  const companyRegistrationText = `${t('company.registrationNumber')}: ${guest.company?.registrationNumber || unknownText}`
  const companyAddressText = `${t('company.address')}: ${guest.company?.address || unknownText}`

  return (
    <React.Fragment>
      <TableRow className={classes.mainTableRow}>
        <TableCell className={classes.iconTableCell}>
          <IconButton size="small" aria-label="expand guest table row" onClick={handleExpand}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell className={classes.tableCell} onClick={handleExpand}>
          {guest.user.fullName}
        </TableCell>

        {showMore && (
          <React.Fragment>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {actualEntryDate}
            </TableCell>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {actualExitDate}
            </TableCell>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {receptionistName}
            </TableCell>
            <TableCell className={classes.tableCell} onClick={handleExpand}>
              {participationStatus}
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
                  {t('guest.details')}
                </Typography>
              </Grid>

              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('general.basicData')}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {nameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {emailText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {actualEntryText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {actualExitText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {receptionistNameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {participationStatusText}
                </Typography>
              </Grid>

              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('general.additionalData')}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {nationalityText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {phoneNumberText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {birthplaceText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {birthDateText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {motherNameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyNameText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyRegistrationText}
                </Typography>
                <Typography className={classes.collapseItem} gutterBottom>
                  {companyAddressText}
                </Typography>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default GuestTableRow
