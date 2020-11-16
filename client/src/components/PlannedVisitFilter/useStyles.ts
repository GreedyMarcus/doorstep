import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 3, 2)
  },
  accordion: {
    background: theme.palette.grey[100]
  },
  grid: {
    paddingBottom: theme.spacing(2)
  },
  clear: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.spacing(1, 2, 2)} !important` as string // Workaround to use !important
  }
}))
