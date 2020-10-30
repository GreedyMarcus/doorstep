import { makeStyles } from '@material-ui/core/styles'

type Props = { collapseRowIndent: 'small' | 'medium' }

export default makeStyles(theme => ({
  mainTableRow: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'left'
  },
  collapseTableCell: {
    padding: theme.spacing(0)
  },
  expandTableCell: {
    width: theme.spacing(5)
  },
  collapseTableRowGrid: ({ collapseRowIndent }: Props) => ({
    padding: theme.spacing(1, collapseRowIndent === 'small' ? 3 : 9, 2)
  }),
  collapseContentTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(1.5)
  },
  collapseSectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: theme.spacing(1.5)
  },
  collapseItem: {
    fontSize: 14,
    marginBottom: theme.spacing(0.5)
  }
}))
