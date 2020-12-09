import React from 'react'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

interface ResponsiveTableHeadProps {
  labels: string[]

  /**
   * If the component should render an empty cell at the start.
   */
  emptyStart?: boolean

  /**
   * If the component should render an empty cell at the end.
   */
  emptyEnd?: boolean
}

/**
 * Custom component that displays table head data with responsive behaviour.
 */
const ResponsiveTableHead: React.FC<ResponsiveTableHeadProps> = ({ labels, emptyStart, emptyEnd }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const headers = fullScreen ? [labels[0]] : labels

  return (
    <TableHead>
      <TableRow>
        {emptyStart && <TableCell className={classes.emptyCell} />}
        {headers.map((label, index) => (
          <TableCell className={classes.tableCell} key={index}>
            {label}
          </TableCell>
        ))}
        {emptyEnd && <TableCell className={classes.emptyCell} />}
      </TableRow>
    </TableHead>
  )
}

ResponsiveTableHead.defaultProps = {
  emptyStart: false,
  emptyEnd: false
}

export default ResponsiveTableHead
