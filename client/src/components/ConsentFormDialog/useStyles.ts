import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Consent form dialog component styling.
 */
export default makeStyles(theme => ({
  title: {
    background: theme.palette.primary.main,
    color: theme.palette.background.paper
  }
}))
