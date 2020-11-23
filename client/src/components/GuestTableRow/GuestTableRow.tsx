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

interface GuestTableRowProps {
  guest: VisitGuestInfo
  showMore: boolean
}

/**
 * Custom table row component that display guest data.
 */
const GuestTableRow: React.FC<GuestTableRowProps> = ({ guest, showMore }) => {
  const classes = useStyles({ collapseRowIndent: showMore ? 'medium' : 'small' })
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(false)

  /**
   * Expands hidden company data.
   */
  const handleExpand = () => setOpen(!isOpen)

  const unknownText = t('general.unknown')

  const actualEntryDate = guest.actualEntry ? getLocaleDateFormat(new Date(guest.actualEntry)) : unknownText
  const actualExitDate = guest.actualExit ? getLocaleDateFormat(new Date(guest.actualExit)) : unknownText
  const receptionistName = guest.receptionistName ?? unknownText
  const participationStatus = t(`guest.${guest.participationStatus}`)

  const guestDataCell = [actualEntryDate, actualExitDate, receptionistName, participationStatus]

  const basicData = [
    { labelLanguageKey: 'page.visitDetails.guestName', value: guest.user.fullName },
    { labelLanguageKey: 'common.email', value: guest.user.email },
    { labelLanguageKey: 'page.visitDetails.actualEntry', value: actualEntryDate },
    { labelLanguageKey: 'page.visitDetails.actualExit', value: actualExitDate },
    { labelLanguageKey: 'page.visitDetails.receptionistName', value: receptionistName },
    { labelLanguageKey: 'page.visitDetails.participationStatus', value: participationStatus }
  ]

  const additionalData = [
    { labelLanguageKey: 'common.nationality', value: guest.nationality || unknownText },
    { labelLanguageKey: 'common.phoneNumber', value: guest.phoneNumber || unknownText },
    { labelLanguageKey: 'common.birthplace', value: guest.birthplace || unknownText },
    { labelLanguageKey: 'common.birthDate', value: guest.birthDate || unknownText },
    { labelLanguageKey: 'common.motherName', value: guest.motherName || unknownText },
    { labelLanguageKey: 'page.visitDetails.companyName', value: guest.company?.name || unknownText },
    { labelLanguageKey: 'page.visitDetails.companyRegistrationNumber', value: guest.company?.registrationNumber || unknownText },
    { labelLanguageKey: 'page.visitDetails.companyAddress', value: guest.company?.address || unknownText }
  ]

  return (
    <>
      <TableRow className={classes.mainTableRow}>
        <TableCell className={classes.iconTableCell}>
          <IconButton size="small" onClick={handleExpand}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell className={classes.tableCell} onClick={handleExpand}>
          {guest.user.fullName}
        </TableCell>

        {showMore && (
          <>
            {guestDataCell.map((data, index) => (
              <TableCell key={index} className={classes.tableCell} onClick={handleExpand}>
                {data}
              </TableCell>
            ))}
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell className={classes.collapseTableCell} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Grid container className={classes.collapseTableRowGrid}>
              <Grid item xs={12}>
                <Typography className={classes.collapseContentTitle} component="h1">
                  {t('page.visitDetails.guestDetails')}
                </Typography>
              </Grid>

              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('common.basicData')}
                </Typography>

                {basicData.map(({ labelLanguageKey, value }) => (
                  <Typography className={classes.collapseItem} gutterBottom key={labelLanguageKey}>
                    <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                  </Typography>
                ))}
              </Grid>

              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('common.additionalData')}
                </Typography>

                {additionalData.map(({ labelLanguageKey, value }) => (
                  <Typography className={classes.collapseItem} gutterBottom key={labelLanguageKey}>
                    <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default GuestTableRow
