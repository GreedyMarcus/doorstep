import React, { useCallback } from 'react'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

type Props = {
  labels: string[]
  data: any[]
  openLabel: string
  onOpenClick: (itemId: number) => void
}

const ConsentForms: React.FC<Props> = ({ labels, data, openLabel, onOpenClick }) => {
  const classes = useStyles()
  const showMore = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [firstLabel, ...otherLabels] = labels

  const loadAdditionalTableCells = useCallback(
    (data: any[], className: string) => (
      <React.Fragment>
        {data.map(label => (
          <TableCell className={className}>{label}</TableCell>
        ))}
      </React.Fragment>
    ),
    [labels, data]
  )

  return (
    <TableContainer className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>{firstLabel}</TableCell>
            {showMore && loadAdditionalTableCells(otherLabels, classes.tableHeaderCell)}
            <TableCell className={classes.tableEmptyCell} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => {
            const [id, firstValue, ...otherValues] = Object.values(item)
            return (
              <TableRow key={id}>
                <TableCell className={classes.tableBodyCell}>{firstValue}</TableCell>
                {showMore && loadAdditionalTableCells(otherValues, classes.tableBodyCell)}
                <TableCell className={classes.tableEmptyCell}>
                  <Tooltip title={openLabel}>
                    <IconButton size="small" onClick={() => onOpenClick(id)}>
                      <OpenInNewRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ConsentForms
