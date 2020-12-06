import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Navigation bar component styling.
 */
export default makeStyles(theme => ({
  homeIcon: {
    marginRight: theme.spacing(0.5)
  },
  homeTitle: {
    paddingTop: theme.spacing(0.25),
    marginRight: theme.spacing(1.5)
  },
  grow: {
    flexGrow: 1
  }
}))
