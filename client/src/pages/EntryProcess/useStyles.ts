import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Entry process page styling.
 */
export default makeStyles(theme => ({
  grid: {
    padding: theme.spacing(3)
  },
  stepper: {
    padding: theme.spacing(3, 1, 3)
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  item: {
    fontSize: 14
  },
  bold: {
    fontWeight: 600
  },
  select: {
    width: '100%',
    '& > div.MuiSelect-outlined': {
      padding: theme.spacing(1.25)
    }
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600
  },
  buttons: {
    margin: theme.spacing(2, 1, 0)
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  checkbox: {
    paddingTop: theme.spacing(1)
  },
  formList: {
    padding: theme.spacing(0, 2)
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 600,
    padding: theme.spacing(2, 4, 1)
  },
  signature: {
    border: '1px solid black',
    margin: theme.spacing(0, 1)
  }
}))
