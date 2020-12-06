import React, { useState } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Collapse from '@material-ui/core/Collapse'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'

interface CollapsibleTableRowProps {
  labels: string[]
  extraCell: JSX.Element
}

/**
 * Custom table row component that has collapsible data and provides responsive behaviour.
 */
const CollapsibleTableRow: React.FC<CollapsibleTableRowProps> = ({ labels, extraCell, children }) => {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const classes = useStyles({ fullScreen })

  const [t] = useTranslation()
  const [isCollapsed, setCollapsed] = useState(true)

  const tableCells = fullScreen ? [labels[0]] : labels

  /**
   * Toggles between expanded and collapsed table row state.
   */
  const handleCollapse = () => setCollapsed(!isCollapsed)

  return (
    <>
      <TableRow className={classes.primaryTableRow}>
        <TableCell className={classes.collapseTableCell}>
          <Tooltip title={t(`action.${isCollapsed ? 'showMore' : 'showLess'}`).toString()}>
            <IconButton size="small" onClick={handleCollapse}>
              {isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>

        {tableCells.map((label, index) => (
          <TableCell key={index} className={classes.tableCell} onClick={handleCollapse}>
            {label}
          </TableCell>
        ))}

        {extraCell}
      </TableRow>
      <TableRow>
        <TableCell className={classes.hiddenTableCell} colSpan={6}>
          <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default CollapsibleTableRow
