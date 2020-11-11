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
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

type Props = {
  labels: string[]
  data: any[]
  tooltipLabel: string
  onOpenClick?: (itemId: number) => void
  onEditClick?: (itemId: number) => void
}

const ConsentForms: React.FC<Props> = ({ labels, data, tooltipLabel, onOpenClick, onEditClick }) => {
  const classes = useStyles()
  const showMore = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [firstLabel, ...otherLabels] = labels

  const loadAdditionalTableCells = useCallback(
    (data: any[], className: string) => (
      <React.Fragment>
        {data.map(label => (
          <TableCell key={label} className={className}>
            {label}
          </TableCell>
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
            {(onOpenClick || onEditClick) && <TableCell className={classes.tableEmptyCell} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => {
            const [id, firstValue, ...otherValues] = Object.values(item)
            return (
              <TableRow key={id}>
                <TableCell className={classes.tableBodyCell}>{firstValue}</TableCell>
                {showMore && loadAdditionalTableCells(otherValues, classes.tableBodyCell)}
                {onOpenClick && !onEditClick && (
                  <TableCell className={classes.tableEmptyCell}>
                    <Tooltip title={tooltipLabel}>
                      <IconButton size="small" onClick={() => onOpenClick(id)}>
                        <OpenInNewRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
                {onEditClick && !onOpenClick && (
                  <TableCell className={classes.tableEmptyCell}>
                    <Tooltip title={tooltipLabel}>
                      <IconButton size="small" onClick={() => onEditClick(id)}>
                        <EditRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ConsentForms
