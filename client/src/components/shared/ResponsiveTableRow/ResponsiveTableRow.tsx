import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

interface ResponsiveTableRowProps {
  labels: string[]
  extraCell: JSX.Element
}

/**
 * Custom table row component that provides responsive behaviour.
 */
const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({ labels, extraCell }) => {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const classes = useStyles({ fullScreen })

  const tableCells = fullScreen ? [labels[0]] : labels

  return (
    <TableRow className={classes.tableRow}>
      {tableCells.map((label, index) => (
        <TableCell key={index} className={classes.tableCell}>
          {label}
        </TableCell>
      ))}

      {extraCell}
    </TableRow>
  )
}

export default ResponsiveTableRow
