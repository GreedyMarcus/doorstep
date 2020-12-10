import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import useStyles from './useStyles'

interface EditTableCellProps {
  tooltip: string
  onEdit: () => void
}

/**
 * Custom table cell component for editable table rows.
 */
const EditTableCell: React.FC<EditTableCellProps> = ({ tooltip, onEdit }) => {
  const classes = useStyles()

  return (
    <TableCell className={classes.tableCell}>
      <Tooltip title={tooltip}>
        <IconButton size="small" onClick={onEdit}>
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

export default EditTableCell
