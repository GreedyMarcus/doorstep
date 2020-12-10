import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import useStyles from './useStyles'

interface OpenTableCellProps {
  tooltip: string
  onOpen: () => void
}

/**
 * Custom table cell component for openable table rows.
 */
const OpenTableCell: React.FC<OpenTableCellProps> = ({ tooltip, onOpen }) => {
  const classes = useStyles()

  return (
    <TableCell className={classes.tableCell}>
      <Tooltip title={tooltip}>
        <IconButton size="small" onClick={onOpen}>
          <OpenInNewRoundedIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

export default OpenTableCell
