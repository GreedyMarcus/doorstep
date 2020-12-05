import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Action Tracker component styling.
 */
export default makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.background.paper
  }
}))
