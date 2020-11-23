import React, { useState } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CompanyEditorDialog from '../../components/CompanyEditorDialog'
import useStyles from './useStyles'
import { CompanyInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'

interface CompanyTableRowProps {
  company: CompanyInfo
  showMore: boolean
}

/**
 * Custom table row component that display company data.
 */
const CompanyTableRow: React.FC<CompanyTableRowProps> = ({ company, showMore }) => {
  const classes = useStyles({ collapseRowIndent: showMore ? 'medium' : 'small' })
  const [t, i18n] = useTranslation()

  const [isOpen, setOpen] = useState(false)
  const [isEditing, setEditing] = useState(false)

  /**
   * Expands hidden company data.
   */
  const handleExpand = () => setOpen(!isOpen)

  const companyDataCell = [
    company.registrationNumber,
    company.adminName,
    new Date(company.createdAt).toLocaleDateString(i18n.language)
  ]

  const companyDetails = [
    { labelLanguageKey: 'page.companies.companyName', value: company.name },
    { labelLanguageKey: 'page.companies.registrationNumber', value: company.registrationNumber },
    { labelLanguageKey: 'page.companies.companyAddress', value: company.address },
    { labelLanguageKey: 'page.companies.joiningDate', value: new Date(company.createdAt).toLocaleDateString(i18n.language) }
  ]

  const companyAdminDetails = [
    { labelLanguageKey: 'page.companies.adminName', value: company.adminName },
    { labelLanguageKey: 'page.companies.adminEmail', value: company.adminEmail },
    { labelLanguageKey: 'page.companies.joiningDate', value: new Date(company.adminJoinedAt).toLocaleDateString(i18n.language) }
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
          {company.name}
        </TableCell>

        {showMore && (
          <>
            {companyDataCell.map((data, index) => (
              <TableCell key={index} className={classes.tableCell} onClick={handleExpand}>
                {data}
              </TableCell>
            ))}
          </>
        )}

        <TableCell className={classes.iconTableCell}>
          <Tooltip key={company.id} title={t('action.editCompany').toString()}>
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditRoundedIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.collapseTableCell} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Grid container className={classes.collapseTableRowGrid}>
              <Grid item xs={12}>
                <Typography className={classes.collapseContentTitle} component="h1">
                  {t('common.details')}
                </Typography>
              </Grid>

              <Grid className={classes.collapseItem} item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('page.companies.companyDetails')}
                </Typography>

                {companyDetails.map(({ labelLanguageKey, value }) => (
                  <Typography className={classes.collapseItem} gutterBottom key={labelLanguageKey}>
                    <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                  </Typography>
                ))}
              </Grid>

              <Grid item sm={6} xs={12}>
                <Typography variant="h2" className={classes.collapseSectionTitle}>
                  {t('page.companies.adminDetails')}
                </Typography>

                {companyAdminDetails.map(({ labelLanguageKey, value }) => (
                  <Typography className={classes.collapseItem} gutterBottom key={labelLanguageKey}>
                    <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
      {isEditing && <CompanyEditorDialog company={company} isEditing={true} onClose={() => setEditing(false)} />}
    </>
  )
}

export default CompanyTableRow
