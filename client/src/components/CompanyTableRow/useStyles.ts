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
  iconTableCell: {
    width: theme.spacing(5)
  },
  collapseTableRowGrid: ({ collapseRowIndent }: Props) => ({
    padding: theme.spacing(1, collapseRowIndent === 'small' ? 3 : 9, 2)
  }),
  collapseContentTitle: {
    fontSize: 20,
    fontWeight: 600
  },
  collapseSectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5)
  },
  collapseItem: {
    fontSize: 14,
    marginBottom: theme.spacing(0.5)
  },
  bold: {
    fontWeight: 600
  }
}))
