import { makeStyles } from '@material-ui/core/styles'

type Props = {
  error: boolean
  hasFocus: boolean
}

export default makeStyles(theme => ({
  container: ({ error, hasFocus }: Props) => {
    const grey = theme.palette.grey[400]
    const dark = theme.palette.grey[900]
    const danger = theme.palette.error.main
    const primary = theme.palette.primary.main

    return {
      '& > div.tox.tox-tinymce': {
        borderColor: hasFocus ? (error ? danger : primary) : 'transparent'
      },
      border: `1px solid ${hasFocus || error ? (error ? danger : primary) : grey}`,
      borderRadius: theme.shape.borderRadius,

      '&:hover': {
        borderColor: error ? danger : dark
      }
    }
  }
}))
