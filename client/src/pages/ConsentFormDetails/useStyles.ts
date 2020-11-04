import { makeStyles } from '@material-ui/core/styles'

type Props = { fullScreen: boolean }

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4)
  },
  grid: {
    padding: theme.spacing(1, 3, 2)
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 2)
  },
  label: {
    fontSize: 16,
    fontWeight: 600
  },
  gridItemHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  gridItem: ({ fullScreen }: Props) => {
    const margin = fullScreen ? { marginBottom: theme.spacing(1.25) } : {}
    return {
      ...margin,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  },
  item: {
    fontSize: 16,
    fontWeight: 500
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 600,
    padding: theme.spacing(0, 3, 1)
  },
  select: ({ fullScreen }: Props) => {
    const width = !fullScreen ? { maxWidth: 160 } : {}
    return {
      ...width,
      '& > div.MuiSelect-outlined': {
        padding: theme.spacing(1.25)
      }
    }
  },
  chip: ({ fullScreen }: Props) => {
    const width = !fullScreen ? { maxWidth: 160 } : {}
    return {
      ...width,
      fontWeight: 600,
      borderRadius: theme.spacing(1),
      textAlign: 'center',
      background: theme.palette.error.main,
      color: theme.palette.background.paper
    }
  },
  infoContainer: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: 60,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(3)
  },
  infoText: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  },
  buttons: {
    padding: theme.spacing(1, 3, 3)
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}))
