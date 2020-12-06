import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Business host editor dialog component styling.
 */
export default makeStyles(theme => ({
  title: {
    background: theme.palette.primary.main,
    color: theme.palette.background.paper
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(2.5)
  },
  content: {
    padding: theme.spacing(0, 3, 3)
  }
}))
