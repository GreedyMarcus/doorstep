import { makeStyles } from '@material-ui/core/styles'

type Props = { fullScreen: boolean }

/**
 * Custom React hook that spearates the Collapsible table row component styling.
 */
export default makeStyles(theme => ({
  primaryTableRow: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  collapseTableCell: {
    width: theme.spacing(5)
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'left'
  },
  hiddenTableCell: ({ fullScreen }: Props) => ({
    padding: theme.spacing(0, fullScreen ? 0 : 6.5, 0)
  })
}))
